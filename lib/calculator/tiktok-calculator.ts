// ============================================
// TIKTOK CALCULATOR - Concrete Implementation
// ============================================

import { TIKTOK_FEES, DEFAULTS } from "@/constants";
import type { TikTokCalculatorInput, FeeBreakdown } from "@/types";
import { BaseCalculator, type RequiredFields } from "./base-calculator";

type NormalizedTikTokInput = RequiredFields<TikTokCalculatorInput>;

export class TikTokCalculator extends BaseCalculator<TikTokCalculatorInput> {
    readonly platform = "tiktok" as const;

    // ============================================
    // NORMALIZE INPUT
    // ============================================

    protected normalizeInput(input: TikTokCalculatorInput): NormalizedTikTokInput {
        return {
            platform: "tiktok",
            sellingPrice: input.sellingPrice,
            costPrice: input.costPrice,
            category: input.category ?? "other",
            voucherShop: input.voucherShop ?? 0,
            packagingCost: input.packagingCost ?? DEFAULTS.packagingCost,
            shippingCost: input.shippingCost ?? 0,
            adsCost: input.adsCost ?? 0,
            quantity: input.quantity ?? DEFAULTS.quantity,
            includeTax: input.includeTax ?? DEFAULTS.includeTax,
            includeFreeship: input.includeFreeship ?? true,
        };
    }

    // ============================================
    // CALCULATE FEE BREAKDOWN
    // ============================================

    protected calculateFeeBreakdown(
        revenue: number,
        input: NormalizedTikTokInput
    ): FeeBreakdown {
        return Object.freeze({
            feePayment: this.calculateTransactionFee(revenue),
            feeCommission: this.calculateCommissionFee(revenue, input.category),
            feeInfrastructure: 0,       // TikTok không có phí hạ tầng
            feePiShip: 0,               // TikTok không có PiShip
            feeVoucherXtra: 0,          // TikTok không có Voucher Xtra
            feeContentXtra: 0,          // TikTok không có Content Xtra
            feeShopeeCoFunding: 0,      // Chỉ Shopee có
            feeCOD: 0,
        });
    }

    // ============================================
    // PRIVATE CALCULATION METHODS
    // ============================================

    /** Phí giao dịch 3% */
    private calculateTransactionFee(revenue: number): number {
        return revenue * TIKTOK_FEES.transaction;
    }

    /** Phí hoa hồng theo category */
    private calculateCommissionFee(
        revenue: number,
        category: NonNullable<TikTokCalculatorInput["category"]>
    ): number {
        const rate = TIKTOK_FEES.commission[category] ?? TIKTOK_FEES.commission.default;
        return revenue * rate;
    }
}