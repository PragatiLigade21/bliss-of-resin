import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * PaginationControls Component
 * Handles pagination navigation
 */
function PaginationControls({ currentPage, totalPages, onPageChange }) {
  const getPaginationRange = () => {
    const maxVisible = 3;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPaginationRange();

  return (
    <div className="flex items-center gap-3">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-gray-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all border border-transparent hover:border-primary text-gray-500 hover:text-primary"
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="text-gray-300">...</span>}
          </>
        )}

        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
              pageNum === currentPage
                ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                : "text-gray-500 hover:text-primary border border-transparent hover:border-primary"
            }`}
          >
            {pageNum}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-gray-300">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all border border-transparent hover:border-primary text-gray-500 hover:text-primary"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full text-gray-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default PaginationControls;
