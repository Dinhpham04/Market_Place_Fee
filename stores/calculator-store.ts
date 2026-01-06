// ============================================
// CALCULATOR STORE - Zustand State Management
// Quản lý state cho real-time calculation
// ============================================

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { CalculatorResult, ShopeeCalculatorInput, TikTokCalculatorInput } from "@/types";
import { calculateProfit } from "@/lib/calculator";

// ============================================
// TYPES
// ============================================

/** Tab hiện tại của calculator */
export type CalculatorTab = "calculator" | "compare";

/** Input form state - union type cho cả 2 platform */
export type FormInputState = ShopeeCalculatorInput | TikTokCalculatorInput;

/** Store state interface */
interface CalculatorState {
  // Current active tab
  activeTab: CalculatorTab;
  
  // Form input values
  formInput: FormInputState;
  
  // Calculation result (null nếu chưa tính hoặc input invalid)
  result: CalculatorResult | null;
  
  // Loading state
  isCalculating: boolean;
  
  // Error state
  error: string | null;
  
  // History (optional - cho Phase 2)
  // history: CalculatorResult[];
}

/** Store actions interface */
interface CalculatorActions {
  // Tab actions
  setActiveTab: (tab: CalculatorTab) => void;
  
  // Form actions
  updateFormInput: (input: Partial<FormInputState>) => void;
  resetForm: () => void;
  
  // Calculation actions
  calculate: () => void;
  clearResult: () => void;
  
  // Error handling
  setError: (error: string | null) => void;
}

/** Combined store type */
type CalculatorStore = CalculatorState & CalculatorActions;

// ============================================
// DEFAULT VALUES
// ============================================

const DEFAULT_SHOPEE_INPUT: ShopeeCalculatorInput = {
  platform: "shopee",
  sellingPrice: 0,
  costPrice: 0,
  shopType: "normal",
  category: "default",
  orderSource: "normal",
  voucherShop: 0,
  packagingCost: 3000,
  shippingCost: 0,
  adsCost: 0,
  quantity: 1,
  includeTax: true,
  includePiShip: true,
  includeVoucherXtra: false,
  includeContentXtra: false,
  shopeeVoucherAmount: 0,
};

const DEFAULT_STATE: CalculatorState = {
  activeTab: "calculator",
  formInput: DEFAULT_SHOPEE_INPUT,
  result: null,
  isCalculating: false,
  error: null,
};

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useCalculatorStore = create<CalculatorStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...DEFAULT_STATE,

        // ========================================
        // TAB ACTIONS
        // ========================================
        
        setActiveTab: (tab) => {
          set({ activeTab: tab }, false, "setActiveTab");
        },

        // ========================================
        // FORM ACTIONS
        // ========================================
        
        /**
         * Update form input và auto-calculate nếu có đủ dữ liệu
         * Sử dụng partial update để chỉ cập nhật fields cần thiết
         */
        updateFormInput: (partialInput) => {
          const currentInput = get().formInput;
          
          // Merge input mới với input hiện tại
          const newInput = { ...currentInput, ...partialInput } as FormInputState;
          
          set({ formInput: newInput }, false, "updateFormInput");
          
          // Auto-calculate nếu có giá bán và giá vốn
          if (newInput.sellingPrice > 0 && newInput.costPrice >= 0) {
            get().calculate();
          } else {
            // Clear result nếu thiếu dữ liệu
            set({ result: null }, false, "clearResultOnInvalidInput");
          }
        },

        /**
         * Reset form về giá trị mặc định
         */
        resetForm: () => {
          set(
            {
              formInput: DEFAULT_SHOPEE_INPUT,
              result: null,
              error: null,
            },
            false,
            "resetForm"
          );
        },

        // ========================================
        // CALCULATION ACTIONS
        // ========================================
        
        /**
         * Thực hiện tính toán dựa trên formInput hiện tại
         */
        calculate: () => {
          const { formInput } = get();
          
          // Validate input
          if (formInput.sellingPrice <= 0) {
            set({ result: null, error: null }, false, "skipCalculation");
            return;
          }
          
          set({ isCalculating: true, error: null }, false, "startCalculation");
          
          try {
            // Tính toán lợi nhuận
            const result = calculateProfit(formInput);
            
            set(
              { result, isCalculating: false },
              false,
              "calculationSuccess"
            );
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Lỗi tính toán";
            set(
              { error: errorMessage, isCalculating: false, result: null },
              false,
              "calculationError"
            );
          }
        },

        /**
         * Clear result
         */
        clearResult: () => {
          set({ result: null }, false, "clearResult");
        },

        // ========================================
        // ERROR HANDLING
        // ========================================
        
        setError: (error) => {
          set({ error }, false, "setError");
        },
      }),
      {
        name: "calculator-storage",
        // Chỉ persist formInput, không persist result
        partialize: (state) => ({
          formInput: state.formInput,
          activeTab: state.activeTab,
        }),
      }
    ),
    { name: "CalculatorStore" }
  )
);

// ============================================
// SELECTORS - Memoized selectors cho performance
// ============================================

/** Selector lấy platform hiện tại */
export const selectPlatform = (state: CalculatorStore) => state.formInput.platform;

/** Selector kiểm tra có đang lỗ không */
export const selectIsLoss = (state: CalculatorStore) => 
  state.result !== null && state.result.netProfit < 0;

/** Selector lấy tỷ suất lợi nhuận formatted */
export const selectProfitMarginFormatted = (state: CalculatorStore) =>
  state.result ? `${(state.result.profitMargin * 100).toFixed(2)}%` : "0%";
