import React from 'react';
import { Menu, HelpCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';

interface HeaderProps {
  setShowRules: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setShowRules }) => {
  const { theme, toggleTheme } = useTheme();
  const { difficulty, startNewGame } = useGame();
  
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Sudoku
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowRules(true)}
            className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            aria-label="Show rules"
          >
            <HelpCircle size={20} />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 font-semibold border-b border-gray-200 dark:border-gray-700">
                  New Game
                </div>
                {['Easy', 'Medium', 'Hard', 'Expert'].map((level) => (
                  <button
                    key={level}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      difficulty === level.toLowerCase() 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      startNewGame(level.toLowerCase());
                      setShowMenu(false);
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;