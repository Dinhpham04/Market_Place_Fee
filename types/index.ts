// ============================================
// GLOBAL TYPES - Định nghĩa types chung cho dự án
// Cập nhật: 01/2026 - Theo chính sách Shopee mới
// ============================================

// Theme Types
export type Theme = "light" | "dark" | "system";

// Platform Types
export type Platform = "shopee" | "tiktok";

// Shopee Shop Type - Chỉ còn 2 loại chính
export type ShopeeShopType = "normal" | "mall";

// Shopee Category - Chi tiết theo ngành hàng
export type ShopeeCategory =
  | "fashion"      // Thời trang, Phụ kiện
  | "electronics"  // Điện tử, Điện thoại
  | "beauty"       // Làm đẹp, Sức khỏe
  | "baby"         // Mẹ & Bé
  | "home"         // Nhà cửa, Đời sống
  | "food"         // Thực phẩm
  | "sports"       // Thể thao, Dã ngoại
  | "books"        // Sách, Văn phòng phẩm
  | "pets"         // Thú cưng
  | "automotive"   // Ô tô, Xe máy
  | "default";     // Ngành hàng khác

// Order Source - Nguồn đơn hàng
export type OrderSource = "normal" | "live_video";

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
// BASE INPUT - Các trường dùng chung
// ============================================

export interface BaseCalculatorInput {
  readonly sellingPrice: number;
  readonly costPrice: number;
  readonly voucherShop?: number;
  readonly packagingCost?: number;
  readonly shippingCost?: number;
  readonly adsCost?: number;
  readonly quantity?: number;
  readonly includeTax?: boolean;
}

// ============================================
// SHOPEE INPUT - Theo chính sách 2025
// ============================================

export interface ShopeeCalculatorInput extends BaseCalculatorInput {
  readonly platform: "shopee";
  readonly shopType?: ShopeeShopType;
  readonly category?: ShopeeCategory;
  readonly orderSource?: OrderSource;
  
  // Phí dịch vụ tùy chọn
  readonly includePiShip?: boolean;        // Gói PiShip (thay Freeship Xtra)
  readonly includeVoucherXtra?: boolean;   // Gói Voucher Xtra
  readonly includeContentXtra?: boolean;   // Gói Content Xtra (đơn từ Live/Video)
  
  // Đồng tài trợ mã Shopee
  readonly shopeeVoucherAmount?: number;   // Giá trị mã Shopee khách dùng
}


// ============================================
// TIKTOK INPUT
// ============================================

export interface TikTokCalculatorInput extends BaseCalculatorInput {
  readonly platform: "tiktok";
  readonly category?: TikTokCategory;
  readonly includeFreeship?: boolean;  // TikTok vẫn dùng Freeship cũ
}

// Union Types for all platform inputs
export type CalculatorInput = ShopeeCalculatorInput | TikTokCalculatorInput;

// ============================================
// OUTPUT TYPES
// ============================================

/** Breakdown fee details - Cập nhật cho Shopee 2025 */
export interface FeeBreakdown {
  readonly feePayment: number;          // Phí thanh toán 5%
  readonly feeCommission: number;       // Phí cố định theo ngành
  readonly feeInfrastructure: number;   // Phí hạ tầng 3,000đ
  readonly feePiShip: number;           // Phí PiShip 1,650đ
  readonly feeVoucherXtra: number;      // Phí Voucher Xtra 2%
  readonly feeContentXtra: number;      // Phí Content Xtra 3%
  readonly feeShopeeCoFunding: number;  // Đồng tài trợ mã Shopee 20%
  readonly feeCOD: number;              // Phí COD (nếu có)
}

/** Calculator Result */
export interface CalculatorResult {
  readonly revenue: number;
  readonly totalPlatformFee: number;
  readonly feeBreakdown: FeeBreakdown;
  readonly taxAmount: number;
  readonly totalOperatingCost: number;
  readonly netProfit: number;
  readonly profitMargin: number;
  readonly profitPerUnit: number;
}


/** CALCULATOR INTERFACE - Dependency Inversion */


/** interface form all platform calculator - strategy pattern */
export interface PlatformCalculator<T extends CalculatorInput> {
  readonly platform: Platform;
  calculate(input: T): CalculatorResult;
}


/** UTILITY TYPES */

/** Type guard helper */
export type TypeGuard<T> = (input: unknown) => input is T;

/** Make all properties required */
export type RequiredInput<T extends { platform?: Platform }> = Required<Omit<T, "platform">> & Pick<T, "platform">;

/** Extract platform from input */

export type ExtractPlatform<T extends CalculatorInput> = T["platform"];
