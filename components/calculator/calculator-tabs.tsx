// ============================================
// CALCULATOR TABS - Navigation Component
// Tabs điều hướng giữa các chức năng calculator
// ============================================

"use client";

import { memo } from "react";
import { Calculator, GitCompare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCalculatorStore, type CalculatorTab } from "@/stores";

// ============================================
// TYPES
// ============================================

interface TabConfig {
  value: CalculatorTab;
  label: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  disabled?: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const TABS_CONFIG: TabConfig[] = [
  {
    value: "calculator",
    label: "Tính giá bán - Lợi nhuận",
    icon: Calculator,
    description: "Tính toán giá bán và lợi nhuận cho từng sàn TMĐT",
  },
  {
    value: "compare",
    label: "So sánh các sàn",
    icon: GitCompare,
    description: "So sánh chi phí và lợi nhuận giữa các sàn TMĐT",
    badge: "Sắp có",
    disabled: true,
  },
];

// ============================================
// COMPONENT
// ============================================

/**
 * CalculatorTabs - Component điều hướng tabs
 * 
 * Features:
 * - Icon cho mỗi tab
 * - Badge "Sắp có" cho tính năng chưa hoàn thành
 * - Responsive design
 * - Keyboard navigation
 */
function CalculatorTabsComponent() {
  // Store hooks
  const activeTab = useCalculatorStore((state) => state.activeTab);
  const setActiveTab = useCalculatorStore((state) => state.setActiveTab);

  return (
    <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as CalculatorTab)}
          className="w-full"
        >
          <TabsList className="h-14 w-full justify-start gap-1 rounded-none border-none bg-transparent p-0">
            {TABS_CONFIG.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                className={cn(
                  // Base styles
                  "relative h-14 gap-2 rounded-none border-b-2 border-transparent px-4",
                  "data-[state=active]:border-b-primary data-[state=active]:bg-transparent",
                  "data-[state=active]:text-primary data-[state=active]:shadow-none",
                  // Hover effect
                  "hover:bg-muted/50 transition-colors",
                  // Disabled state
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {/* Icon */}
                <tab.icon className="h-4 w-4" aria-hidden="true" />
                
                {/* Label */}
                <span className="font-medium">{tab.label}</span>
                
                {/* Badge (nếu có) */}
                {tab.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 text-[10px] px-1.5 py-0"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

// Memoize để tránh re-render không cần thiết
export const CalculatorTabs = memo(CalculatorTabsComponent);
CalculatorTabs.displayName = "CalculatorTabs";
