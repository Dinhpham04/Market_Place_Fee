// ============================================
// CALCULATE PROFIT - Main Entry Point
// ============================================

import type { CalculatorInput, CalculatorResult } from "@/types";
import { createCalculator, isShopeeInput, isTikTokInput } from "./calculator-factory";

/**
 * Main function để tính lợi nhuận
 * Tự động chọn calculator phù hợp dựa trên platform
 *
 * @example
 * // Shopee
 * const result = calculateProfit({
 *   platform: "shopee",
 *   sellingPrice: 150000,
 *   costPrice: 80000,
 *   shopType: "normal",
 * });
 *
 * // TikTok
 * const result = calculateProfit({
 *   platform: "tiktok",
 *   sellingPrice: 150000,
 *   costPrice: 80000,
 *   category: "fashion",
 * });
 */


export function calculateProfit(input: CalculatorInput): CalculatorResult {
    // type narrowing
    if (isShopeeInput(input)) {
        return createCalculator("shopee").calculate(input);
    }
    if (isTikTokInput(input)) {
        return createCalculator("tiktok").calculate(input);
    }

    // exhaustive check
    const _exhaustiveCheck: never = input;
    throw new Error(`Unsupported platform: ${JSON.stringify(_exhaustiveCheck)}`);
}