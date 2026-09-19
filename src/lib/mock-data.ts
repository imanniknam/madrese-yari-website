export type Need = {
  id: string;
  lineItemId: string;
  title: string;
  beneficiary: string;
  location: string;
  needed: number;
  fulfilled: number;
  unit: string;
  category: "backpack" | "book" | "globe" | "board" | "lab" | "sports" | "stationery" | "classroom";
  audience: "student" | "school";
  status: "new" | "in_progress" | "near_complete";
  description?: string;
  whyItMatters?: string;
  beneficiaryMeta?: { label: string; value: string }[];
};

export const NEED_CATEGORY_LABEL: Record<Need["category"], string> = {
  backpack: "کوله و کیف",
  book: "کتاب",
  globe: "وسایل کمک‌آموزشی",
  board: "تخته و تجهیزات تدریس",
  lab: "تجهیزات آزمایشگاهی",
  sports: "تجهیزات ورزشی",
  stationery: "لوازم‌التحریر",
  classroom: "میز و صندلی کلاس",
};

export const NEED_STATUS_LABEL: Record<Need["status"], string> = {
  new: "تازه ثبت‌شده",
  in_progress: "در حال تأمین",
  near_complete: "نزدیک به تکمیل",
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: "classroom" | "stationery" | "book" | "sports" | "lab" | "backpack" | "globe" | "board" | "box";
  productCount: number;
};

export const categories: Category[] = [
  { slug: "classroom-equipment", name: "تجهیزات کلاس", description: "تخته، میز و صندلی و دیگر تجهیزات کلاس", icon: "classroom", productCount: 18 },
  { slug: "learning-aids", name: "وسایل کمک‌آموزشی", description: "ابزارها و وسایلی که یادگیری را ملموس‌تر می‌کنند", icon: "globe", productCount: 12 },
  { slug: "books", name: "کتاب و منابع آموزشی", description: "کتاب‌های درسی، کمک‌آموزشی و منابع موردنیاز", icon: "book", productCount: 34 },
  { slug: "sports", name: "تجهیزات ورزشی", description: "وسایل و تجهیزات موردنیاز فعالیت‌های ورزشی مدارس", icon: "sports", productCount: 9 },
  { slug: "lab-equipment", name: "تجهیزات آزمایشگاهی و آموزشی", description: "ابزار و تجهیزات موردنیاز آموزش عملی و آزمایشگاهی", icon: "lab", productCount: 15 },
  { slug: "bags", name: "کیف و کوله‌پشتی", description: "کیف، کوله‌پشتی و ملزومات حمل وسایل", icon: "backpack", productCount: 21 },
  { slug: "stationery", name: "لوازم‌التحریر", description: "دفتر، مداد، خودکار و لوازم‌التحریر روزمره", icon: "stationery", productCount: 47 },
  { slug: "other", name: "سایر کالاها", description: "محصولاتی که در دسته‌های اصلی قرار نمی‌گیرند", icon: "box", productCount: 6 },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  priceToman: number;
  compareAtToman?: number;
  tokenPrice?: number;
  image: "backpack" | "notebook" | "pencil" | "globe" | "board" | "chair" | "lab" | "sports" | "book";
  stock: "in_stock" | "limited" | "backorder" | "out_of_stock";
  description?: string;
  bulkAvailable?: boolean;
  /** واحد فروش، مثلاً «عدد» یا «بستهٔ ۱۰ عددی» */
  unit?: string;
  /** حداقل تعداد سفارش برای این کالا */
  minOrderQty?: number;
  /** زمان تقریبی تأمین */
  supplyDays?: string;
  /** شرایط ارسال */
  shippingTerms?: string;
  /** حداکثر تعداد قابل سفارش (برای سفارش‌های عادی، جدا از سفارش عمده) */
  maxOrderQty?: number;
  /** مشخصات فنی کالا، برای نمایش در جدول «مشخصات فنی» صفحهٔ محصول */
  specs?: { label: string; value: string }[];
};

