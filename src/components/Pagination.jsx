import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from '@/lib/utils';

export default function Pagination({ pagination, onPageChange, className }) {
  if (!pagination) return null;

  const { current_page, last_page } = pagination;

  const goToPage = (page) => {
    if (page >= 1 && page <= last_page) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Tombol Prev */}
      <button
        onClick={() => goToPage(current_page - 1)}
        disabled={current_page === 1}
        className={cn(
          "flex items-center px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-teal-300 hover:bg-teal-400",
          className
        )}
      >
        <ChevronLeft size={16} />
        <span className="ml-1">Sebelumnya</span>
      </button>

      {/* Info halaman */}
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Halaman {current_page} dari {last_page}
      </span>

      {/* Tombol Next */}
      <button
        onClick={() => goToPage(current_page + 1)}
        disabled={current_page === last_page}
        className={cn(
          "flex items-center px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-teal-300 hover:bg-teal-400",
          className
        )}
      >
        <span className="mr-1">Selanjutnya</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
