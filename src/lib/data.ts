import { prisma } from "@/lib/prisma";
import type {
  Need as DbNeed,
  NeedLineItem as DbNeedLineItem,
  SchoolProfile as DbSchool,
  Product as DbProduct,
  Category as DbCategory,
  Story as DbStory,
  Prisma,
} from "@prisma/client";
import type { Need, Product, Category, Story, School } from "@/lib/mock-data";

// Adapts real database rows into the exact view-model shapes the UI components
// (NeedCard, ProductCard, CategoryCard, ...) already expect from mock-data.ts, so those
// components never had to change while pages moved from static mock arrays to Prisma.

const PRODUCT_IMAGE_BY_SLUG: Record<string, Product["image"]> = {
  "student-backpack": "backpack",
  "notebook-100": "notebook",
  "color-pencils-12": "pencil",
  "geo-globe-30": "globe",
  "classroom-whiteboard": "board",
  "student-chair": "chair",
  "lab-kit-basic": "lab",
  "volleyball-set": "sports",
  "workbook-set": "book",
  "educational-wall-map": "globe",
};

const STOCK_STATUS_MAP: Record<DbProduct["stockStatus"], Product["stock"]> = {
  IN_STOCK: "in_stock",
  LIMITED: "limited",
  BACKORDER: "backorder",
  OUT_OF_STOCK: "out_of_stock",
};

const NEED_STATUS_MAP: Record<DbNeed["status"], Need["status"]> = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  NEAR_COMPLETE: "near_complete",
  FULFILLED: "near_complete",
  CLOSED: "near_complete",
};

function toProduct(product: DbProduct & { category: DbCategory }): Product {
  const attributes = (product.attributes as Record<string, string> | null) ?? {};
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category.name,
    categorySlug: product.category.slug,
    priceToman: product.priceToman,
    compareAtToman: product.compareAtPriceToman ?? undefined,
    tokenPrice: product.creditPriceTokens ?? undefined,
    image: PRODUCT_IMAGE_BY_SLUG[product.slug] ?? "book",
    stock: STOCK_STATUS_MAP[product.stockStatus],
    description: product.description,
    bulkAvailable: product.bulkOrderAvailable,
    unit: product.unit,
    minOrderQty: product.minOrderQty,
    supplyDays: undefined,
    shippingTerms: undefined,
    maxOrderQty: product.maxOrderQty ?? undefined,
    specs: Object.entries(attributes).map(([label, value]) => ({ label, value })),
  };
}

function toNeed(need: DbNeed & { lineItems: DbNeedLineItem[] }): Need {
  const primaryLine = need.lineItems[0];
  const beneficiaryMeta = (need.beneficiaryMeta as { label: string; value: string }[] | null) ?? undefined;

  return {
    id: need.id,
    lineItemId: primaryLine?.id ?? "",
    title: need.title,
    beneficiary: need.studentGroupLabel ?? "",
    location: need.province,
    needed: primaryLine?.qtyNeeded ?? 0,
    fulfilled: primaryLine?.qtyFulfilled ?? 0,
    unit: primaryLine?.unit ?? "عدد",
    category: need.needType as Need["category"],
    audience: need.beneficiaryType === "STUDENT" ? "student" : "school",
    status: NEED_STATUS_MAP[need.status],
    description: need.description,
    whyItMatters: need.whyItMatters ?? undefined,
    beneficiaryMeta,
  };
}

function toCategory(category: DbCategory & { _count: { products: number } }): Category {
  return {
    slug: category.slug,
    name: category.name,
    description: category.description ?? "",
    icon: (category.icon as Category["icon"]) ?? "box",
    productCount: category._count.products,
  };
}

function toStory(story: DbStory): Story {
  return {
    id: story.id,
    title: story.title,
    person: story.person ?? "",
    excerpt: story.excerpt,
    body: story.body,
  };
}

function toSchool(school: DbSchool, needsCount: number, fulfilledPct: number): School {
  return {
    id: school.id,
    name: school.name,
    city: school.city,
    province: school.province,
    level: school.level,
    studentCount: school.studentCount ?? 0,
    needsCount,
    fulfilledPct,
    description: school.description ?? "",
  };
}

const productInclude = { category: true } satisfies Prisma.ProductInclude;
const needInclude = { lineItems: true } satisfies Prisma.NeedInclude;

export async function getAllNeeds(): Promise<Need[]> {
  const needs = await prisma.need.findMany({ include: needInclude, orderBy: { createdAt: "desc" } });
  return needs.map(toNeed);
}

export async function getHomeNeeds(): Promise<Need[]> {
  const needs = await getAllNeeds();
  return needs.slice(0, 4);
}

export async function getNeedById(id: string): Promise<Need | null> {
  const need = await prisma.need.findUnique({ where: { id }, include: needInclude });
  return need ? toNeed(need) : null;
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });
  return categories.map(toCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });
  return category ? toCategory(category) : null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { createdAt: "asc" },
  });
  return products.map(toProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true, category: { slug: categorySlug } },
    include: productInclude,
    orderBy: { createdAt: "asc" },
  });
  return products.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({ where: { slug }, include: productInclude });
  return product ? toProduct(product) : null;
}

