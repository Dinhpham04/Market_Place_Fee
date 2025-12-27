export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Simple spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Đang tải...
        </p>
      </div>
    </div>
  );
}
