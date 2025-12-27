"use client";

// Global Error Boundary - Bắt lỗi ở root layout
// Phải có html và body vì thay thế toàn bộ root layout

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="vi">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 dark:bg-black">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-500">500</h1>
            <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Lỗi hệ thống
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Đã xảy ra lỗi nghiêm trọng. Vui lòng thử lại sau.
            </p>
            {error.digest && (
              <p className="mt-2 text-sm text-gray-400">
                Mã lỗi: {error.digest}
              </p>
            )}
          </div>

          <button
            onClick={reset}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
