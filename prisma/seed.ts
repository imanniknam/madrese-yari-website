import "dotenv/config";
import { PrismaClient, BeneficiaryType, NeedStatus, ImpactStatKey } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/auth/password";

const SEED_PASSWORD = "Passw0rd!23";
const ADMIN_PASSWORD = "Admin@12345";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "تجهیزات کلاس", slug: "classroom-equipment", icon: "board", sortOrder: 1, description: "تخته، میز و صندلی و دیگر تجهیزات کلاس" },
  { name: "وسایل کمک‌آموزشی", slug: "learning-aids", icon: "globe", sortOrder: 2, description: "ابزارها و وسایلی که یادگیری را ملموس‌تر می‌کنند" },
  { name: "کتاب و منابع آموزشی", slug: "books", icon: "book", sortOrder: 3, description: "کتاب‌های درسی، کمک‌آموزشی و منابع موردنیاز" },
  { name: "تجهیزات ورزشی", slug: "sports", icon: "sports", sortOrder: 4, description: "وسایل و تجهیزات موردنیاز فعالیت‌های ورزشی مدارس" },
  { name: "تجهیزات آزمایشگاهی و آموزشی", slug: "lab-equipment", icon: "lab", sortOrder: 5, description: "ابزار و تجهیزات موردنیاز آموزش عملی و آزمایشگاهی" },
  { name: "کیف و کوله‌پشتی", slug: "bags", icon: "backpack", sortOrder: 6, description: "کیف، کوله‌پشتی و ملزومات حمل وسایل" },
  { name: "لوازم‌التحریر", slug: "stationery", icon: "stationery", sortOrder: 7, description: "دفتر، مداد، خودکار و لوازم‌التحریر روزمره" },
  { name: "سایر کالاها", slug: "other", icon: "box", sortOrder: 8, description: "محصولاتی که در دسته‌های اصلی قرار نمی‌گیرند" },
];

