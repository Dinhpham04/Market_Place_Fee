// ============================================
// PLATFORM FEES CONFIG - Shopee 2025
// Cập nhật theo chính sách mới từ 01/10/2025
// Nguồn: https://www.shopeeanalytics.com/vn/seller/expected-price
// ============================================

// --------------------------------------------
// SHOPEE CATEGORY TYPES
// --------------------------------------------
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

export type OrderSource = "normal" | "live_video";

// --------------------------------------------
// SHOPEE CATEGORY LABELS (Vietnamese)
// --------------------------------------------
export const SHOPEE_CATEGORY_LABELS: Record<ShopeeCategory, string> = {
  fashion: "Thời trang & Phụ kiện",
  electronics: "Điện tử & Điện thoại",
  beauty: "Làm đẹp & Sức khỏe",
  baby: "Mẹ & Bé",
  home: "Nhà cửa & Đời sống",
  food: "Thực phẩm",
  sports: "Thể thao & Dã ngoại",
  books: "Sách & Văn phòng phẩm",
  pets: "Thú cưng",
  automotive: "Ô tô & Xe máy",
  default: "Ngành hàng khác",
};

// --------------------------------------------
// PHÍ CỐ ĐỊNH THEO NGÀNH HÀNG (Commission)
// Áp dụng từ 01/06/2025 - Đã bao gồm VAT
// --------------------------------------------
export const SHOPEE_CATEGORY_COMMISSION = {
  // Shop thường (không thuộc Mall) - 7% đến 12%
  normal: {
    fashion: 0.11,       // 11%
    electronics: 0.08,   // 8%
    beauty: 0.11,        // 11%
    baby: 0.10,          // 10%
    home: 0.10,          // 10%
    food: 0.11,          // 11%
    sports: 0.10,        // 10%
    books: 0.07,         // 7%
    pets: 0.10,          // 10%
    automotive: 0.09,    // 9%
    default: 0.11,       // 11% mặc định
  },
  // Shop Mall - 5% đến 10%
  mall: {
    fashion: 0.08,       // 8%
    electronics: 0.05,   // 5%
    beauty: 0.08,        // 8%
    baby: 0.07,          // 7%
    home: 0.07,          // 7%
    food: 0.08,          // 8%
    sports: 0.07,        // 7%
    books: 0.05,         // 5%
    pets: 0.07,          // 7%
    automotive: 0.06,    // 6%
    default: 0.08,       // 8% mặc định
  },
} as const;

// --------------------------------------------
// SHOPEE FEES STRUCTURE
// --------------------------------------------
export const SHOPEE_FEES = {
  // ========================================
  // PHÍ BẮT BUỘC (Mandatory Fees)
  // ========================================

  /**
   * Phí thanh toán - 5% (đã bao gồm VAT)
   * Áp dụng: Mọi đơn hàng thành công
   * Công thức: (Giá SP + Phí ship người mua trả - Voucher shop) × 5%
   */
  payment: 0.05,

  /**
   * Phí hạ tầng - 3,000đ/đơn
   * Áp dụng từ: 01/07/2025
   */
  infrastructure: 3000,

  /**
   * Phí cố định theo ngành hàng (reference)
   */
  commission: SHOPEE_CATEGORY_COMMISSION,

  // ========================================
  // PHÍ DỊCH VỤ TÙY CHỌN (Optional Services)
  // ========================================
  service: {
    /**
     * Gói PiShip - 1,650đ/đơn
     * Thay thế Freeship Xtra cũ
     */
    piship: {
      fee: 1650,
    },

    /**
     * Gói Voucher Xtra - 2%/sản phẩm (từ 06/06/2025)
     * Tối đa: 50,000đ/sản phẩm
     */
    voucherXtra: {
      rate: 0.02,
      cap: 50000,
    },

    /**
     * Gói Content Xtra - 3%/sản phẩm (từ 06/06/2025)
     * Áp dụng: Đơn từ Livestream/Video
     * Shop thường: không giới hạn cap
     * Shop Mall: tối đa 50,000đ/sản phẩm
     */
    contentXtra: {
      rate: 0.03,
      capMall: 50000,
      capNormal: null,
    },

    /**
     * Đồng tài trợ mã Shopee (từ 01/10/2025)
     * Shop chịu 20% giá trị mã Shopee
     * Tối đa: 50,000đ/sản phẩm
     * Lưu ý: KHÔNG áp dụng nếu dùng Voucher Xtra
     */
    shopeeVoucherCoFunding: {
      rate: 0.20,
      cap: 50000,
    },
  },

  // Phí COD - Hiện không thu riêng
  cod: 0,
} as const;

// --------------------------------------------
// TIKTOK SHOP FEES (2025)
// --------------------------------------------
export const TIKTOK_FEES = {
  /** Phí giao dịch - 3% */
  transaction: 0.03,

  /** Phí hoa hồng theo ngành hàng */
  commission: {
    fashion: 0.03,
    beauty: 0.04,
    electronics: 0.02,
    food: 0.04,
    home: 0.03,
    other: 0.03,
    default: 0.03,
  },

  /** Phí vận chuyển Xtra - 5% */
  shipping: 0.05,
} as const;

// --------------------------------------------
// THUẾ (Tax Configuration) - 2025
// --------------------------------------------
export const TAX_RATES = {
  vat: 0.01,              // 1%
  pit: 0.005,             // 0.5% TNCN
  total: 0.015,           // 1.5% tổng
  threshold: 100_000_000, // Ngưỡng miễn thuế
} as const;

// --------------------------------------------
// VALIDATION LIMITS
// --------------------------------------------
export const LIMITS = {
  minPrice: 1_000,
  maxPrice: 500_000_000,
  minQuantity: 1,
  maxQuantity: 10_000,
  maxVoucher: 100,
  maxPackaging: 100_000,
  maxShipping: 500_000,
  maxShopeeVoucher: 200_000,
} as const;

// --------------------------------------------
// DEFAULT VALUES
// --------------------------------------------
export const DEFAULTS = {
  packagingCost: 3000,
  quantity: 1,
  includeTax: true,
  includePiShip: true,
  includeVoucherXtra: false,
  includeContentXtra: false,
  isFromLiveVideo: false,
  shopeeVoucherAmount: 0,
} as const;
