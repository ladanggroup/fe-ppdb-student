import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ pagination, onPageChange }) {
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
        className="flex items-center px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-300 bg-teal-200"
      >
        <ChevronLeft size={16} />
        <span className="ml-1">Sebelumnya</span>
      </button>

      {/* Info halaman */}
      <span className="text-sm text-gray-600">
        Halaman {current_page} dari {last_page}
      </span>

      {/* Tombol Next */}
      <button
        onClick={() => goToPage(current_page + 1)}
        disabled={current_page === last_page}
        className="flex items-center px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-teal-200 hover:bg-teal-300"
      >
        <span className="mr-1">Selanjutnya</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
