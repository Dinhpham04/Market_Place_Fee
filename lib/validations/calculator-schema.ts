// ============================================
// CALCULATOR FORM SCHEMA - Zod Validation
// Cập nhật theo chính sách Shopee 2025
// ============================================

import { z } from "zod";
import { LIMITS } from "@/constants";

// ============================================
// SHOPEE CATEGORY ENUM
// ============================================
const shopeeCategoryEnum = z.enum([
    "fashion",
    "electronics",
    "beauty",
    "baby",
    "home",
    "food",
    "sports",
    "books",
    "pets",
    "automotive",
    "default",
]);

const orderSourceEnum = z.enum(["normal", "live_video"]);

// ============================================
// BASE SCHEMA - Dùng chung cho mọi platform
// ============================================

const baseSchema = z.object({
    sellingPrice: z
        .number({
            error: "Vui lòng nhập giá bán hợp lệ",
        })
        .min(LIMITS.minPrice, `Giá bán tối thiểu ${LIMITS.minPrice.toLocaleString()}₫`)
        .max(LIMITS.maxPrice, `Giá bán tối đa ${LIMITS.maxPrice.toLocaleString()}₫`),

    costPrice: z
        .number({
            error: "Vui lòng nhập giá vốn hợp lệ",
        })
        .min(0, "Giá vốn không được âm")
        .max(LIMITS.maxPrice, `Giá vốn tối đa ${LIMITS.maxPrice.toLocaleString()}`),

    voucherShop: z.number().min(0, "Voucher không được âm").optional().default(0),

    packagingCost: z
        .number()
        .min(0, "Chi phí đóng gói không được âm")
        .max(LIMITS.maxPackaging, `Tối đa ${LIMITS.maxPackaging.toLocaleString()}₫`)
        .optional()
        .default(0),

    shippingCost: z
        .number()
        .min(0, "Phí ship không được âm")
        .max(LIMITS.maxShipping, `Tối đa ${LIMITS.maxShipping.toLocaleString()}₫`)
        .optional()
        .default(0),

    adsCost: z
        .number()
        .min(0, "Chi phí ads không được âm")
        .optional()
        .default(0),

    quantity: z
        .number()
        .int("Số lượng phải là số nguyên")
        .min(LIMITS.minQuantity, `Tối thiểu ${LIMITS.minQuantity}`)
        .max(LIMITS.maxQuantity, `Tối đa ${LIMITS.maxQuantity}`)
        .optional()
        .default(1),

    includeTax: z.boolean().optional().default(true),
});

// ============================================
// SHOPEE SCHEMA - Chính sách 2025
// ============================================

export const shopeeFormSchema = baseSchema.extend({
    platform: z.literal("shopee"),
    shopType: z
        .enum(["normal", "mall"])
        .optional()
        .default("normal"),
    category: shopeeCategoryEnum.optional().default("default"),
    orderSource: orderSourceEnum.optional().default("normal"),
    
    // Phí dịch vụ tùy chọn
    includePiShip: z.boolean().optional().default(true),           // Mặc định có PiShip
    includeVoucherXtra: z.boolean().optional().default(false),
    includeContentXtra: z.boolean().optional().default(false),
    
    // Đồng tài trợ mã Shopee
    shopeeVoucherAmount: z
        .number()
        .min(0, "Giá trị mã không được âm")
        .max(LIMITS.maxShopeeVoucher, `Tối đa ${LIMITS.maxShopeeVoucher.toLocaleString()}₫`)
        .optional()
        .default(0),
});

// ============================================
// TIKTOK SCHEMA - Discriminated Union
// ============================================

export const tiktokFormSchema = baseSchema.extend({
    platform: z.literal("tiktok"),
    category: z
        .enum(["fashion", "beauty", "electronics", "home", "food", "other"])
        .optional()
        .default("other"),
    includeFreeship: z.boolean().optional().default(true),
});


// ============================================
// UNION SCHEMA - Tự động chọn dựa trên platform
// ============================================

export const calculatorFormSchema = z.discriminatedUnion("platform", [
    shopeeFormSchema,
    tiktokFormSchema,
])
/** Dựa vào thuộc tính platform của shopee và tiktok để chọn schema phù hợp */

// ============================================
// INFER TYPES TỪ SCHEMA
// ============================================

export type ShopeeFormValues = z.infer<typeof shopeeFormSchema>;
export type TikTokFormValues = z.infer<typeof tiktokFormSchema>;
export type CalculatorFormValues = z.infer<typeof calculatorFormSchema>;

// Input type for React Hook Form (before Zod transforms/defaults are applied)
export type CalculatorFormInput = z.input<typeof calculatorFormSchema>;
// ============================================
// CUSTOM REFINEMENTS - Business Logic Validation
// ============================================
/**
 * Schema với validation nâng cao
 * - Kiểm tra voucher không lớn hơn giá bán
 * - Cảnh báo nếu giá bán < giá vốn
 */
export const calculatorFormSchemaWithRefinements = calculatorFormSchema.refine(
    (data) => data.voucherShop <= data.sellingPrice,
    {
        message: "Voucher không thể lớn hơn giá bán",
        path: ["voucherShop"],
    }
);