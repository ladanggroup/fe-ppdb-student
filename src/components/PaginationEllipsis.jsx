import { cn } from "@/lib/utils";
// Contoh hasil:
// totalPages = 5, currentPage = 2 → < 1 2 3 4 5 >
// totalPages = 15, currentPage = 1 → < 1 2 3 ... 15 >
export default function PaginationEllipsis({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 7, // default jumlah tombol
}) {
  if (totalPages <= 1) return null;

  // Helper untuk generate range halaman
  const getPageNumbers = () => {
    const pages = [];

    // Kalau total page lebih kecil dari max → tampil semua
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);

      if (left > 2) pages.push("...");

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      if (right < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "px-3 py-1 rounded transition-colors",
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        )}
      >
        &lt;
      </button>

      {/* Nomor Halaman */}
      {pageNumbers.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-3 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "px-3 py-1 rounded transition-colors",
              currentPage === page
                ? "bg-orange-500 text-white font-semibold shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "px-3 py-1 rounded transition-colors",
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        )}
      >
        &gt;
      </button>
    </div>
  );
}
