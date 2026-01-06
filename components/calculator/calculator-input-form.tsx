// ============================================
// CALCULATOR INPUT FORM - Form nhập liệu
// Refactored để sử dụng Zustand store
// ============================================

"use client";

import { memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Store,
  Package,
  Tag,
  DollarSign,
  Percent,
  Truck,
  Video,
  Megaphone,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  shopeeFormSchema,
  type ShopeeFormValues,
} from "@/lib/validations/calculator-schema";
import { formatNumber, parseNumber } from "@/lib/utils";
import { SHOPEE_CATEGORY_LABELS, SHOPEE_CATEGORY_COMMISSION } from "@/constants";
import { useCalculatorStore } from "@/stores";
import type { ShopeeCategory } from "@/types";

// ============================================
// CONSTANTS
// ============================================

const SHOP_TYPE_OPTIONS = [
  { value: "normal" as const, label: "Shop thường", description: "Phí 7-12%" },
  { value: "mall" as const, label: "Shopee Mall", description: "Phí 5-10%" },
];

const ORDER_SOURCE_OPTIONS = [
  { value: "normal" as const, label: "Đơn thường" },
  { value: "live_video" as const, label: "Từ Livestream/Video" },
];

// Shopee category với phí %
const SHOPEE_CATEGORY_OPTIONS = Object.entries(SHOPEE_CATEGORY_LABELS).map(
  ([value, label]) => ({
    value: value as ShopeeCategory,
    label,
    feeNormal: `${(SHOPEE_CATEGORY_COMMISSION.normal[value as ShopeeCategory] * 100).toFixed(0)}%`,
    feeMall: `${(SHOPEE_CATEGORY_COMMISSION.mall[value as ShopeeCategory] * 100).toFixed(0)}%`,
  })
);

// ============================================
// COMPONENT
// ============================================

/**
 * CalculatorInputForm - Form nhập thông tin sản phẩm
 *
 * Features:
 * - Real-time calculation khi input thay đổi
 * - Validation với Zod
 * - Grouped sections cho UX tốt hơn
 * - Responsive design
 */
