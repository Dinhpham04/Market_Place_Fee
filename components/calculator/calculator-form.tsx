
// ============================================
// CALCULATOR FORM - Cập nhật theo Shopee 2025
// ============================================
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
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
import {
    calculatorFormSchemaWithRefinements,
    type CalculatorFormValues,
    type CalculatorFormInput,
} from "@/lib/validations/calculator-schema";
import { cn, formatNumber, parseNumber } from "@/lib/utils";
import { DEFAULTS, SHOPEE_CATEGORY_LABELS } from "@/constants";
import type { Platform, ShopeeCategory } from "@/types";



interface CalculatorFormProps {
    /** Callback khi form submit thành công */
    onSubmit: (values: CalculatorFormValues) => void;
    /** Callback khi giá trị thay đổi (real-time) */
    onValuesChange?: (values: CalculatorFormInput) => void;
    /** Loading state */
    isLoading?: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const PLATFORM_OPTIONS = [
    { value: "shopee" as const, label: "Shopee", description: "Phí 16-21%" },
    { value: "tiktok" as const, label: "TikTok Shop", description: "Phí 6-11%" },
];

const SHOP_TYPE_OPTIONS = [
    { value: "normal" as const, label: "Shop thường" },
    { value: "mall" as const, label: "Shopee Mall" },
];

const ORDER_SOURCE_OPTIONS = [
    { value: "normal" as const, label: "Đơn thường" },
    { value: "live_video" as const, label: "Từ Livestream/Video" },
];

// Shopee category options từ SHOPEE_CATEGORY_LABELS
const SHOPEE_CATEGORY_OPTIONS = Object.entries(SHOPEE_CATEGORY_LABELS).map(
    ([value, label]) => ({ value: value as ShopeeCategory, label })
);



// ============================================
// DEFAULT VALUES
// ============================================


const defaultValues: CalculatorFormValues = {
    platform: "shopee",
    sellingPrice: 0,
    costPrice: 0,
    shopType: "normal",
    category: "default",
    orderSource: "normal",
    voucherShop: 0,
    packagingCost: DEFAULTS.packagingCost,
    shippingCost: 0,
    adsCost: 0,
    quantity: DEFAULTS.quantity,
    includeTax: DEFAULTS.includeTax,
    includePiShip: DEFAULTS.includePiShip,
    includeVoucherXtra: DEFAULTS.includeVoucherXtra,
    includeContentXtra: DEFAULTS.includeContentXtra,
    shopeeVoucherAmount: 0,
}



// ============================================
// COMPONENT
// ============================================

export function CalculatorForm({ onSubmit, onValuesChange, isLoading }: CalculatorFormProps) {
    // 1. Khởi tạo form với react-hook-form + zod
    const form = useForm<CalculatorFormInput, unknown, CalculatorFormValues>({
        resolver: zodResolver(calculatorFormSchemaWithRefinements),
        defaultValues,
        mode: "onChange",
    });
    
    // 2. Watch platform và orderSource
    const platform = form.watch("platform");
    const orderSource = form.watch("orderSource");
    const includeVoucherXtra = form.watch("includeVoucherXtra");
    
    // 3. Watch all values để gọi callback real-time
    const watchedValues = form.watch();

    useEffect(() => {
        if (onValuesChange && form.formState.isValid) {
            onValuesChange(watchedValues);
        }
    }, [watchedValues, onValuesChange, form.formState.isValid])

    // 4. Reset platform-specific fields khi đổi platform
    useEffect(() => {
        if (platform === 'tiktok') {
            form.setValue("includeVoucherXtra", false);
            form.setValue("includeContentXtra", false);
            form.setValue("includePiShip", false);
            form.setValue("shopeeVoucherAmount", 0);
        }
    }, [platform, form])
    
    // 5. Handle number input
    const handleNumberChange = useCallback(
        (field: { onChange: (value: number) => void }, e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseNumber(e.target.value);
            field.onChange(value);
        },
        []
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Platform Selector */}
                        <FormField
                            control={form.control}
                            name="platform"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sàn TMĐT</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value as Platform)}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn sàn" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PLATFORM_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <span className="font-medium">{option.label}</span>
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        ({option.description})
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        {/* Shop Type - Chỉ hiện với Shopee */}
                        {platform === "shopee" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="shopType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loại shop</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn loại shop" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {SHOP_TYPE_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* Ngành hàng - Shopee 2025 */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ngành hàng <span className="text-xs text-muted-foreground">(xác định phí cố định)</span></FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn ngành hàng" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {SHOPEE_CATEGORY_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                {/* Nguồn đơn hàng - cho Content Xtra */}
                                <FormField
                                    control={form.control}
                                    name="orderSource"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nguồn đơn hàng</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn nguồn đơn" />
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
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* Giá bán */}
                        <FormField
                            control={form.control}
                            name="sellingPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giá bán <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="numeric"
                                                placeholder="150.000"
                                                value={field.value > 0 ? formatNumber(field.value) : ""}
                                                onChange={(e) => handleNumberChange(field, e)}
                                                disabled={isLoading}
                                                className={cn(
                                                    "pr-10"
                                                )}
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
                                    <FormLabel>
                                        Giá vốn <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="80.000"
                                                value={field.value > 0 ? formatNumber(field.value) : ""}
                                                onChange={(e) => handleNumberChange(field, e)}
                                                disabled={isLoading}
                                                className={cn(
                                                    "pr-10"
                                                )}
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₫ </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Checkboxes - Fees */}
                        <div className="space-y-3">
                            <FormLabel>Phí & Dịch vụ</FormLabel>
                            
                            {/* PiShip - Shopee only */}
                            {platform === "shopee" && (
                                <FormField
                                    control={form.control}
                                    name="includePiShip"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal cursor-pointer">
                                                PiShip (1,650đ/đơn)
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Voucher Xtra - Shopee only */}
                            {platform === "shopee" && (
                                <FormField
                                    control={form.control}
                                    name="includeVoucherXtra"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal cursor-pointer">
                                                Voucher Xtra (2%, tối đa 50k)
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Content Xtra - Shopee only, chỉ khi đơn từ Live/Video */}
                            {platform === "shopee" && orderSource === "live_video" && (
                                <FormField
                                    control={form.control}
                                    name="includeContentXtra"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal cursor-pointer">
                                                Content Xtra (3%/sp)
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Thuế */}
                            <FormField
                                control={form.control}
                                name="includeTax"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                            Thuế TNCN (1.5%)
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Mã Shopee - Chỉ hiện khi KHÔNG dùng Voucher Xtra */}
                        {platform === "shopee" && !includeVoucherXtra && (
                            <FormField
                                control={form.control}
                                name="shopeeVoucherAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Giá trị mã Shopee khách dùng
                                            <span className="text-xs text-muted-foreground ml-1">(Shop chịu 20%)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="0"
                                                    value={field.value && field.value > 0 ? formatNumber(field.value) : ""}
                                                    onChange={(e) => handleNumberChange(field, e)}
                                                    disabled={isLoading}
                                                    className="pr-10"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₫</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang tính..." : "Tính lợi nhuận"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

