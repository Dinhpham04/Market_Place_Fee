import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NumberFormatter, NumberParser } from "@internationalized/number";
import { CURRENCY_FORMAT } from "@/constants";

// ============================================
// CLASSNAMES UTILITY
// ============================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// NUMBER FORMATTER INSTANCES
// ============================================
const currencyFormatter = new NumberFormatter(CURRENCY_FORMAT.locale, {
  style: "currency",
  currency: CURRENCY_FORMAT.currency,
  maximumFractionDigits: 0,
});

const numberFormatter = new NumberFormatter(CURRENCY_FORMAT.locale, {
  maximumFractionDigits: 0,
});

const percentFormatter = new NumberFormatter(CURRENCY_FORMAT.locale, {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberParser = new NumberParser(CURRENCY_FORMAT.locale, {
  style: "decimal",
});

// ============================================
// CURRENCY FORMATTING
// ============================================

/**
 * Format số thành tiền VND
 * @example formatCurrency(150000) => "150.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

/**
 * Format số có dấu phân cách hàng nghìn
 * @example formatNumber(150000) => "150.000"
 */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/**
 * Format số thành tiền VND ngắn gọn
 * @example formatCurrencyCompact(1500000) => "1,5tr"
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace(".0", "")} tỷ`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(".0", "")} tr`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}k`;
  }
  return amount.toString();
}

// ============================================
// NUMBER PARSING
// ============================================

/**
 * Parse chuỗi số có dấu phân cách thành number (hỗ trợ locale VN)
 * @example parseNumber("150.000") => 150000
 * @example parseNumber("1.500.000") => 1500000
 */
export function parseNumber(value: string): number {
  if (!value || value.trim() === "") return 0;
  const parsed = numberParser.parse(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Kiểm tra ký tự có phải là số hợp lệ trong locale VN
 */
export function isValidInputChar(char: string): boolean {
  return numberParser.isValidPartialNumber(char);
}

// ============================================
// PERCENT FORMATTING
// ============================================

/**
 * Format phần trăm
 * @example formatPercent(0.1523) => "15,23%"
 */
export function formatPercent(value: number): string {
  return percentFormatter.format(value);
}

/**
 * Format phần trăm với số decimals tùy chỉnh
 * @example formatPercentCustom(0.1523, 1) => "15,2%"
 */
export function formatPercentCustom(value: number, decimals = 2): string {
  const formatter = new NumberFormatter(CURRENCY_FORMAT.locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(value);
}

// ============================================
// ROUNDING UTILITIES
// ============================================

/**
 * Làm tròn tiền VND (về hàng trăm)
 */
export function roundCurrency(amount: number): number {
  return Math.round(amount / 100) * 100;
}

/**
 * Làm tròn lên đến hàng nghìn
 */
export function roundUpToThousand(amount: number): number {
  return Math.ceil(amount / 1000) * 1000;
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Kiểm tra giá trị có phải số hợp lệ
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Clamp giá trị trong khoảng min-max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
