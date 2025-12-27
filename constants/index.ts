// Re-export all constants
export * from "./platform-fees";

// ============================================
// APP CONSTANTS
// ============================================
export const APP_NAME = "Tính Lãi Shopee";
export const APP_DESCRIPTION =
  "Công cụ tính lãi suất, phí và chi phí khi bán hàng trên Shopee, TikTok Shop";

// ============================================
// UI CONSTANTS
// ============================================
export const PLATFORM_OPTIONS = [
  { label: "Shopee", value: "shopee" },
  { label: "TikTok Shop", value: "tiktok" },
] as const;

export const SHOP_TYPE_OPTIONS = [
  { label: "Shop thường", value: "normal" },
  { label: "Preferred Seller", value: "preferred" },
  { label: "Shopee Mall", value: "mall" },
] as const;

// ============================================
// FORMAT CONSTANTS
// ============================================
export const CURRENCY_FORMAT = {
  locale: "vi-VN",
  currency: "VND",
} as const;
