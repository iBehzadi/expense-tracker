import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

if (process.env.NODE_ENV === "production") {
  throw new Error("اجرای seed روی محیط production مجاز نیست");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "Demo@12345";

// ---------- ابزارهای تصادفی (ثابت، تا هر بار خروجی یکسان باشد) ----------
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(2026);
const randInt = (min: number, max: number) =>
  Math.floor(random() * (max - min + 1)) + min;
const pick = <T,>(items: T[]): T => items[randInt(0, items.length - 1)];
// گرد کردن به نزدیک‌ترین ۱۰ هزار تومان
const roundAmount = (n: number) => Math.max(10_000, Math.round(n / 10_000) * 10_000);

// ظهر، برای جلوگیری از جابه‌جا شدن روز به‌خاطر timezone
const dateAt = (year: number, month: number, day: number) =>
  new Date(year, month, day, 12, 0, 0);

const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

// ---------- داده‌های پایه ----------
const CATEGORIES = [
  { name: "حقوق", type: "income" },
  { name: "سایر درآمدها", type: "income" },
  { name: "خوراک", type: "expense" },
  { name: "حمل‌ونقل", type: "expense" },
  { name: "مسکن", type: "expense" },
  { name: "سلامت", type: "expense" },
  { name: "تفریح", type: "expense" },
  { name: "سایر هزینه‌ها", type: "expense" },
] as const;

const EXPENSE_TEMPLATES: Record<
  string,
  { titles: string[]; min: number; max: number; countPerMonth: number }
> = {
  خوراک: {
    titles: ["خرید از سوپرمارکت", "رستوران", "نانوایی", "میوه و سبزی", "فست‌فود"],
    min: 80_000,
    max: 900_000,
    countPerMonth: 7,
  },
  "حمل‌ونقل": {
    titles: ["اسنپ", "بنزین", "مترو", "تاکسی"],
    min: 30_000,
    max: 400_000,
    countPerMonth: 5,
  },
  سلامت: {
    titles: ["دارو", "ویزیت پزشک", "آزمایش"],
    min: 100_000,
    max: 1_500_000,
    countPerMonth: 1,
  },
  تفریح: {
    titles: ["سینما", "کافه", "اشتراک ماهانه", "کتاب"],
    min: 100_000,
    max: 800_000,
    countPerMonth: 3,
  },
  "سایر هزینه‌ها": {
    titles: ["هدیه", "تعمیرات", "لوازم منزل"],
    min: 100_000,
    max: 1_000_000,
    countPerMonth: 2,
  },
};

const BUDGET_LIMITS: Record<string, number> = {
  خوراک: 6_000_000,
  "حمل‌ونقل": 2_000_000,
  مسکن: 14_000_000,
  سلامت: 1_500_000,
  تفریح: 2_000_000,
  "سایر هزینه‌ها": 1_500_000,
};

type TxInput = {
  title: string;
  amount: bigint;
  description: string | null;
  date: Date;
  accountId: number;
  categoryId: number;
  userId: number;
};

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD, 12);

  // کاربر دمو (در اجرای دوباره، فقط رمز به‌روز می‌شود)
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash },
    create: { name: "کاربر نمونه", email: DEMO_EMAIL, passwordHash },
  });

  // پاک کردن دادهٔ قبلی کاربر دمو تا seed قابل اجرای مجدد باشد
  // (ترتیب مهم است چون روابط Restrict هستند)
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.account.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  // دسته‌بندی‌ها
  await prisma.category.createMany({
    data: CATEGORIES.map((c) => ({
      name: c.name,
      type: c.type,
      isDefault: true,
      userId: user.id,
    })),
  });
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  });
  const categoryByName = new Map(categories.map((c) => [c.name, c.id]));
  const catId = (name: string) => {
    const id = categoryByName.get(name);
    if (id === undefined) throw new Error(`دسته‌بندی ${name} پیدا نشد`);
    return id;
  };

  // حساب‌ها
  const bank = await prisma.account.create({
    data: {
      name: "بانک ملت",
      type: "BANK",
      initialBalance: BigInt(15_000_000),
      userId: user.id,
    },
  });
  const cash = await prisma.account.create({
    data: {
      name: "کیف پول نقدی",
      type: "CASH",
      initialBalance: BigInt(500_000),
      userId: user.id,
    },
  });
  await prisma.account.create({
    data: {
      name: "پس‌انداز",
      type: "SAVINGS",
      initialBalance: BigInt(50_000_000),
      userId: user.id,
    },
  });

  // تراکنش‌های ۳ ماه اخیر
  const now = new Date();
  const transactions: TxInput[] = [];

  for (let i = 2; i >= 0; i--) {
    const base = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = base.getFullYear();
    const month = base.getMonth();
    const isCurrent = i === 0;
    const maxDay = isCurrent
      ? now.getDate()
      : new Date(year, month + 1, 0).getDate();

    const add = (
      title: string,
      amount: number,
      day: number,
      categoryName: string,
      accountId: number,
      description: string | null = null,
    ) => {
      if (day > maxDay) return; // تراکنش آینده نساز
      transactions.push({
        title,
        amount: BigInt(amount),
        description,
        date: dateAt(year, month, day),
        accountId,
        categoryId: catId(categoryName),
        userId: user.id,
      });
    };

    // درآمد
    add("حقوق ماهانه", 25_000_000, 1, "حقوق", bank.id);
    if (random() > 0.4) {
      add(
        "پروژه فریلنسری",
        roundAmount(randInt(2_000_000, 5_000_000)),
        randInt(8, 25),
        "سایر درآمدها",
        bank.id,
        "درآمد جانبی",
      );
    }

    // هزینه‌های ثابت مسکن
    add("اجاره خانه", 12_000_000, 5, "مسکن", bank.id);
    add("قبض برق", roundAmount(randInt(150_000, 450_000)), 12, "مسکن", bank.id);
    add("اینترنت", 390_000, 15, "مسکن", bank.id);

    // هزینه‌های متغیر
    for (const [categoryName, tpl] of Object.entries(EXPENSE_TEMPLATES)) {
      for (let n = 0; n < tpl.countPerMonth; n++) {
        add(
          pick(tpl.titles),
          roundAmount(randInt(tpl.min, tpl.max)),
          randInt(1, 28),
          categoryName,
          random() > 0.25 ? bank.id : cash.id,
        );
      }
    }
  }

  await prisma.transaction.createMany({ data: transactions });

  // بودجهٔ ماه جاری و ماه قبل
  const budgets = [];
  for (const offset of [1, 0]) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    for (const [categoryName, limit] of Object.entries(BUDGET_LIMITS)) {
      budgets.push({
        categoryId: catId(categoryName),
        userId: user.id,
        limit: BigInt(limit),
        month: monthKey(d),
      });
    }
  }
  await prisma.budget.createMany({ data: budgets });

  console.log("Seed با موفقیت انجام شد");
  console.log(`  ایمیل:  ${DEMO_EMAIL}`);
  console.log(`  رمز:    ${DEMO_PASSWORD}`);
  console.log(`  تراکنش: ${transactions.length} | بودجه: ${budgets.length}`);
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });