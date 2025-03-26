import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


const generatePagination = (currentPage: number, totalPages: number): (number | string)[] => {
  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 7) {
    return [...Array.from({ length: 7 }, (_, i) => i + 1), '...', totalPages];
  }

  if (currentPage >= totalPages - 6) {
    return [1, '...', ...Array.from({ length: 7 }, (_, i) => totalPages - 6 + i)];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const paginationItems = generatePagination(currentPage, totalPages);

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {paginationItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            if (typeof item === 'number') {
              onPageChange(item);
            }
          }}
          disabled={item === '...' || item === currentPage}
          style={{
            margin: '0 5px',
            backgroundColor: item === currentPage ? '#ccc' : undefined,
          }}
        >
          {item}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
