import React from 'react';

const PaginationLink = ({ page, setPage, isSelected }) => (
  <li>
    <a
      className={`pagination-link ${isSelected ? 'is-current' : null}`}
      onClick={() => setPage(page)}
    >
      {page + 1}
    </a>
  </li>
);

const Pagination = ({ page, setPage, totalPages, className }) => {
  const isLeftButtonShown = page >= 2;
  const isRightButtonShown = page < totalPages - 2;
  const numbersShown = [...Array(3).keys()]
    .map(x => x - 1)
    .map(x => x + page)
    .filter(x => x >= 0 && x < totalPages);

  return (
    <nav className={`pagination ${className}`} role="navigation" aria-label="pagination">
      <ul className="pagination-list">
        {isLeftButtonShown ? (
          <>
            <PaginationLink page={0} setPage={setPage} isSelected={page === 0} />
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
          </>
        ) : null}
        {numbersShown.map(num => (
          <PaginationLink key={num} page={num} setPage={setPage} isSelected={num === page} />
        ))}
        {isRightButtonShown ? (
          <>
            <li>
              <span className="pagination-ellipsis">&hellip;</span>
            </li>
            <PaginationLink
              page={totalPages - 1}
              setPage={setPage}
              isSelected={page === totalPages - 1}
            />
          </>
        ) : null}
      </ul>
    </nav>
  );
};

export default Pagination;
