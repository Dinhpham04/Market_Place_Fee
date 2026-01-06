// ============================================
// CALCULATOR FACTORY - Factory Pattern
// Dễ dàng mở rộng thêm platform mới
// ============================================

import type {
    CalculatorInput,
    ShopeeCalculatorInput,
    TikTokCalculatorInput,
    Platform,
    PlatformCalculator,
} from "@/types";
import { ShopeeCalculator } from "./shopee-calculator";
import { TikTokCalculator } from "./tiktok-calculator";

// ============================================
// TYPE GUARDS - Runtime type checking
// ============================================


export function isShopeeInput(input: CalculatorInput): input is ShopeeCalculatorInput {
    return input.platform === "shopee";
}

// ý nghĩa là nếu trả về true thì sẽ thu hẹp kiểu thành ShopeeCalculatorInput thay vì có thể là TiktokCalculatorInput để sử dụng trong phạm vi tiếp theo
export function isTikTokInput(input: CalculatorInput): input is TikTokCalculatorInput {
    return input.platform === "tiktok";
}

// ============================================
// CALCULATOR REGISTRY - Extensible
// ============================================

type CalculatorRegistry = {
    readonly [K in Platform]: PlatformCalculator<CalculatorInput>;
}

/** Registry của tất cả calculators - Singleton */
const calculatorRegistry: CalculatorRegistry = {
    shopee: new ShopeeCalculator(),
    tiktok: new TikTokCalculator(),
} as const; // object bất biến không thay đổi được cả thuộc tính

// ============================================
// FACTORY FUNCTION
// ============================================
/**
 * Factory function để lấy calculator phù hợp
 * @throws Error nếu platform không được hỗ trợ
 */

export function createCalculator(platform: Platform): PlatformCalculator<CalculatorInput> {
    const calculator = calculatorRegistry[platform];
    if (!calculator) {
        throw new Error(`Unsupported platform: ${platform}`);
    }
    return calculator;
}


/** 
 * Get list supported platform
 */

export function getSupportedPlatforms(): readonly Platform[] {
    return Object.keys(calculatorRegistry) as Platform[];
}