export const featuredProducts: Product[] = [
  { id: "p1", slug: "student-backpack", name: "کوله‌پشتی دانش‌آموزی", category: "کیف و کوله‌پشتی", categorySlug: "bags", priceToman: 850000, tokenPrice: 200, image: "backpack", stock: "in_stock", bulkAvailable: true, description: "کوله‌پشتی مقاوم و راحت، مناسب دانش‌آموزان دورهٔ ابتدایی و متوسطه با بند قابل‌تنظیم و جیب‌های متعدد.", unit: "عدد", minOrderQty: 5, maxOrderQty: 50, supplyDays: "۳ تا ۵ روز کاری", shippingTerms: "ارسال رایگان برای سفارش‌های بالای ۵۰ عدد", specs: [ { label: "ابعاد", value: "۴۵×۳۰×۱۵ سانتی‌متر" }, { label: "وزن", value: "۶۰۰ گرم" }, { label: "جنس", value: "پارچهٔ ضدآب" }, { label: "رنگ", value: "آبی" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "کلاسیک" } ] },
  { id: "p2", slug: "notebook-100", name: "دفتر ۱۰۰ برگ", category: "لوازم‌التحریر", categorySlug: "stationery", priceToman: 35000, tokenPrice: 15, image: "notebook", stock: "in_stock", bulkAvailable: true, description: "دفتر ۱۰۰ برگ خط‌دار با جلد مقاوم، مناسب استفادهٔ روزانه در مدرسه.", unit: "بستهٔ ۱۰ عددی", minOrderQty: 10, maxOrderQty: 200, supplyDays: "۲ تا ۳ روز کاری", shippingTerms: "ارسال به سراسر کشور", specs: [ { label: "ابعاد", value: "قطع A4" }, { label: "وزن", value: "۲۲۰ گرم" }, { label: "جنس", value: "کاغذ تحریر" }, { label: "رنگ", value: "طرح‌دار" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "—" } ] },
  { id: "p3", slug: "color-pencils-12", name: "مداد رنگی ۱۲ رنگ", category: "لوازم‌التحریر", categorySlug: "stationery", priceToman: 75000, tokenPrice: 30, image: "pencil", stock: "limited", bulkAvailable: true, description: "جعبهٔ ۱۲ رنگ مداد رنگی با کیفیت مناسب برای فعالیت‌های هنری کلاس.", unit: "جعبه", minOrderQty: 10, maxOrderQty: 200, supplyDays: "۳ تا ۴ روز کاری", shippingTerms: "ارسال به سراسر کشور", specs: [ { label: "ابعاد", value: "جعبهٔ ۱۲ عددی" }, { label: "وزن", value: "۱۵۰ گرم" }, { label: "جنس", value: "چوب با مغزی رنگی" }, { label: "رنگ", value: "۱۲ رنگ" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "—" } ] },
  { id: "p4", slug: "geo-globe-30", name: "کرهٔ جغرافیایی آموزشی", category: "وسایل کمک‌آموزشی", categorySlug: "learning-aids", priceToman: 1300000, tokenPrice: 300, image: "globe", stock: "in_stock", bulkAvailable: true, description: "کرهٔ جغرافیایی آموزشی با قطر ۳۰ سانتی‌متر، مناسب کلاس‌های جغرافیا.", unit: "عدد", minOrderQty: 2, maxOrderQty: 30, supplyDays: "۵ تا ۷ روز کاری", shippingTerms: "ارسال با بیمهٔ حمل", specs: [ { label: "ابعاد", value: "قطر ۳۰ سانتی‌متر" }, { label: "وزن", value: "۹۰۰ گرم" }, { label: "جنس", value: "پلاستیک مقاوم" }, { label: "رنگ", value: "چندرنگ" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "GEO-30" } ] },
  { id: "p5", slug: "classroom-whiteboard", name: "تخته وایت‌برد کلاس", category: "تجهیزات کلاس", categorySlug: "classroom-equipment", priceToman: 4200000, stock: "in_stock", image: "board", bulkAvailable: true, description: "تخته وایت‌برد مغناطیسی با قاب فلزی، مناسب نصب در کلاس درس.", unit: "عدد", minOrderQty: 1, maxOrderQty: 20, supplyDays: "۷ تا ۱۰ روز کاری", shippingTerms: "نصب رایگان در تهران", specs: [ { label: "ابعاد", value: "۱۲۰×۹۰ سانتی‌متر" }, { label: "وزن", value: "۶ کیلوگرم" }, { label: "جنس", value: "فلز و MDF" }, { label: "رنگ", value: "سفید با قاب طوسی" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "WB-120" } ] },
  { id: "p6", slug: "student-chair", name: "صندلی دانش‌آموزی", category: "تجهیزات کلاس", categorySlug: "classroom-equipment", priceToman: 950000, stock: "limited", image: "chair", bulkAvailable: true, description: "صندلی بدنهٔ فلزی با نشیمن پلاستیکی مقاوم، مناسب استفادهٔ طولانی‌مدت در کلاس.", unit: "عدد", minOrderQty: 10, maxOrderQty: 100, supplyDays: "۵ تا ۷ روز کاری", shippingTerms: "ارسال با وانت باربری", specs: [ { label: "ابعاد", value: "۴۰×۴۰×۷۵ سانتی‌متر" }, { label: "وزن", value: "۳.۲ کیلوگرم" }, { label: "جنس", value: "فلز و پلاستیک" }, { label: "رنگ", value: "آبی" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "ST-1" } ] },
  { id: "p7", slug: "lab-kit-basic", name: "کیت پایهٔ آزمایشگاه علوم", category: "تجهیزات آزمایشگاهی و آموزشی", categorySlug: "lab-equipment", priceToman: 2100000, stock: "backorder", image: "lab", bulkAvailable: true, description: "مجموعهٔ پایهٔ ابزار آزمایشگاه علوم برای کلاس‌های تجربی.", unit: "بسته", minOrderQty: 1, maxOrderQty: 20, supplyDays: "۱۰ تا ۱۴ روز کاری", shippingTerms: "تأمین پس از تأیید موجودی", specs: [ { label: "ابعاد", value: "جعبهٔ ۳۵×۲۵ سانتی‌متر" }, { label: "وزن", value: "۲ کیلوگرم" }, { label: "جنس", value: "شیشه و پلاستیک آزمایشگاهی" }, { label: "رنگ", value: "—" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "LAB-B1" } ] },
  { id: "p8", slug: "volleyball-set", name: "مجموعهٔ والیبال مدرسه", category: "تجهیزات ورزشی", categorySlug: "sports", priceToman: 1850000, stock: "in_stock", image: "sports", bulkAvailable: true, description: "توپ، تور و پایهٔ والیبال مناسب زنگ ورزش مدارس.", unit: "مجموعه", minOrderQty: 1, maxOrderQty: 15, supplyDays: "۴ تا ۶ روز کاری", shippingTerms: "ارسال به سراسر کشور", specs: [ { label: "ابعاد", value: "تور ۹ متری + توپ استاندارد" }, { label: "وزن", value: "۱.۵ کیلوگرم" }, { label: "جنس", value: "PVC و نایلون" }, { label: "رنگ", value: "سفید و آبی" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "VB-9" } ] },
  { id: "p9", slug: "workbook-set", name: "بستهٔ کتاب کار ریاضی", category: "کتاب و منابع آموزشی", categorySlug: "books", priceToman: 220000, tokenPrice: 60, image: "book", stock: "in_stock", bulkAvailable: true, description: "بستهٔ کتاب کار تمرین ریاضی، متناسب با کتاب درسی پایهٔ ابتدایی.", unit: "بستهٔ ۲۰ جلدی", minOrderQty: 5, maxOrderQty: 100, supplyDays: "۲ تا ۳ روز کاری", shippingTerms: "ارسال به سراسر کشور", specs: [ { label: "ابعاد", value: "قطع رقعی" }, { label: "وزن", value: "۳۰۰ گرم" }, { label: "جنس", value: "کاغذ تحریر" }, { label: "رنگ", value: "—" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "—" } ] },
  { id: "p10", slug: "educational-wall-map", name: "نقشهٔ آموزشی دیواری", category: "وسایل کمک‌آموزشی", categorySlug: "learning-aids", priceToman: 650000, image: "globe", stock: "out_of_stock", bulkAvailable: true, description: "نقشهٔ دیواری آموزشی جغرافیا، مناسب نصب در کلاس درس.", unit: "عدد", minOrderQty: 2, maxOrderQty: 30, supplyDays: "۴ تا ۶ روز کاری", shippingTerms: "ارسال به سراسر کشور", specs: [ { label: "ابعاد", value: "۱۰۰×۷۰ سانتی‌متر" }, { label: "وزن", value: "۴۰۰ گرم" }, { label: "جنس", value: "پارچهٔ ضدپاره" }, { label: "رنگ", value: "چندرنگ" }, { label: "برند", value: "مدرسه‌یاری" }, { label: "مدل", value: "MAP-100" } ] },
];