const products = [
  { name: "کوله‌پشتی دانش‌آموزی", slug: "student-backpack", categorySlug: "bags", priceToman: 850_000, creditPriceTokens: 200, unit: "عدد", stockQty: 120, minOrderQty: 5, maxOrderQty: 50, bulkOrderAvailable: true, eligibleForStudentCredit: true, eligibleForSchoolBulk: true, description: "کوله‌پشتی مقاوم و راحت، مناسب دانش‌آموزان دورهٔ ابتدایی و متوسطه با بند قابل‌تنظیم و جیب‌های متعدد.", attributes: { ابعاد: "۴۵×۳۰×۱۵ سانتی‌متر", وزن: "۶۰۰ گرم", جنس: "پارچهٔ ضدآب", رنگ: "آبی", برند: "مدرسه‌یاری", مدل: "کلاسیک" } },
  { name: "دفتر ۱۰۰ برگ", slug: "notebook-100", categorySlug: "stationery", priceToman: 35_000, creditPriceTokens: 15, unit: "بستهٔ ۱۰ عددی", stockQty: 500, minOrderQty: 10, maxOrderQty: 200, bulkOrderAvailable: true, eligibleForStudentCredit: true, eligibleForSchoolBulk: true, description: "دفتر ۱۰۰ برگ خط‌دار با جلد مقاوم، مناسب استفادهٔ روزانه در مدرسه.", attributes: { ابعاد: "قطع A4", وزن: "۲۲۰ گرم", جنس: "کاغذ تحریر", رنگ: "طرح‌دار", برند: "مدرسه‌یاری", مدل: "—" } },
  { name: "مداد رنگی ۱۲ رنگ", slug: "color-pencils-12", categorySlug: "stationery", priceToman: 75_000, creditPriceTokens: 30, unit: "جعبه", stockQty: 60, stockStatus: "LIMITED" as const, minOrderQty: 10, maxOrderQty: 200, bulkOrderAvailable: true, eligibleForStudentCredit: true, eligibleForSchoolBulk: true, description: "جعبهٔ ۱۲ رنگ مداد رنگی با کیفیت مناسب برای فعالیت‌های هنری کلاس.", attributes: { ابعاد: "جعبهٔ ۱۲ عددی", وزن: "۱۵۰ گرم", جنس: "چوب با مغزی رنگی", رنگ: "۱۲ رنگ", برند: "مدرسه‌یاری", مدل: "—" } },
  { name: "کرهٔ جغرافیایی آموزشی", slug: "geo-globe-30", categorySlug: "learning-aids", priceToman: 1_300_000, creditPriceTokens: 300, unit: "عدد", stockQty: 25, minOrderQty: 2, maxOrderQty: 30, bulkOrderAvailable: true, eligibleForStudentCredit: true, eligibleForSchoolBulk: true, description: "کرهٔ جغرافیایی آموزشی با قطر ۳۰ سانتی‌متر، مناسب کلاس‌های جغرافیا.", attributes: { ابعاد: "قطر ۳۰ سانتی‌متر", وزن: "۹۰۰ گرم", جنس: "پلاستیک مقاوم", رنگ: "چندرنگ", برند: "مدرسه‌یاری", مدل: "GEO-30" } },
  { name: "تخته وایت‌برد کلاس", slug: "classroom-whiteboard", categorySlug: "classroom-equipment", priceToman: 4_200_000, unit: "عدد", stockQty: 15, minOrderQty: 1, maxOrderQty: 20, bulkOrderAvailable: true, eligibleForSchoolBulk: true, description: "تخته وایت‌برد مغناطیسی با قاب فلزی، مناسب نصب در کلاس درس.", attributes: { ابعاد: "۱۲۰×۹۰ سانتی‌متر", وزن: "۶ کیلوگرم", جنس: "فلز و MDF", رنگ: "سفید با قاب طوسی", برند: "مدرسه‌یاری", مدل: "WB-120" } },
  { name: "صندلی دانش‌آموزی", slug: "student-chair", categorySlug: "classroom-equipment", priceToman: 950_000, unit: "عدد", stockQty: 8, stockStatus: "LIMITED" as const, minOrderQty: 10, maxOrderQty: 100, bulkOrderAvailable: true, eligibleForSchoolBulk: true, description: "صندلی بدنهٔ فلزی با نشیمن پلاستیکی مقاوم، مناسب استفادهٔ طولانی‌مدت در کلاس.", attributes: { ابعاد: "۴۰×۴۰×۷۵ سانتی‌متر", وزن: "۳.۲ کیلوگرم", جنس: "فلز و پلاستیک", رنگ: "آبی", برند: "مدرسه‌یاری", مدل: "ST-1" } },
  { name: "کیت پایهٔ آزمایشگاه علوم", slug: "lab-kit-basic", categorySlug: "lab-equipment", priceToman: 2_100_000, unit: "بسته", stockQty: 10, stockStatus: "BACKORDER" as const, minOrderQty: 1, maxOrderQty: 20, bulkOrderAvailable: true, eligibleForSchoolBulk: true, description: "مجموعهٔ پایهٔ ابزار آزمایشگاه علوم برای کلاس‌های تجربی.", attributes: { ابعاد: "جعبهٔ ۳۵×۲۵ سانتی‌متر", وزن: "۲ کیلوگرم", جنس: "شیشه و پلاستیک آزمایشگاهی", رنگ: "—", برند: "مدرسه‌یاری", مدل: "LAB-B1" } },
  { name: "مجموعهٔ والیبال مدرسه", slug: "volleyball-set", categorySlug: "sports", priceToman: 1_850_000, unit: "مجموعه", stockQty: 12, minOrderQty: 1, maxOrderQty: 15, bulkOrderAvailable: true, eligibleForSchoolBulk: true, description: "توپ، تور و پایهٔ والیبال مناسب زنگ ورزش مدارس.", attributes: { ابعاد: "تور ۹ متری + توپ استاندارد", وزن: "۱.۵ کیلوگرم", جنس: "PVC و نایلون", رنگ: "سفید و آبی", برند: "مدرسه‌یاری", مدل: "VB-9" } },
  { name: "بستهٔ کتاب کار ریاضی", slug: "workbook-set", categorySlug: "books", priceToman: 220_000, creditPriceTokens: 60, unit: "بستهٔ ۲۰ جلدی", stockQty: 80, minOrderQty: 5, maxOrderQty: 100, bulkOrderAvailable: true, eligibleForStudentCredit: true, eligibleForSchoolBulk: true, description: "بستهٔ کتاب کار تمرین ریاضی، متناسب با کتاب درسی پایهٔ ابتدایی.", attributes: { ابعاد: "قطع رقعی", وزن: "۳۰۰ گرم", جنس: "کاغذ تحریر", رنگ: "—", برند: "مدرسه‌یاری", مدل: "—" } },
  { name: "نقشهٔ آموزشی دیواری", slug: "educational-wall-map", categorySlug: "learning-aids", priceToman: 650_000, unit: "عدد", stockQty: 0, stockStatus: "OUT_OF_STOCK" as const, minOrderQty: 2, maxOrderQty: 30, bulkOrderAvailable: true, eligibleForSchoolBulk: true, description: "نقشهٔ دیواری آموزشی جغرافیا، مناسب نصب در کلاس درس.", attributes: { ابعاد: "۱۰۰×۷۰ سانتی‌متر", وزن: "۴۰۰ گرم", جنس: "پارچهٔ ضدپاره", رنگ: "چندرنگ", برند: "مدرسه‌یاری", مدل: "MAP-100" } },
];

