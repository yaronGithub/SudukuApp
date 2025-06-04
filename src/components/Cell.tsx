import React from 'react';

interface CellProps {
  value: number;
  isFixed: boolean;
  isSelected: boolean;
  isRelated: boolean;
  isHighlighted: boolean;
  hasError: boolean;
  notes: number[];
  onClick: () => void;
  row: number;
  col: number;
}

const Cell: React.FC<CellProps> = ({
  value,
  isFixed,
  isSelected,
  isRelated,
  isHighlighted,
  hasError,
  notes,
  onClick,
  row,
  col
}) => {
  // Determine cell styling based on its state and position
  const getBorderStyles = () => {
    const styles = [];
    
    // Right border for every 3rd column except the last
    if (col % 3 === 2 && col < 8) {
      styles.push('border-r-2 border-r-gray-400 dark:border-r-gray-600');
    } else if (col < 8) {
      styles.push('border-r border-r-gray-300 dark:border-r-gray-700');
    }
    
    // Bottom border for every 3rd row except the last
    if (row % 3 === 2 && row < 8) {
      styles.push('border-b-2 border-b-gray-400 dark:border-b-gray-600');
    } else if (row < 8) {
      styles.push('border-b border-b-gray-300 dark:border-b-gray-700');
    }
    
    return styles.join(' ');
  };
  
  const getCellBackgroundColor = () => {
    if (isSelected) {
      return 'bg-blue-100 dark:bg-blue-900/40';
    } else if (isHighlighted) {
      return 'bg-purple-100 dark:bg-purple-900/30';
    } else if (isRelated) {
      return 'bg-gray-100 dark:bg-gray-800/80';
    }
    return '';
  };
  
  const getCellTextColor = () => {
    if (hasError) {
      return 'text-red-500 dark:text-red-400';
    } else if (isFixed) {
      return 'text-gray-800 dark:text-white font-bold';
    }
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div
      className={`
        aspect-square flex items-center justify-center 
        cursor-pointer select-none transition-all duration-150 
        ${getBorderStyles()} 
        ${getCellBackgroundColor()}
        hover:bg-blue-50 dark:hover:bg-blue-900/20
      `}
      onClick={onClick}
    >
      {value !== 0 ? (
        <span 
          className={`
            text-lg sm:text-xl font-medium 
            ${getCellTextColor()}
            ${isSelected ? 'scale-110 transition-transform' : ''}
          `}
        >
          {value}
        </span>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <div key={num} className="flex items-center justify-center">
              {notes.includes(num) && (
                <span className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                  {num}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Cell;