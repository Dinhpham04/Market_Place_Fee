// ============================================
// THEME TOGGLE - Component đổi theme
// Hỗ trợ Light, Dark và System mode
// ============================================
"use client";

import { memo } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

import type { Theme } from "@/types";

interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ElementType;
}

// ============================================
// CONSTANTS
// ============================================

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "light",
    label: "Sáng",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Tối",
    icon: Moon,
  },
  {
    value: "system",
    label: "Hệ thống",
    icon: Monitor,
  },
];

// ============================================
// COMPONENT
// ============================================

/**
 * ThemeToggle - Component chuyển đổi theme
 * 
 * Features:
 * - Dropdown menu với 3 options: Light, Dark, System
 * - Icon hiển thị theme hiện tại
 * - Animation khi hover và chuyển đổi
 * - Accessible với keyboard navigation
 */
function ThemeToggleComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg hover:bg-muted"
          aria-label="Đổi theme"
        >
          {/* Icon animation container */}
          <div className="relative h-5 w-5 flex items-center justify-center">
            {/* Sun icon - hiển thị ở light mode */}
            <Sun
              className={cn(
                "absolute h-5 w-5 transition-all duration-300",
                theme === "light"
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              )}
            />
            {/* Moon icon - hiển thị ở dark mode */}
            <Moon
              className={cn(
                "absolute h-5 w-5 transition-all duration-300",
                theme === "dark"
                  ? "rotate-0 scale-100 opacity-100"
                  : "rotate-90 scale-0 opacity-0"
              )}
            />
            {/* Monitor icon - hiển thị ở system mode */}
            <Monitor
              className={cn(
                "absolute h-5 w-5 transition-all duration-300",
                theme === "system"
                  ? "rotate-0 scale-100 opacity-100"
                  : "rotate-90 scale-0 opacity-0"
              )}
            />
          </div>
          <span className="sr-only">Đổi theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                isActive && "bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
              {isActive && (
                <span className="ml-auto text-xs text-primary">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const ThemeToggle = memo(ThemeToggleComponent);
ThemeToggle.displayName = "ThemeToggle";