const schools = [
  { id: "school-1", name: "دبستان امید فردا", city: "زاهدان", province: "سیستان و بلوچستان", level: "ابتدایی", studentCount: 240, description: "مدرسه‌ای در حاشیهٔ شهر زاهدان با نیاز به کوله‌پشتی و لوازم‌التحریر برای دانش‌آموزان.", phone: "09120000001" },
  { id: "school-2", name: "دبیرستان دخترانه شهید سلیمی", city: "سنندج", province: "کردستان", level: "متوسطه دوم", studentCount: 420, description: "نیاز به تجهیزات کلاس و تخته برای بهبود فضای آموزشی.", phone: "09120000003" },
  { id: "school-3", name: "دبستان روستایی نگین", city: "قائنات", province: "خراسان جنوبی", level: "ابتدایی", studentCount: 25, description: "مدرسه‌ای کوچک روستایی با نیاز جدی به کتاب و منابع آموزشی.", phone: "09120000004" },
  { id: "school-4", name: "دبیرستان پسرانه فارابی", city: "اصفهان", province: "اصفهان", level: "متوسطه دوم", studentCount: 310, description: "نیاز به تجهیز آزمایشگاه علوم برای کلاس‌های عملی.", phone: "09120000005" },
];

const needs = [
  { id: "backpack-1", title: "کوله‌پشتی دانش‌آموزان", beneficiary: "دانش‌آموزان یک مدرسه در تهران", province: "تهران", city: "تهران", needed: 240, fulfilled: 180, unit: "عدد", category: "backpack", audience: "STUDENT" as const, status: "IN_PROGRESS" as const, schoolId: null, description: "این مدرسه برای شروع سال تحصیلی، به کوله‌پشتی برای دانش‌آموزانی که امکان تهیهٔ آن را ندارند نیاز دارد.", whyItMatters: "کوله‌پشتی مناسب، یکی از نیازهای اصلی شروع سال تحصیلی است و به دانش‌آموز کمک می‌کند با آرامش بیشتری درس بخواند.", beneficiaryMeta: [{ label: "مقطع", value: "ابتدایی" }, { label: "شهر", value: "تهران" }, { label: "تعداد دانش‌آموزان", value: "۲۴۰ نفر" }], productSlug: "student-backpack" },
  { id: "board-1", title: "تخته کلاس", beneficiary: "دبیرستان دخترانه، استان کردستان", province: "کردستان", city: "سنندج", needed: 20, fulfilled: 9, unit: "عدد", category: "board", audience: "SCHOOL" as const, status: "IN_PROGRESS" as const, schoolId: "school-2", description: "کلاس‌های این دبیرستان به تخته‌های جدید نیاز دارند تا آموزش با کیفیت بهتری انجام شود.", whyItMatters: "تختهٔ سالم، ابزار پایهٔ تدریس در هر کلاس است.", beneficiaryMeta: [{ label: "مقطع", value: "متوسطه دوم" }, { label: "شهر", value: "سنندج" }, { label: "تعداد دانش‌آموزان", value: "۴۲۰ نفر" }], productSlug: "classroom-whiteboard" },
  { id: "globe-1", title: "کره جغرافیا", beneficiary: "کلاس جغرافیای یک مدرسه روستایی", province: "سیستان و بلوچستان", city: "زاهدان", needed: 12, fulfilled: 7, unit: "عدد", category: "globe", audience: "SCHOOL" as const, status: "NEAR_COMPLETE" as const, schoolId: "school-1", description: "برای آموزش بهتر درس جغرافیا، این مدرسه به کرهٔ جغرافیایی نیاز دارد.", whyItMatters: "کرهٔ جغرافیایی، مفاهیم انتزاعی جغرافیا را برای دانش‌آموزان ملموس‌تر می‌کند.", beneficiaryMeta: [{ label: "مقطع", value: "ابتدایی" }, { label: "شهر", value: "زاهدان" }, { label: "تعداد دانش‌آموزان", value: "۹۰ نفر" }], productSlug: "geo-globe-30" },
  { id: "book-1", title: "کتاب‌های آموزشی", beneficiary: "۲۵ دانش‌آموز یک مدرسهٔ روستایی", province: "خراسان جنوبی", city: "قائنات", needed: 130, fulfilled: 45, unit: "جلد", category: "book", audience: "STUDENT" as const, status: "NEW" as const, schoolId: "school-3", description: "ابزارهای آموزشی و نوشت‌افزار موردنیاز این دانش‌آموزان برای درس خواندن.", whyItMatters: "دسترسی به کتاب و منابع آموزشی، پایهٔ یادگیری مستمر است.", beneficiaryMeta: [{ label: "مقطع", value: "ابتدایی" }, { label: "شهر", value: "قائنات" }, { label: "تعداد دانش‌آموزان", value: "۲۵ نفر" }], productSlug: "workbook-set" },
  { id: "lab-1", title: "تجهیزات آزمایشگاه", beneficiary: "دبیرستان پسرانه، اصفهان", province: "اصفهان", city: "اصفهان", needed: 12, fulfilled: 7, unit: "قلم", category: "lab", audience: "SCHOOL" as const, status: "IN_PROGRESS" as const, schoolId: "school-4", description: "تجهیز آزمایشگاه علوم برای برگزاری کلاس‌های عملی شیمی و زیست.", whyItMatters: "آموزش عملی، درک دانش‌آموزان از مفاهیم علمی را عمیق‌تر می‌کند.", beneficiaryMeta: [{ label: "مقطع", value: "متوسطه دوم" }, { label: "شهر", value: "اصفهان" }, { label: "تعداد دانش‌آموزان", value: "۳۱۰ نفر" }], productSlug: "lab-kit-basic" },
  { id: "sports-1", title: "تجهیزات ورزشی", beneficiary: "مدرسهٔ پسرانه، خوزستان", province: "خوزستان", city: "اهواز", needed: 40, fulfilled: 10, unit: "قلم", category: "sports", audience: "SCHOOL" as const, status: "NEW" as const, schoolId: null, description: "توپ، تور و تجهیزات پایهٔ ورزشی برای زنگ ورزش دانش‌آموزان.", whyItMatters: "فعالیت بدنی منظم، بخش مهمی از رشد دانش‌آموزان است.", beneficiaryMeta: [{ label: "مقطع", value: "ابتدایی" }, { label: "شهر", value: "اهواز" }, { label: "تعداد دانش‌آموزان", value: "۲۰۰ نفر" }], productSlug: "volleyball-set" },
  { id: "stationery-1", title: "لوازم‌التحریر", beneficiary: "۱۸ دانش‌آموز، لرستان", province: "لرستان", city: "خرم‌آباد", needed: 90, fulfilled: 60, unit: "بسته", category: "stationery", audience: "STUDENT" as const, status: "IN_PROGRESS" as const, schoolId: null, description: "دفتر، مداد و لوازم‌التحریر پایهٔ موردنیاز دانش‌آموزان.", whyItMatters: "لوازم‌التحریر کامل، دانش‌آموز را برای حضور فعال در کلاس آماده می‌کند.", beneficiaryMeta: [{ label: "مقطع", value: "ابتدایی" }, { label: "شهر", value: "خرم‌آباد" }, { label: "تعداد دانش‌آموزان", value: "۱۸ نفر" }], productSlug: "notebook-100" },
  { id: "classroom-1", title: "میز و صندلی کلاس", beneficiary: "مدرسهٔ ابتدایی، گلستان", province: "گلستان", city: "گرگان", needed: 25, fulfilled: 4, unit: "دست", category: "classroom", audience: "SCHOOL" as const, status: "NEW" as const, schoolId: null, description: "جایگزینی میز و صندلی‌های فرسودهٔ کلاس‌های این مدرسه.", whyItMatters: "محیط فیزیکی مناسب، پیش‌نیاز یادگیری راحت‌تر است.", beneficiaryMeta: [{ label: "مقطع", value: "ابتدایی" }, { label: "شهر", value: "گرگان" }, { label: "تعداد دانش‌آموزان", value: "۱۵۰ نفر" }], productSlug: "student-chair" },
];

