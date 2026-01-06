import { TAX_RATES, DEFAULTS } from "@/constants";

import type {
    CalculatorInput,
    CalculatorResult,
    FeeBreakdown,
    Platform,
    PlatformCalculator,
} from "@/types"


/**
 * Abstract base class for all platform calculators
 * Use template method pattern
 */

export abstract class BaseCalculator<T extends CalculatorInput>
    implements PlatformCalculator<T> {
    abstract readonly platform: Platform;

    /** Template method - Declare skeleton (khung) for algorithm
     *  Detail Steps are implemented by subclass
     */
    calculate(input: T): CalculatorResult {
        // 1. Normalize input with defaults
        const normalizedInput = this.normalizeInput(input);
        // 2. Calculate revenue
        const revenue = this.calculateRevenue(normalizedInput);
        // 3. Calculate fee platform (each platform has different fee)
        const feeBreakdown = this.calculateFeeBreakdown(revenue, normalizedInput);
        const totalPlatformFee = this.sumFees(feeBreakdown);
        // 4. Calculate tax
        const taxAmount = this.calculateTax(revenue, normalizedInput.includeTax || false);
        // 5. Calculate operating cost
        const totalOperatingCost = this.calculateOperatingCost(normalizedInput);
        // 6. Calculate final result
        const netProfit = revenue - totalPlatformFee - taxAmount - totalOperatingCost;
        const profitMargin = this.calculateProfitMargin(netProfit, revenue);
        const profitPerUnit = this.calculateProfitPerUnit(netProfit, normalizedInput.quantity || DEFAULTS.quantity);

        return Object.freeze({
            revenue,
            totalPlatformFee,
            feeBreakdown,
            taxAmount,
            totalOperatingCost,
            netProfit,
            profitMargin,
            profitPerUnit,
        });
    }

    /**
     * Abstract method must be implemented by subclass
     */

    /** 
     * calculate fee platform for each platform
     */

    protected abstract calculateFeeBreakdown(
        revenue: number,
        input: RequiredFields<T>
    ): FeeBreakdown;

    /**
     * Normalize input with defaults of each platform
     */
    protected abstract normalizeInput(input: T): RequiredFields<T>;

    /**
     * Shared method to share across all platforms
     */

    /**
     * Calculate net revenue after deducting vouchers
     */
    protected calculateRevenue(input: RequiredFields<T>): number {
        return Math.max(0, input.sellingPrice - (input.voucherShop || 0));
    }

    /** 
     * Calculate personal income tax
     */
    protected calculateTax(revenue: number, includeTax: boolean): number {
        return includeTax ? revenue * TAX_RATES.total : 0;
    }
    /**
     * Calculate operating cost
     */
    protected calculateOperatingCost(input: RequiredFields<T>): number {
        return input.costPrice + (input.packagingCost || 0) + (input.shippingCost || 0) + (input.adsCost || 0);
    }
    /**
     * Calculate Profit Margin
     */
    protected calculateProfitMargin(netProfit: number, revenue: number): number {
        return revenue <= 0 ? 0 : (netProfit / revenue);
    }
    /**
     * Calculate profit per unit
     */
    protected calculateProfitPerUnit(netProfit: number, quantity: number): number {
        return quantity <= 0 ? 0 : (netProfit / quantity);
    }
    /**
     * Summary of fees - Updated for 2025 structure
     */

    protected sumFees(breakdown: FeeBreakdown): number {
        return (
            breakdown.feePayment +
            breakdown.feeCommission +
            breakdown.feeInfrastructure +
            breakdown.feePiShip +
            breakdown.feeVoucherXtra +
            breakdown.feeContentXtra +
            breakdown.feeShopeeCoFunding +
            breakdown.feeCOD
        )
    }

}

// ============================================
// UTILITY TYPES
// ============================================
/** Helper type để đảm bảo tất cả optional fields đã có giá trị */
type RequiredFields<T extends CalculatorInput> = Required<
    Omit<T, "platform">
> &
    Pick<T, "platform">;
export type { RequiredFields };