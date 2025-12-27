// ============================================
// GLOBAL TYPES - Định nghĩa types chung cho dự án
// ============================================

// Platform Types
export type Platform = "shopee" | "tiktok";

export type ShopeeShopType = "normal" | "preferred" | "mall";

export type TikTokCategory =
  | "fashion"
  | "beauty"
  | "electronics"
  | "home"
  | "food"
  | "other";

// Calculation Mode
export type CalculationMode = "forward" | "reverse";

// ============================================
// INPUT TYPES
// ============================================
export interface CalculatorInput {
  platform: Platform;
  shopType: ShopeeShopType;
  sellingPrice: number;
  costPrice: number;
  voucherShop?: number;
  packagingCost?: number;
  shippingCost?: number;
  adsCost?: number;
  adsCostPercent?: number;
  quantity?: number;
  includeTax?: boolean;
  includeFreeship?: boolean;
  includeVoucherXtra?: boolean;
}

// ============================================
// OUTPUT TYPES
// ============================================
export interface FeeBreakdown {
  feePayment: number;
  feeCommission: number;
  feeFreeship: number;
  feeVoucherXtra: number;
  feeCOD: number;
}

export interface CalculatorResult {
  revenue: number;
  totalPlatformFee: number;
  feeBreakdown: FeeBreakdown;
  taxAmount: number;
  totalOperatingCost: number;
  netProfit: number;
  profitMargin: number;
  profitPerUnit: number;
}

// ============================================
// UI TYPES
// ============================================
export interface SelectOption<T = string> {
  label: string;
  value: T;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
