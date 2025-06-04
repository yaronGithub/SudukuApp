import React, { useEffect, useState } from 'react';
import Cell from './Cell';
import Timer from './Timer';
import { useGame } from '../context/GameContext';

const GameBoard: React.FC = () => {
  const { board, selectedCell, selectCell, difficulty, mistakes, gameStatus } = useGame();
  const [animateBoard, setAnimateBoard] = useState(false);

  // Animate board on initial render
  useEffect(() => {
    setAnimateBoard(true);
    const timer = setTimeout(() => setAnimateBoard(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-sm">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty:</span>
          <span className="ml-2 font-semibold capitalize text-gray-800 dark:text-white">{difficulty}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-sm">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Mistakes:</span>
            <span className={`ml-2 font-semibold ${mistakes > 0 ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
              {mistakes}/3
            </span>
          </div>
          
          <Timer />
        </div>
      </div>
      
      <div 
        className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 ${
          animateBoard ? 'animate-fade-in' : ''
        }`}
      >
        <div className="grid grid-cols-9 gap-0">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell.value}
                isFixed={cell.isFixed}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                isRelated={
                  selectedCell && 
                  (selectedCell.row === rowIndex || 
                   selectedCell.col === colIndex || 
                   (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) && 
                    Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)))
                }
                isHighlighted={selectedCell && cell.value !== 0 && cell.value === board[selectedCell.row][selectedCell.col].value}
                hasError={cell.hasError}
                notes={cell.notes}
                onClick={() => selectCell(rowIndex, colIndex)}
                row={rowIndex}
                col={colIndex}
              />
            ))
          )}
        </div>
      </div>
      
      {gameStatus === 'won' && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-center">
          <h3 className="text-xl font-bold text-green-600 dark:text-green-400">Congratulations!</h3>
          <p className="text-green-700 dark:text-green-300">You've successfully completed the puzzle!</p>
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-center">
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Game Over</h3>
          <p className="text-red-700 dark:text-red-300">You've made too many mistakes. Try again!</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;