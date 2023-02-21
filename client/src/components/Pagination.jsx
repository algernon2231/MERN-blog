import React, { memo } from 'react';
const Pagination = memo(({ currentPage, totalPages, handlePageChange, handleNextPage, handlePrevPage }) => {
    return (
        <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    className={page === currentPage ? 'active' : ''}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
});

export default Pagination;