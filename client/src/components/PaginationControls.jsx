import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * PaginationControls Component
 * Handles pagination navigation
 */
function PaginationControls({ page, pages, onPageChange }) {
  const getPaginationRange = () => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPaginationRange();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {/* First Page Button (if not visible) */}
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-2 border rounded-lg transition ${
              pageNum === page
                ? "bg-primary text-white border-primary"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Last Page Button (if not visible) */}
        {pageNumbers[pageNumbers.length - 1] < pages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < pages - 1 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(pages)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {pages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={18} />
      </button>

      {/* Page Info */}
      <span className="ml-4 text-sm text-gray-600">
        Page {page} of {pages}
      </span>
    </div>
  );
}

export default PaginationControls;