/* ---------------------------------------------------------------------- */
/* فروشگاه مدرسه — سفارش، پیگیری تأمین و خریدهای اخیر                      */
/* ---------------------------------------------------------------------- */

/** پروفایل مدرسهٔ فعلی؛ در مرحلهٔ اول ثبت سفارش به‌صورت خودکار نمایش داده می‌شود. */
export const currentSchoolProfile = {
  name: "دبستان امید فردا",
  code: "SCH-10234",
  province: "سیستان و بلوچستان",
  city: "زاهدان",
  address: "زاهدان، خیابان امام خمینی، کوچهٔ ۱۲، دبستان امید فردا",
  phone: "۰۵۴۱۲۲۳۳۴۴۵",
  contactName: "علی رضایی",
};

/** اقلام پیش‌فرض سبد خرید مدرسه، برای نمایش در جریان ثبت سفارش. */
export const schoolCartItems: { product: Product; qty: number }[] = [
  { product: featuredProducts.find((p) => p.slug === "classroom-whiteboard")!, qty: 3 },
  { product: featuredProducts.find((p) => p.slug === "geo-globe-30")!, qty: 5 },
  { product: featuredProducts.find((p) => p.slug === "notebook-100")!, qty: 10 },
];

export const schoolOrderShippingCost = 500000;