const stories = [
  { id: "kolehposhti-tehran", title: "«کوله‌پشتی جدیدم خیلی به دلم نشست»", person: "دانش‌آموز پایهٔ ششم، سیستان و بلوچستان", excerpt: "کتاب‌های موردنیازم را خودم انتخاب کردم.", body: "با اعتباری که از طرف مدرسه‌یاری دریافت کردم، توانستم خودم کوله‌پشتی و چند جلد کتاب موردنیازم را انتخاب کنم. حس خوبی داشت که خودم تصمیم بگیرم به چه چیزی بیشتر نیاز دارم.", relatedNeedId: "backpack-1" },
  { id: "takhte-khorasan", title: "«تأمین تخته کلاس‌های ما جدی‌تر شده»", person: "مدیر مدرسه، خراسان شمالی", excerpt: "فضای بهتری برای یادگیری فراهم شده.", body: "با تأمین تخته‌های جدید از طریق مدرسه‌یاری، کیفیت آموزش در کلاس‌های ما به‌طور محسوسی بهتر شده و دانش‌آموزان با انگیزهٔ بیشتری درس می‌خوانند.", relatedNeedId: "board-1" },
  { id: "kolehposhti-tehran-2", title: "«کوله‌پشتی پایهٔ چهارم دردم را دوا کرد»", person: "دانش‌آموز پایهٔ چهارم، تهران", excerpt: "دیگر مجبور نیستم کوله‌ٔ خواهرم را قرض بگیرم.", body: "قبلاً باید کولهٔ خواهرم را قرض می‌گرفتم. حالا با کمک مدرسه‌یاری کولهٔ خودم را دارم و خیلی خوشحالم.", relatedNeedId: "backpack-1" },
];