export async function getStories(): Promise<Story[]> {
  const stories = await prisma.story.findMany({ orderBy: { publishedAt: "desc" } });
  return stories.map(toStory);
}

export async function getStoryById(id: string): Promise<Story | null> {
  const story = await prisma.story.findUnique({ where: { id } });
  return story ? toStory(story) : null;
}

export async function getImpactStats() {
  const stats = await prisma.impactStat.findMany();
  const byKey = new Map(stats.map((s) => [s.key, Number(s.value)]));
  return [
    { key: "students", label: "دانش‌آموز تحت حمایت", value: byKey.get("studentsSupported") ?? 0 },
    { key: "schools", label: "مدرسه", value: byKey.get("schoolsCount") ?? 0 },
    { key: "items", label: "قلم کالای تأمین‌شده", value: byKey.get("itemsFulfilled") ?? 0 },
  ];
}

export async function getSchools(): Promise<School[]> {
  const schools = await prisma.schoolProfile.findMany({
    include: { needs: { include: { lineItems: true } } },
    orderBy: { createdAt: "asc" },
  });
  return schools.map((school) => {
    const needsCount = school.needs.length;
    const fulfilledPct = computeFulfilledPct(school.needs);
    return toSchool(school, needsCount, fulfilledPct);
  });
}

export async function getSchoolById(id: string): Promise<School | null> {
  const school = await prisma.schoolProfile.findUnique({
    where: { id },
    include: { needs: { include: { lineItems: true } } },
  });
  if (!school) return null;
  return toSchool(school, school.needs.length, computeFulfilledPct(school.needs));
}

export async function getNeedsBySchool(schoolId: string): Promise<Need[]> {
  const needs = await prisma.need.findMany({ where: { schoolId }, include: needInclude });
  return needs.map(toNeed);
}

// ---------------------------------------------------------------------------
// Account (session-scoped) data — not part of the mock-data view-model,
// these return native Prisma-shaped objects since there's no legacy mock shape to match.
// ---------------------------------------------------------------------------

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { studentProfile: { include: { school: true } }, schoolProfile: true },
  });
}

export async function getStudentProfileByUserId(userId: string) {
  return prisma.studentProfile.findUnique({ where: { userId }, include: { school: true } });
}

export async function getTokenLedgerByStudentId(studentId: string) {
  return prisma.tokenLedger.findMany({ where: { studentId }, orderBy: { createdAt: "desc" } });
}

export async function getOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({ where: { id }, include: { items: true } });
}

export async function getOrderByOrderNumber(orderNumber: string) {
  return prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
}

export async function getContributionsByUserId(userId: string) {
  return prisma.contribution.findMany({
    where: { userId },
    include: { need: true, needLineItem: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCreditGrantsByDonorId(userId: string) {
  const grants = await prisma.creditGrant.findMany({
    where: { donorUserId: userId },
    orderBy: { createdAt: "desc" },
  });

  const studentIds = grants.map((g) => g.targetStudentId).filter((id): id is string => id != null);
  const students = studentIds.length
    ? await prisma.studentProfile.findMany({ where: { id: { in: studentIds } }, include: { school: true } })
    : [];
  const studentById = new Map(students.map((s) => [s.id, s]));

  return grants.map((g) => ({ ...g, targetStudent: g.targetStudentId ? studentById.get(g.targetStudentId) ?? null : null }));
}

// ---------------------------------------------------------------------------
// Admin panel data
// ---------------------------------------------------------------------------

export async function getSchoolNeedRequests(status?: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED") {
  return prisma.schoolNeedRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getSchoolNeedRequestById(id: string) {
  return prisma.schoolNeedRequest.findUnique({ where: { id } });
}

export async function getAllOrdersForAdmin() {
  return prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getAdminStats() {
  const [pendingRequests, totalNeeds, activeNeeds, totalProducts, totalOrders, totalUsers, contactMessages] =
    await Promise.all([
      prisma.schoolNeedRequest.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
      prisma.need.count(),
      prisma.need.count({ where: { status: { in: ["NEW", "IN_PROGRESS", "NEAR_COMPLETE"] } } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.contactMessage.count(),
    ]);
  return { pendingRequests, totalNeeds, activeNeeds, totalProducts, totalOrders, totalUsers, contactMessages };
}

export async function getContactMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAllNeedsForAdmin() {
  return prisma.need.findMany({
    include: { lineItems: true, school: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function getAllProductsForAdmin() {
  return prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" }, take: 200 });
}

export async function getAllUsersForAdmin() {
  return prisma.user.findMany({
    include: { studentProfile: true, schoolProfile: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

function computeFulfilledPct(needs: (DbNeed & { lineItems: DbNeedLineItem[] })[]): number {
  if (needs.length === 0) return 0;
  const ratios = needs.map((need) => {
    const primaryLine = need.lineItems[0];
    if (!primaryLine || primaryLine.qtyNeeded === 0) return 0;
    return primaryLine.qtyFulfilled / primaryLine.qtyNeeded;
  });
  const avg = ratios.reduce((sum, r) => sum + r, 0) / ratios.length;
  return Math.round(avg * 100);
}