export type OrderStatus =
  | "ثبت سفارش"
  | "بررسی سفارش"
  | "تأیید سفارش"
  | "در حال تأمین"
  | "آماده ارسال"
  | "ارسال‌شده"
  | "تحویل‌شده";

/** ترتیب دقیق مراحل پیگیری سفارش مدرسه. */
export const orderStatusStages: OrderStatus[] = [
  "ثبت سفارش",
  "بررسی سفارش",
  "تأیید سفارش",
  "در حال تأمین",
  "آماده ارسال",
  "ارسال‌شده",
  "تحویل‌شده",
];

export const orderStatusBadge: Record<OrderStatus, "brand" | "gold" | "neutral"> = {
  "ثبت سفارش": "neutral",
  "بررسی سفارش": "neutral",
  "تأیید سفارش": "gold",
  "در حال تأمین": "gold",
  "آماده ارسال": "gold",
  "ارسال‌شده": "brand",
  "تحویل‌شده": "brand",
};

export type SchoolOrder = {
  id: string;
  code: string;
  schoolName: string;
  date: string;
  items: { product: Product; qty: number }[];
  shippingAddress: string;
  status: OrderStatus;
  statusNote?: string;
  supplyEta: string;
};

export const schoolOrders: SchoolOrder[] = [
  {
    id: "so-12548",
    code: "۱۲۵۴۸",
    schoolName: "دبستان امید فردا",
    date: "۲۳ شهریور ۱۴۰۵",
    items: [
      { product: featuredProducts.find((p) => p.slug === "classroom-whiteboard")!, qty: 3 },
      { product: featuredProducts.find((p) => p.slug === "geo-globe-30")!, qty: 5 },
      { product: featuredProducts.find((p) => p.slug === "notebook-100")!, qty: 10 },
    ],
    shippingAddress: "زاهدان، خیابان امام خمینی، کوچهٔ ۱۲، دبستان امید فردا",
    status: "در حال تأمین",
    statusNote: "کالاها در انبار تأمین‌کننده آماده‌سازی می‌شوند.",
    supplyEta: "۵ تا ۷ روز کاری",
  },
  {
    id: "so-12530",
    code: "۱۲۵۳۰",
    schoolName: "دبستان امید فردا",
    date: "۱۰ شهریور ۱۴۰۵",
    items: [{ product: featuredProducts.find((p) => p.slug === "notebook-100")!, qty: 20 }],
    shippingAddress: "زاهدان، خیابان امام خمینی، کوچهٔ ۱۲، دبستان امید فردا",
    status: "تحویل‌شده",
    supplyEta: "تحویل داده شد",
  },
  {
    id: "so-12490",
    code: "۱۲۴۹۰",
    schoolName: "دبستان امید فردا",
    date: "۲ شهریور ۱۴۰۵",
    items: [{ product: featuredProducts.find((p) => p.slug === "lab-kit-basic")!, qty: 2 }],
    shippingAddress: "زاهدان، خیابان امام خمینی، کوچهٔ ۱۲، دبستان امید فردا",
    status: "ارسال‌شده",
    supplyEta: "تحویل تا ۲ روز آینده",
  },
];

export const impactStats = [
  { key: "students", label: "دانش‌آموز تحت حمایت", value: 12450 },
  { key: "schools", label: "مدرسه", value: 320 },
  { key: "items", label: "قلم کالای تأمین‌شده", value: 87000 },
];

