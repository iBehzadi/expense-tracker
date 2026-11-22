// lib/jalali.ts
const TZ = "Asia/Tehran";
const DAY = 86_400_000;
const persian = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn",
  { timeZone: TZ, year: "numeric", month: "numeric", day: "numeric" });
const gregorian = new Intl.DateTimeFormat("en-CA",
  { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

function nums(fmt: Intl.DateTimeFormat, d: Date) {
  const r = { year: 0, month: 0, day: 0 };
  for (const p of fmt.formatToParts(d))
    if (p.type === "year" || p.type === "month" || p.type === "day") r[p.type] = Number(p.value);
  return r;
}

export function getJalaliMonthRange(date = new Date()) {
  const j = nums(persian, date), g = nums(gregorian, date);
  const start = Date.UTC(g.year, g.month - 1, g.day) - (j.day - 1) * DAY;
  let end = start;
  for (let i = 0; i < 32; i++) {
    end += DAY;
    if (nums(persian, new Date(end + DAY / 2)).month !== j.month) break;
  }
  return {
    key: `${j.year}-${String(j.month).padStart(2, "0")}`,   // برای Budget.month
    label: new Intl.DateTimeFormat("fa-IR", { timeZone: TZ, month: "long", year: "numeric" }).format(date),
    start: new Date(start), end: new Date(end),             // where: { date: { gte: start, lt: end } }
  };
}