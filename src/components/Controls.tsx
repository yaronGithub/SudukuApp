import React, { useState } from 'react';
import { 
  Lightbulb, Eraser, Pencil, RotateCcw, Play, Pause, 
  Save, RefreshCw, Check 
} from 'lucide-react';
import { useGame } from '../context/GameContext';

const Controls: React.FC = () => {
  const { 
    inputNumber, 
    eraseCell, 
    isNotesMode, 
    toggleNotesMode, 
    resetBoard, 
    getHint, 
    isPaused, 
    togglePause,
    gameStatus,
    checkBoard,
    saveGame,
    loadGame
  } = useGame();
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    saveGame();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
        {/* Game control buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={toggleNotesMode}
            className={`flex items-center justify-center p-2.5 rounded-md transition-colors ${
              isNotesMode
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
            aria-label="Toggle notes mode"
          >
            <Pencil size={20} />
          </button>
          
          <button
            onClick={eraseCell}
            className="flex items-center justify-center p-2.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Erase cell"
          >
            <Eraser size={20} />
          </button>
          
          <button
            onClick={getHint}
            className="flex items-center justify-center p-2.5 rounded-md bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 transition-colors"
            aria-label="Get hint"
            disabled={gameStatus !== 'playing'}
          >
            <Lightbulb size={20} />
          </button>
          
          <button
            onClick={checkBoard}
            className="flex items-center justify-center p-2.5 rounded-md bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
            aria-label="Check board"
            disabled={gameStatus !== 'playing'}
          >
            <Check size={20} />
          </button>
          
          <button
            onClick={togglePause}
            className="flex items-center justify-center p-2.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
            aria-label={isPaused ? "Resume game" : "Pause game"}
            disabled={gameStatus !== 'playing'}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          
          <button
            onClick={handleSave}
            className={`flex items-center justify-center p-2.5 rounded-md ${
              isSaved
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            } transition-colors`}
            aria-label="Save game"
          >
            <Save size={20} />
          </button>
          
          <button
            onClick={loadGame}
            className="flex items-center justify-center p-2.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Load game"
          >
            <RefreshCw size={20} />
          </button>
          
          <button
            onClick={resetBoard}
            className="flex items-center justify-center p-2.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
            aria-label="Reset board"
          >
            <RotateCcw size={20} />
          </button>
        </div>
        
        {/* Number input buttons */}
        <div className="grid grid-cols-9 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => inputNumber(num)}
              className="aspect-square flex items-center justify-center text-lg font-medium rounded-md bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
              disabled={gameStatus !== 'playing'}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Controls;