export type Story = {
  id: string;
  title: string;
  person: string;
  excerpt: string;
  body: string;
};

export const stories: Story[] = [
  {
    id: "kolehposhti-tehran",
    title: "«کوله‌پشتی جدیدم خیلی به دلم نشست»",
    person: "دانش‌آموز پایهٔ ششم، سیستان و بلوچستان",
    excerpt: "کتاب‌های موردنیازم را خودم انتخاب کردم.",
    body: "با اعتباری که از طرف مدرسه‌یاری دریافت کردم، توانستم خودم کوله‌پشتی و چند جلد کتاب موردنیازم را انتخاب کنم. حس خوبی داشت که خودم تصمیم بگیرم به چه چیزی بیشتر نیاز دارم.",
  },
  {
    id: "takhte-khorasan",
    title: "«تأمین تخته کلاس‌های ما جدی‌تر شده»",
    person: "مدیر مدرسه، خراسان شمالی",
    excerpt: "فضای بهتری برای یادگیری فراهم شده.",
    body: "با تأمین تخته‌های جدید از طریق مدرسه‌یاری، کیفیت آموزش در کلاس‌های ما به‌طور محسوسی بهتر شده و دانش‌آموزان با انگیزهٔ بیشتری درس می‌خوانند.",
  },
  {
    id: "kolehposhti-tehran-2",
    title: "«کوله‌پشتی پایهٔ چهارم دردم را دوا کرد»",
    person: "دانش‌آموز پایهٔ چهارم، تهران",
    excerpt: "دیگر مجبور نیستم کوله‌ٔ خواهرم را قرض بگیرم.",
    body: "قبلاً باید کولهٔ خواهرم را قرض می‌گرفتم. حالا با کمک مدرسه‌یاری کولهٔ خودم را دارم و خیلی خوشحالم.",
  },
];

export const waysToHelp = [
  {
    id: "shop",
    title: "خرید از فروشگاه",
    description:
      "محصول موردنیاز خود را می‌خرید و بخشی از سود آن صرف تأمین نیازهای مدارس و دانش‌آموزان می‌شود.",
    cta: "ورود به فروشگاه",
    href: "/shop",
  },
  {
    id: "direct",
    title: "تأمین مستقیم کالا",
    description:
      "خود کالا را انتخاب می‌کنید و تعداد مشخصی از یک محصول را برای یک نیاز واقعی تأمین می‌کنید.",
    cta: "تأمین کالا",
    href: "/help/direct-purchase",
  },
  {
    id: "credit",
    title: "ایجاد اعتبار",
    description:
      "مبلغ موردنظر خود را اختصاص می‌دهید و به اعتبار تبدیل می‌شود تا دانش‌آموز خودش نیازش را انتخاب کند.",
    cta: "ایجاد اعتبار",
    href: "/help/credit",
  },
];

export type School = {
  id: string;
  name: string;
  city: string;
  province: string;
  level: string;
  studentCount: number;
  needsCount: number;
  fulfilledPct: number;
  description: string;
};

export const schools: School[] = [
  { id: "school-1", name: "دبستان امید فردا", city: "زاهدان", province: "سیستان و بلوچستان", level: "ابتدایی", studentCount: 240, needsCount: 3, fulfilledPct: 62, description: "مدرسه‌ای در حاشیهٔ شهر زاهدان با نیاز به کوله‌پشتی و لوازم‌التحریر برای دانش‌آموزان." },
  { id: "school-2", name: "دبیرستان دخترانه شهید سلیمی", city: "سنندج", province: "کردستان", level: "متوسطه دوم", studentCount: 420, needsCount: 2, fulfilledPct: 45, description: "نیاز به تجهیزات کلاس و تخته برای بهبود فضای آموزشی." },
  { id: "school-3", name: "دبستان روستایی نگین", city: "قائنات", province: "خراسان جنوبی", level: "ابتدایی", studentCount: 25, needsCount: 1, fulfilledPct: 35, description: "مدرسه‌ای کوچک روستایی با نیاز جدی به کتاب و منابع آموزشی." },
  { id: "school-4", name: "دبیرستان پسرانه فارابی", city: "اصفهان", province: "اصفهان", level: "متوسطه دوم", studentCount: 310, needsCount: 1, fulfilledPct: 58, description: "نیاز به تجهیز آزمایشگاه علوم برای کلاس‌های عملی." },
];
