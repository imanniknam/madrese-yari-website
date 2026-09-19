import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shared toman-to-token conversion rate, used at checkout and for credit donations.
export const TOMAN_PER_TOKEN = 5000;

export function tomanToTokens(amountToman: number) {
  return Math.round(amountToman / TOMAN_PER_TOKEN);
}

export function formatToman(amount: number) {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

export function formatNumber(amount: number) {
  return new Intl.NumberFormat("fa-IR").format(amount);
}

export function formatTokens(amount: number) {
  return `${formatNumber(amount)} توکن`;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(date)
  );
}
