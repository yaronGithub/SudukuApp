import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [showRules, setShowRules] = useState(false);

  return (
    <ThemeProvider>
      <GameProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
          <Header setShowRules={setShowRules} />
          <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center">
            <GameBoard />
            <Controls />
          </main>
          <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 Sudoku App. All rights reserved.</p>
          </footer>
          
          {showRules && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">How to Play Sudoku</h2>
                <div className="text-gray-600 dark:text-gray-300 space-y-3">
                  <p>The goal is to fill the 9×9 grid with digits 1-9 so that each:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Column contains all digits from 1-9 without repetition</li>
                    <li>Row contains all digits from 1-9 without repetition</li>
                    <li>3×3 box contains all digits from 1-9 without repetition</li>
                  </ul>
                  <p className="mt-2">The puzzle starts with some cells already filled. Use logic to determine the correct values for the empty cells.</p>
                </div>
                <button 
                  onClick={() => setShowRules(false)}
                  className="mt-6 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
                >
                  Got it
                </button>
              </div>
            </div>
          )}
        </div>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;