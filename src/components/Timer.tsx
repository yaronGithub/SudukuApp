import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Timer: React.FC = () => {
  const { elapsedTime, isPaused, gameStatus } = useGame();
  const [displayTime, setDisplayTime] = useState('00:00');

  useEffect(() => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    
    setDisplayTime(`${formattedMinutes}:${formattedSeconds}`);
  }, [elapsedTime]);

  return (
    <div className={`
      bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow-sm
      flex items-center
      ${isPaused ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}
      transition-colors duration-300
    `}>
      <Clock size={16} className="mr-2" />
      <span className="font-mono text-sm sm:text-base font-medium">{displayTime}</span>
    </div>
  );
};

export default Timer;