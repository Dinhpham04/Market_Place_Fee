// ============================================
// HOME PAGE - Trang chính Calculator
// Layout 2 cột: Form bên trái, Kết quả bên phải
// ============================================

"use client";

import { Suspense } from "react";
import {
  CalculatorTabs,
  CalculatorInputForm,
  CalculatorResult,
} from "@/components/calculator";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme";

// ============================================
// LOADING SKELETON
// ============================================

function FormSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 animate-pulse">
      <div className="h-6 w-48 bg-muted rounded mb-4" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 animate-pulse">
      <div className="h-6 w-40 bg-muted rounded mb-6" />
      <div className="h-32 bg-muted rounded mb-4" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-muted rounded" />
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* ================================ */}
      {/* HEADER - Tabs Navigation */}
      {/* ================================ */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                💰
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">
                  Tính Lãi Shopee
                </h1>
                <p className="text-xs text-muted-foreground">
                  Công cụ tính phí sàn TMĐT chính xác nhất
                </p>
              </div>
            </div>

            {/* Version badge & Theme Toggle */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 text-xs font-medium">
                Shopee 2025
              </span>
              <ThemeToggle />
            </div>
          </div>

          {/* Tabs */}
          <CalculatorTabs />
        </div>
      </header>

      {/* ================================ */}
      {/* MAIN CONTENT - 2 Column Layout */}
      {/* ================================ */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN - Input Form */}
          <div className="order-2 lg:order-1">
            <Suspense fallback={<FormSkeleton />}>
              <CalculatorInputForm />
            </Suspense>
          </div>

          {/* RIGHT COLUMN - Result */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-[140px] lg:self-start">
            <Suspense fallback={<ResultSkeleton />}>
              <CalculatorResult />
            </Suspense>
          </div>
        </div>

        {/* ================================ */}
        {/* FOOTER INFO */}
        {/* ================================ */}
        <Separator className="my-8" />

        <footer className="text-center text-sm text-muted-foreground pb-8">
          <p className="mb-2">
            📊 Dữ liệu phí cập nhật theo chính sách Shopee từ{" "}
            <span className="font-medium text-foreground">01/10/2025</span>
          </p>
          <p className="text-xs">
            Nguồn tham khảo:{" "}
            <a
              href="https://www.shopeeanalytics.com/vn/seller/expected-price"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              ShopeeAnalytics.com
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}