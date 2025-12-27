// ============================================
// PLATFORM FEES CONFIG
// Cấu hình phí sàn TMĐT - Dễ dàng cập nhật khi có thay đổi
// Cập nhật: Tháng 12/2024
// ============================================

// --------------------------------------------
// SHOPEE FEES
// --------------------------------------------
export const SHOPEE_FEES = {
  // Phí thanh toán - 5% (đã bao gồm VAT)
  payment: 0.05,

  // Phí hoa hồng theo loại shop
  commission: {
    normal: 0.04, // 4%
    preferred: 0.04,
    mall: {
      fashion: 0.06,
      electronics: 0.04,
      beauty: 0.08,
      baby: 0.06,
      home: 0.06,
      food: 0.08,
      default: 0.06,
    },
  },

  // Phí dịch vụ
  service: {
    freeshipXtra: {
      rate: 0.09, // 9%
      cap: 25000, // Tối đa 25,000đ
    },
    voucherXtra: {
      rate: 0.05, // 5%
      cap: 20000, // Tối đa 20,000đ
    },
  },

  // Phí COD
  cod: 0.02, // 2%

  // Thời gian miễn phí cho shop mới
  newShopGracePeriod: 90, // ngày
} as const;

// --------------------------------------------
// TIKTOK SHOP FEES
// --------------------------------------------
export const TIKTOK_FEES = {
  // Phí giao dịch
  transaction: 0.03, // 3%

  // Phí hoa hồng theo ngành hàng
  commission: {
    fashion: 0.03,
    beauty: 0.04,
    electronics: 0.02,
    food: 0.04,
    home: 0.03,
    default: 0.03,
  },

  // Phí vận chuyển Xtra
  shipping: 0.05, // 5%
} as const;

// --------------------------------------------
// THUẾ
// --------------------------------------------
export const TAX_RATES = {
  vat: 0.01, // 1%
  pit: 0.005, // 0.5% - Thuế TNCN
  total: 0.015, // 1.5%
  threshold: 100_000_000, // Miễn thuế nếu < 100 triệu/năm
} as const;

// --------------------------------------------
// VALIDATION LIMITS
// --------------------------------------------
export const LIMITS = {
  minPrice: 1_000, // 1,000đ
  maxPrice: 500_000_000, // 500 triệu
  minQuantity: 1,
  maxQuantity: 10_000,
  maxVoucher: 100, // 100% giá bán
  maxPackaging: 100_000, // 100,000đ
  maxShipping: 500_000, // 500,000đ
} as const;

// --------------------------------------------
// DEFAULT VALUES
// --------------------------------------------
export const DEFAULTS = {
  packagingCost: 3000,
  quantity: 1,
  includeTax: true,
  includeFreeship: true,
  includeVoucherXtra: false,
} as const;
