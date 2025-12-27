"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console (có thể gửi lên error tracking service)
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">Oops!</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Đã có lỗi xảy ra
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Xin lỗi, đã có lỗi không mong muốn xảy ra.
        </p>
      </div>

      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Thử lại
      </button>
    </div>
  );
}