function CalculatorInputFormComponent() {
  // ========================================
  // STORE HOOKS
  // ========================================
  const formInput = useCalculatorStore((state) => state.formInput);
  const updateFormInput = useCalculatorStore((state) => state.updateFormInput);
  
  // Type guard: kiểm tra xem formInput có phải Shopee không
  const isShopeeInput = formInput.platform === "shopee";
  const shopeeDefaults = {
    shopType: "normal" as const,
    category: "default" as const,
    orderSource: "normal" as const,
    includePiShip: true,
    includeVoucherXtra: false,
    includeContentXtra: false,
    shopeeVoucherAmount: 0,
  };

  // ========================================
  // FORM SETUP - Sử dụng ShopeeFormValues với default values
  // ========================================
  const form = useForm<ShopeeFormValues>({
    // @ts-expect-error - zodResolver type mismatch với optional defaults
    resolver: zodResolver(shopeeFormSchema),
    defaultValues: {
      platform: "shopee",
      sellingPrice: formInput.sellingPrice,
      costPrice: formInput.costPrice,
      voucherShop: formInput.voucherShop,
      packagingCost: formInput.packagingCost,
      shippingCost: formInput.shippingCost,
      adsCost: formInput.adsCost,
      quantity: formInput.quantity,
      includeTax: formInput.includeTax,
      // Shopee-specific fields với fallback
      shopType: isShopeeInput && "shopType" in formInput ? formInput.shopType : shopeeDefaults.shopType,
      category: isShopeeInput && "category" in formInput ? formInput.category as ShopeeCategory : shopeeDefaults.category,
      orderSource: isShopeeInput && "orderSource" in formInput ? formInput.orderSource : shopeeDefaults.orderSource,
      includePiShip: isShopeeInput && "includePiShip" in formInput ? formInput.includePiShip : shopeeDefaults.includePiShip,
      includeVoucherXtra: isShopeeInput && "includeVoucherXtra" in formInput ? formInput.includeVoucherXtra : shopeeDefaults.includeVoucherXtra,
      includeContentXtra: isShopeeInput && "includeContentXtra" in formInput ? formInput.includeContentXtra : shopeeDefaults.includeContentXtra,
      shopeeVoucherAmount: isShopeeInput && "shopeeVoucherAmount" in formInput ? formInput.shopeeVoucherAmount : shopeeDefaults.shopeeVoucherAmount,
    },
    mode: "onChange",
  });

  // Watch các values quan trọng
  const shopType = form.watch("shopType");
  const orderSource = form.watch("orderSource");
  const includeVoucherXtra = form.watch("includeVoucherXtra");
  const category = form.watch("category");

  // ========================================
  // HANDLERS
  // ========================================

  /**
   * Handle number input change
   * Chuyển đổi formatted string -> number
   */
  const handleNumberChange = useCallback(
    (
      field: { onChange: (value: number) => void; name: string },
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = parseNumber(e.target.value);
      field.onChange(value);
      updateFormInput({ [field.name]: value });
    },
    [updateFormInput]
  );

  /**
   * Handle select change
   */
  const handleSelectChange = useCallback(
    (fieldName: keyof ShopeeFormValues, value: string) => {
      updateFormInput({ [fieldName]: value });
    },
    [updateFormInput]
  );

  /**
   * Handle checkbox change
   */
  const handleCheckboxChange = useCallback(
    (fieldName: keyof ShopeeFormValues, checked: boolean) => {
      updateFormInput({ [fieldName]: checked });
    },
    [updateFormInput]
  );

  // ========================================
  // RENDER HELPERS
  // ========================================

  const renderCategoryFee = (option: (typeof SHOPEE_CATEGORY_OPTIONS)[0]) => {
    const fee = shopType === "mall" ? option.feeMall : option.feeNormal;
    return (
      <span className="ml-auto text-xs text-muted-foreground font-medium">
        {fee}
      </span>
    );
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 text-orange-600">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Thông tin sản phẩm</CardTitle>
            <CardDescription>Nhập thông tin để tính lợi nhuận</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form className="space-y-6">
            {/* ================================ */}
            {/* SECTION 1: Nền tảng & Shop Type */}
            {/* ================================ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Store className="h-4 w-4" />
                <span>Nền tảng & Loại Shop</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Shop Type */}
                <FormField
                  control={form.control}
                  name="shopType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại shop</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSelectChange("shopType", value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại shop" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SHOP_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{option.label}</span>
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  {option.description}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngành hàng</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSelectChange("category", value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngành hàng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SHOPEE_CATEGORY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center justify-between w-full gap-4">
                                <span className="truncate">{option.label}</span>
                                {renderCategoryFee(option)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Phí:{" "}
                        {shopType === "mall"
                          ? `${(SHOPEE_CATEGORY_COMMISSION.mall[category ?? "default"] * 100).toFixed(0)}%`
                          : `${(SHOPEE_CATEGORY_COMMISSION.normal[category ?? "default"] * 100).toFixed(0)}%`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* ================================ */}
            {/* SECTION 2: Giá & Số lượng */}
            {/* ================================ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Giá & Số lượng</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Giá bán */}
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        Giá bán <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="100,000"
                            value={formatNumber(field.value || 0)}
                            onChange={(e) => handleNumberChange(field, e)}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ₫
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Giá vốn */}
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        Giá vốn <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="70,000"
                            value={formatNumber(field.value || 0)}
                            onChange={(e) => handleNumberChange(field, e)}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ₫
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Voucher shop */}
                <FormField
                  control={form.control}
                  name="voucherShop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                        Voucher shop (bạn trả)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="10,000"
                            value={formatNumber(field.value || 0)}
                            onChange={(e) => handleNumberChange(field, e)}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ₫
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Số lượng */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        Số lượng
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="1"
                          value={field.value || 1}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            field.onChange(value);
                            updateFormInput({ quantity: value });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* ================================ */}
            {/* SECTION 3: Dịch vụ & Phí */}
            {/* ================================ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Settings className="h-4 w-4" />
                <span>Dịch vụ & Phí tùy chọn</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Order Source */}
                <FormField
                  control={form.control}
                  name="orderSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Video className="h-3.5 w-3.5 text-muted-foreground" />
                        Nguồn đơn hàng
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSelectChange("orderSource", value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ORDER_SOURCE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {orderSource === "live_video" && (
                        <FormDescription className="text-orange-600">
                          +3% phí Content Xtra
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Checkboxes cho các dịch vụ */}
              <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
                {/* PiShip */}
                <FormField
                  control={form.control}
                  name="includePiShip"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleCheckboxChange("includePiShip", !!checked);
                          }}
                        />
                      </FormControl>
                      <div className="flex-1">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Đơn có vận chuyển
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Phí PiShip cố định 1,650₫/đơn
                        </FormDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        1,650₫
                      </Badge>
                    </FormItem>
                  )}
                />

                {/* Voucher Xtra */}
                <FormField
                  control={form.control}
                  name="includeVoucherXtra"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleCheckboxChange(
                              "includeVoucherXtra",
                              !!checked
                            );
                          }}
                        />
                      </FormControl>
                      <div className="flex-1">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Voucher Xtra
                        </FormLabel>
                        <FormDescription className="text-xs">
                          2% doanh thu (tối đa 50,000₫)
                        </FormDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        2%
                      </Badge>
                    </FormItem>
                  )}
                />

                {/* Content Xtra (chỉ hiển thị khi orderSource = live_video) */}
                {orderSource === "live_video" && (
                  <FormField
                    control={form.control}
                    name="includeContentXtra"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              handleCheckboxChange(
                                "includeContentXtra",
                                !!checked
                              );
                            }}
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Content Xtra
                          </FormLabel>
                          <FormDescription className="text-xs">
                            3% cho đơn từ Live/Video
                          </FormDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-orange-100 text-orange-700"
                        >
                          3%
                        </Badge>
                      </FormItem>
                    )}
                  />
                )}

                {/* Thuế */}
                <FormField
                  control={form.control}
                  name="includeTax"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleCheckboxChange("includeTax", !!checked);
                          }}
                        />
                      </FormControl>
                      <div className="flex-1">
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Tính thuế TNCN
                        </FormLabel>
                        <FormDescription className="text-xs">
                          1.5% (chỉ áp dụng khi doanh thu &gt; 100tr/năm)
                        </FormDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        1.5%
                      </Badge>
                    </FormItem>
                  )}
                />
              </div>

              {/* Shopee Voucher Co-funding (chỉ hiển thị khi KHÔNG bật Voucher Xtra) */}
              {!includeVoucherXtra && (
                <div className="space-y-3 rounded-lg border border-dashed border-orange-300 p-4 bg-orange-50/50">
                  <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
                    <Tag className="h-4 w-4" />
                    <span>Đồng tài trợ Mã Shopee</span>
                    <Badge className="bg-orange-500 text-white text-xs">
                      20%
                    </Badge>
                  </div>

                  <FormField
                    control={form.control}
                    name="shopeeVoucherAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Giá trị mã giảm giá Shopee (₫)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="20,000"
                              value={formatNumber(field.value || 0)}
                              onChange={(e) => handleNumberChange(field, e)}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              ₫
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs text-orange-600">
                          Bạn sẽ đóng góp 20% giá trị mã ={" "}
                          {formatNumber((field.value || 0) * 0.2)}₫
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* ================================ */}
            {/* SECTION 4: Chi phí vận hành */}
            {/* ================================ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Chi phí vận hành</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Phí đóng gói */}
                <FormField
                  control={form.control}
                  name="packagingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Đóng gói</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="5,000"
                            value={formatNumber(field.value || 0)}
                            onChange={(e) => handleNumberChange(field, e)}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ₫
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phí vận chuyển */}
                <FormField
                  control={form.control}
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Vận chuyển</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="15,000"
                            value={formatNumber(field.value || 0)}
                            onChange={(e) => handleNumberChange(field, e)}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ₫
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Chi phí quảng cáo */}
                <FormField
                  control={form.control}
                  name="adsCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Megaphone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">Ads</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="10,000"
                            value={formatNumber(field.value || 0)}
                            onChange={(e) => handleNumberChange(field, e)}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ₫
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export const CalculatorInputForm = memo(CalculatorInputFormComponent);
