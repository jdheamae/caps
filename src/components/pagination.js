import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const maxVisiblePages = 5; // Maximum number of page buttons to display
  const halfVisible = Math.floor(maxVisiblePages / 2);

  // Calculate the start and end page numbers
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  // Adjust the start and end pages if there are not enough pages
  if (endPage - startPage < maxVisiblePages - 1) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  }

  return (
    <div className="ppagination2">
      {/* First Page Button */}
      <button
        className="page-nav2"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        First
      </button>

      {/* Previous Button */}
      <button
        className="page-nav2"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Numbered Page Buttons */}
      {[...Array(endPage - startPage + 1)].map((_, index) => (
        <button
          key={startPage + index}
          className={`page-nav2 ${currentPage === startPage + index ? 'active' : ''}`}
          onClick={() => handlePageChange(startPage + index)}
        >
          {startPage + index}
        </button>
      ))}

      {/* Next Button */}
      <button
        className="page-nav2"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      {/* Last Page Button */}
      <button
        className="page-nav2"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;