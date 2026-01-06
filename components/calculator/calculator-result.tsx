// ============================================
// CALCULATOR RESULT - Kết quả tính toán realtime
// Hiển thị lợi nhuận, breakdown phí chi tiết
// ============================================

"use client";

import { memo, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Receipt,
  Percent,
  CreditCard,
  Truck,
  Tag,
  Building2,
  Video,
  Ticket,
  BadgePercent,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatCurrency } from "@/lib/utils";
import { useCalculatorStore } from "@/stores";

// ============================================
// TYPES
// ============================================

interface FeeItemProps {
  label: string;
  value: number;
  percentage?: number;
  icon: React.ElementType;
  tooltip?: string;
  highlight?: boolean;
}

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * FeeItem - Hiển thị một dòng phí
 */
const FeeItem = memo(function FeeItem({
  label,
  value,
  percentage,
  icon: Icon,
  tooltip,
  highlight = false,
}: FeeItemProps) {
  // Không hiển thị nếu value = 0
  if (value === 0) return null;

  const content = (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-3 rounded-lg transition-colors",
        highlight && "bg-muted/50",
        "hover:bg-muted/30"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
        {percentage !== undefined && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {percentage}%
          </Badge>
        )}
      </div>
      <span className="text-sm font-medium text-destructive">
        -{formatCurrency(value)}
      </span>
    </div>
  );

  // Wrap với Tooltip nếu có
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
});

/**
 * ProfitIndicator - Hiển thị lợi nhuận với visual indicator
 */
const ProfitIndicator = memo(function ProfitIndicator({
  netProfit,
  profitMargin,
}: {
  netProfit: number;
  profitMargin: number;
}) {
  const isLoss = netProfit < 0;
  const marginPercent = Math.abs(profitMargin * 100);
  const Icon = isLoss ? TrendingDown : TrendingUp;

  return (
    <div
      className={cn(
        "rounded-xl p-6 text-center transition-all duration-300",
        isLoss
          ? "bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20"
          : "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20"
      )}
    >
      {/* Icon và label */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <Icon
          className={cn(
            "h-5 w-5",
            isLoss ? "text-destructive" : "text-emerald-600"
          )}
        />
        <span className="text-sm font-medium text-muted-foreground">
          {isLoss ? "Lỗ ròng" : "Lợi nhuận ròng"}
        </span>
      </div>

      {/* Số tiền lợi nhuận */}
      <div
        className={cn(
          "text-4xl font-bold tracking-tight mb-2",
          isLoss ? "text-destructive" : "text-emerald-600"
        )}
      >
        {isLoss ? "-" : "+"}
        {formatCurrency(Math.abs(netProfit))}
      </div>

      {/* Tỷ suất lợi nhuận */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">Tỷ suất:</span>
        <Badge
          variant={isLoss ? "destructive" : "default"}
          className={cn(
            "font-semibold",
            !isLoss && "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          {isLoss ? "-" : ""}
          {marginPercent.toFixed(2)}%
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <Progress
          value={Math.min(marginPercent, 100)}
          className={cn(
            "h-2",
            isLoss && "[&>div]:bg-destructive"
          )}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Warning nếu margin thấp */}
      {!isLoss && marginPercent < 10 && (
        <div className="flex items-center justify-center gap-1.5 mt-3 text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs">Tỷ suất thấp, cân nhắc tăng giá</span>
        </div>
      )}
    </div>
  );
});

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * CalculatorResult - Panel hiển thị kết quả tính toán
 *
 * Features:
 * - Realtime update khi input thay đổi
 * - Visual indicator cho lãi/lỗ
 * - Breakdown chi tiết các loại phí
 * - Responsive design
 * - Accessibility compliant
 */
function CalculatorResultComponent() {
  // Store hooks
  const result = useCalculatorStore((state) => state.result);
  const formInput = useCalculatorStore((state) => state.formInput);

  // Memoize fee breakdown items
  const feeItems = useMemo(() => {
    if (!result) return [];

    const { feeBreakdown } = result;
    const items: FeeItemProps[] = [
      {
        label: "Phí thanh toán",
        value: feeBreakdown.feePayment,
        percentage: 5,
        icon: CreditCard,
        tooltip: "Phí Shopee thu cho mỗi giao dịch thành công",
      },
      {
        label: "Phí cố định",
        value: feeBreakdown.feeCommission,
        icon: Percent,
        tooltip: "Phí hoa hồng theo ngành hàng (7-12%)",
        highlight: true,
      },
      {
        label: "Phí hạ tầng",
        value: feeBreakdown.feeInfrastructure,
        icon: Building2,
        tooltip: "Phí hạ tầng 3,000đ/đơn (từ 01/07/2025)",
      },
      {
        label: "PiShip",
        value: feeBreakdown.feePiShip,
        icon: Truck,
        tooltip: "Phí gói PiShip 1,650đ/đơn",
      },
      {
        label: "Voucher Xtra",
        value: feeBreakdown.feeVoucherXtra,
        percentage: 2,
        icon: Tag,
        tooltip: "Phí gói Voucher Xtra (2%, tối đa 50k)",
      },
      {
        label: "Content Xtra",
        value: feeBreakdown.feeContentXtra,
        percentage: 3,
        icon: Video,
        tooltip: "Phí đơn từ Livestream/Video (3%)",
      },
      {
        label: "Đồng tài trợ mã",
        value: feeBreakdown.feeShopeeCoFunding,
        percentage: 20,
        icon: Ticket,
        tooltip: "Shop chịu 20% giá trị mã Shopee",
      },
    ];

    return items.filter((item) => item.value > 0);
  }, [result]);

  // Empty state - Chưa có dữ liệu
  if (!result) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Kết quả tính toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-2">
              Nhập thông tin để xem kết quả
            </h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Điền giá bán và giá vốn bên trái để xem lợi nhuận dự kiến
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Kết quả tính toán
            </CardTitle>
            {formInput.platform === "shopee" ? (
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                Shopee
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-black text-white">
                TikTok
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profit Indicator */}
          <ProfitIndicator
            netProfit={result.netProfit}
            profitMargin={result.profitMargin}
          />

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <span className="text-xs text-muted-foreground">Doanh thu</span>
              <div className="text-lg font-semibold text-foreground">
                {formatCurrency(result.revenue)}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <span className="text-xs text-muted-foreground">Lãi/sản phẩm</span>
              <div className={cn(
                "text-lg font-semibold",
                result.profitPerUnit < 0 ? "text-destructive" : "text-emerald-600"
              )}>
                {formatCurrency(result.profitPerUnit)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Fee Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">Chi tiết phí sàn</h4>
              <span className="text-sm font-semibold text-destructive">
                -{formatCurrency(result.totalPlatformFee)}
              </span>
            </div>

            <div className="space-y-1">
              {feeItems.map((item) => (
                <FeeItem key={item.label} {...item} />
              ))}
            </div>
          </div>

          {/* Tax */}
          {result.taxAmount > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Thuế TNCN (1.5%)
                  </span>
                </div>
                <span className="text-sm font-medium text-destructive">
                  -{formatCurrency(result.taxAmount)}
                </span>
              </div>
            </>
          )}

          {/* Operating Cost */}
          {result.totalOperatingCost > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Chi phí vận hành
                  </span>
                </div>
                <span className="text-sm font-medium text-destructive">
                  -{formatCurrency(result.totalOperatingCost)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// Memoize component
export const CalculatorResult = memo(CalculatorResultComponent);
CalculatorResult.displayName = "CalculatorResult";
