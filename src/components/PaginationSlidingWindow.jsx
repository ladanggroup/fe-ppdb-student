import { cn } from "@/lib/utils";
// contoh tampilan: <12345678910>
export default function PaginationSlidingWindow({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 10, // default 10
}) {
  if (totalPages <= 1) return null;

  // Tentukan berapa halaman yang mau ditampilkan
  const visiblePages = Math.min(totalPages, maxPageButtons);

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {/* Tombol Prev */}
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
      {[...Array(visiblePages)].map((_, i) => {
        const page = i + 1;
        const isActive = currentPage === page;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "px-3 py-1 rounded transition-colors",
              isActive
                ? "bg-orange-500 text-white font-semibold shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            {page}
          </button>
        );
      })}

      {/* Tombol Next */}
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