async function main() {
  console.log("Seeding categories...");
  const categoryBySlug = new Map<string, { id: string }>();
  for (const category of categories) {
    const created = await prisma.category.upsert({ where: { slug: category.slug }, update: { description: category.description }, create: category });
    categoryBySlug.set(category.slug, created);
  }

  console.log("Seeding products...");
  const productBySlug = new Map<string, { id: string }>();
  for (const { categorySlug, stockStatus, ...product } of products) {
    const category = categoryBySlug.get(categorySlug)!;
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: { ...product, categoryId: category.id, stockStatus: stockStatus ?? "IN_STOCK", images: [] },
    });
    productBySlug.set(product.slug, created);
  }

  console.log("Seeding schools...");
  const schoolIdMap = new Map<string, string>();
  for (const [index, school] of schools.entries()) {
    const phone = school.phone;
    const user = await prisma.user.upsert({
      where: { phone },
      update: { passwordHash: hashPassword(SEED_PASSWORD) },
      create: { phone, firstName: school.name, lastName: "", role: "SCHOOL", passwordHash: hashPassword(SEED_PASSWORD) },
    });
    const created = await prisma.schoolProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: school.name,
        code: `SCH-${1000 + index + 1}`,
        province: school.province,
        city: school.city,
        address: `${school.city}، ${school.name}`,
        level: school.level,
        studentCount: school.studentCount,
        contactName: "مدیر مدرسه",
        contactPhone: phone,
        description: school.description,
        verified: true,
      },
    });
    schoolIdMap.set(school.id, created.id);
  }

  console.log("Seeding demo student (linked to school-1)...");
  const studentUser = await prisma.user.upsert({
    where: { phone: "09120000002" },
    update: { passwordHash: hashPassword(SEED_PASSWORD) },
    create: { phone: "09120000002", firstName: "دانش‌آموز", lastName: "نمونه", role: "STUDENT", passwordHash: hashPassword(SEED_PASSWORD) },
  });
  await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      schoolId: schoolIdMap.get("school-1")!,
      grade: "پنجم ابتدایی",
      city: "زاهدان",
      province: "سیستان و بلوچستان",
      creditBalance: 250,
      code: "STU-100002",
    },
  });

  console.log("Seeding needs...");
  const needIdMap = new Map<string, string>();
  for (const need of needs) {
    const product = productBySlug.get(need.productSlug);
    const created = await prisma.need.upsert({
      where: { id: need.id },
      update: {},
      create: {
        id: need.id,
        title: need.title,
        beneficiaryType: need.audience,
        studentGroupLabel: need.beneficiary,
        schoolId: need.schoolId ? schoolIdMap.get(need.schoolId) : undefined,
        needType: need.category,
        province: need.province,
        city: need.city,
        description: need.description,
        whyItMatters: need.whyItMatters,
        beneficiaryMeta: need.beneficiaryMeta,
        status: need.status,
        images: [],
        lineItems: {
          create: [{ productId: product?.id, itemLabel: need.title, qtyNeeded: need.needed, qtyFulfilled: need.fulfilled, unit: need.unit }],
        },
      },
    });
    needIdMap.set(need.id, created.id);
  }

  console.log("Seeding stories...");
  for (const story of stories) {
    await prisma.story.upsert({
      where: { id: story.id },
      update: {},
      create: {
        id: story.id,
        title: story.title,
        person: story.person,
        excerpt: story.excerpt,
        body: story.body,
        relatedNeedId: needIdMap.get(story.relatedNeedId),
      },
    });
  }

  console.log("Seeding impact stats...");
  await prisma.impactStat.upsert({ where: { key: ImpactStatKey.studentsSupported }, update: {}, create: { key: ImpactStatKey.studentsSupported, value: BigInt(12450) } });
  await prisma.impactStat.upsert({ where: { key: ImpactStatKey.schoolsCount }, update: {}, create: { key: ImpactStatKey.schoolsCount, value: BigInt(320) } });
  await prisma.impactStat.upsert({ where: { key: ImpactStatKey.itemsFulfilled }, update: {}, create: { key: ImpactStatKey.itemsFulfilled, value: BigInt(87000) } });
  await prisma.impactStat.upsert({ where: { key: ImpactStatKey.totalHelpAmount }, update: {}, create: { key: ImpactStatKey.totalHelpAmount, value: BigInt(45_000_000_000) } });

  console.log("Seeding admin user...");
  await prisma.user.upsert({
    where: { phone: "09120000009" },
    update: { isAdmin: true, passwordHash: hashPassword(ADMIN_PASSWORD) },
    create: {
      phone: "09120000009",
      firstName: "مدیر",
      lastName: "سیستم",
      role: "DONOR",
      isAdmin: true,
      passwordHash: hashPassword(ADMIN_PASSWORD),
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
