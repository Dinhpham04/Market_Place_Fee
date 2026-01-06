// ============================================
// SHOPEE CALCULATOR - Cập nhật theo chính sách 2025
// Nguồn: https://www.shopeeanalytics.com/vn/seller/expected-price
// ============================================

import type { FeeBreakdown, Platform, ShopeeCalculatorInput, ShopeeCategory, ShopeeShopType, OrderSource } from "@/types";
import { BaseCalculator, RequiredFields } from "./base-calculator";
import { DEFAULTS, SHOPEE_FEES, SHOPEE_CATEGORY_COMMISSION } from "@/constants";


type NormalizedShopeeInput = RequiredFields<ShopeeCalculatorInput>;

export class ShopeeCalculator extends BaseCalculator<ShopeeCalculatorInput> {
    readonly platform: Platform = "shopee";

    // ============================================
    // NORMALIZE INPUT
    // ============================================
    protected normalizeInput(input: ShopeeCalculatorInput): NormalizedShopeeInput {
        return {
            platform: "shopee",
            sellingPrice: input.sellingPrice,
            costPrice: input.costPrice,
            shopType: input.shopType ?? "normal",
            category: input.category ?? "default",
            orderSource: input.orderSource ?? "normal",
            voucherShop: input.voucherShop ?? 0,
            packagingCost: input.packagingCost ?? DEFAULTS.packagingCost,
            shippingCost: input.shippingCost ?? 0,
            adsCost: input.adsCost ?? 0,
            quantity: input.quantity ?? DEFAULTS.quantity,
            includeTax: input.includeTax ?? DEFAULTS.includeTax,
            includePiShip: input.includePiShip ?? DEFAULTS.includePiShip,
            includeVoucherXtra: input.includeVoucherXtra ?? DEFAULTS.includeVoucherXtra,
            includeContentXtra: input.includeContentXtra ?? DEFAULTS.includeContentXtra,
            shopeeVoucherAmount: input.shopeeVoucherAmount ?? DEFAULTS.shopeeVoucherAmount,
        }
    }

    // ============================================
    // CALCULATE FEE BREAKDOWN - 2025 Structure
    // ============================================
    protected calculateFeeBreakdown(
        revenue: number,
        input: NormalizedShopeeInput
    ): FeeBreakdown {
        // Tính phí đồng tài trợ mã Shopee
        // Chỉ tính nếu KHÔNG dùng Voucher Xtra và có mã Shopee
        const feeShopeeCoFunding = this.calculateShopeeCoFundingFee(
            input.shopeeVoucherAmount,
            input.includeVoucherXtra
        );

        return Object.freeze({
            feePayment: this.calculatePaymentFee(revenue),
            feeCommission: this.calculateCommissionFee(revenue, input.shopType, input.category),
            feeInfrastructure: SHOPEE_FEES.infrastructure, // 3,000đ/đơn
            feePiShip: this.calculatePiShipFee(input.includePiShip),
            feeVoucherXtra: this.calculateVoucherXtraFee(revenue, input.includeVoucherXtra),
            feeContentXtra: this.calculateContentXtraFee(revenue, input.includeContentXtra, input.orderSource, input.shopType),
            feeShopeeCoFunding,
            feeCOD: 0, // Shopee không thu riêng phí COD nữa
        });
    }

    // ============================================
    // PRIVATE CALCULATION METHODS
    // ============================================

    /** Phí thanh toán - 5% */
    private calculatePaymentFee(revenue: number): number {
        return revenue * SHOPEE_FEES.payment;
    }

    /** 
     * Phí cố định theo ngành hàng
     * Normal: 7-12%, Mall: 5-10%
     */
    private calculateCommissionFee(
        revenue: number,
        shopType: ShopeeShopType,
        category: ShopeeCategory
    ): number {
        const rateTable = SHOPEE_CATEGORY_COMMISSION[shopType];
        const rate = rateTable[category] ?? rateTable.default;
        return revenue * rate;
    }

    /** 
     * Phí PiShip - 1,650đ/đơn
     * Thay thế Freeship Xtra cũ
     */
    private calculatePiShipFee(includePiShip: boolean): number {
        if (!includePiShip) return 0;
        return SHOPEE_FEES.service.piship.fee;
    }

    /** 
     * Phí Voucher Xtra - 2%/sản phẩm
     * Tối đa 50,000đ/sản phẩm
     */
    private calculateVoucherXtraFee(revenue: number, includeVoucherXtra: boolean): number {
        if (!includeVoucherXtra) return 0;
        const { rate, cap } = SHOPEE_FEES.service.voucherXtra;
        return Math.min(revenue * rate, cap);
    }

    /**
     * Phí Content Xtra - 3%/sản phẩm
     * Chỉ áp dụng cho đơn từ Livestream/Video
     * Shop thường: không giới hạn cap
     * Shop Mall: tối đa 50,000đ/sản phẩm
     */
    private calculateContentXtraFee(
        revenue: number,
        includeContentXtra: boolean,
        orderSource: OrderSource,
        shopType: ShopeeShopType
    ): number {
        // Chỉ tính khi đăng ký Content Xtra VÀ đơn từ Live/Video
        if (!includeContentXtra || orderSource !== "live_video") return 0;
        
        const { rate, capMall } = SHOPEE_FEES.service.contentXtra;
        const calculatedFee = revenue * rate;
        
        // Shop Mall có cap, shop thường không
        if (shopType === "mall" && capMall) {
            return Math.min(calculatedFee, capMall);
        }
        return calculatedFee;
    }

    /**
     * Đồng tài trợ mã Shopee - 20% giá trị mã
     * Tối đa 50,000đ/sản phẩm
     * Lưu ý: KHÔNG áp dụng nếu đã dùng Voucher Xtra
     */
    private calculateShopeeCoFundingFee(
        shopeeVoucherAmount: number,
        includeVoucherXtra: boolean
    ): number {
        // Nếu dùng Voucher Xtra thì không bị tính đồng tài trợ
        if (includeVoucherXtra || shopeeVoucherAmount <= 0) return 0;
        
        const { rate, cap } = SHOPEE_FEES.service.shopeeVoucherCoFunding;
        const calculatedFee = shopeeVoucherAmount * rate;
        return Math.min(calculatedFee, cap);
    }
}