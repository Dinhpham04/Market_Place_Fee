// ============================================
// CALCULATOR MODULE - Clean Architecture
// ============================================

export { calculateProfit } from "./calculate-profit";
export { ShopeeCalculator } from "./shopee-calculator";
export { TikTokCalculator } from "./tiktok-calculator";
export { createCalculator } from "./calculator-factory";

// Re-export types
export type { CalculatorInput, CalculatorResult } from "@/types";