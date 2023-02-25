import React, { memo, useEffect } from 'react';
import Pagination from "react-pagination-library";
import "react-pagination-library/build/css/index.css";
const Pagination1 = memo(({ currentPage, totalPages, handlePageChange, handleNextPage, handlePrevPage }) => {

    return (
        <div className="pagination">
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                changeCurrentPage={handlePageChange}
                theme="bottom-border"
            />
        </div>
    );
});

export default Pagination1;
