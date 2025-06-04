import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { generateSudoku, solveSudoku, isValidMove } from '../utils/sudokuUtils';

// Types
type CellType = {
  value: number;
  isFixed: boolean;
  hasError: boolean;
  notes: number[];
};

type BoardType = CellType[][];

type CellPosition = {
  row: number;
  col: number;
} | null;

type GameStatus = 'playing' | 'paused' | 'won' | 'lost';

type GameState = {
  board: BoardType;
  originalBoard: BoardType;
  solution: number[][];
  selectedCell: CellPosition;
  difficulty: string;
  isNotesMode: boolean;
  mistakes: number;
  elapsedTime: number;
  isPaused: boolean;
  gameStatus: GameStatus;
};

type GameAction =
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'INPUT_NUMBER'; number: number }
  | { type: 'ERASE_CELL' }
  | { type: 'TOGGLE_NOTES_MODE' }
  | { type: 'NEW_GAME'; difficulty: string }
  | { type: 'RESET_BOARD' }
  | { type: 'GET_HINT' }
  | { type: 'CHECK_BOARD' }
  | { type: 'TICK' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'LOAD_GAME'; savedState: GameState };

// Context
interface GameContextType extends GameState {
  selectCell: (row: number, col: number) => void;
  inputNumber: (num: number) => void;
  eraseCell: () => void;
  toggleNotesMode: () => void;
  startNewGame: (difficulty: string) => void;
  resetBoard: () => void;
  getHint: () => void;
  checkBoard: () => void;
  togglePause: () => void;
  saveGame: () => void;
  loadGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL':
      if (state.gameStatus !== 'playing' || state.isPaused) {
        return state;
      }
      return {
        ...state,
        selectedCell: { row: action.row, col: action.col }
      };
      
    case 'INPUT_NUMBER': {
      if (!state.selectedCell || state.gameStatus !== 'playing' || state.isPaused) {
        return state;
      }
      
      const { row, col } = state.selectedCell;
      const cell = state.board[row][col];
      
      // Can't modify fixed cells
      if (cell.isFixed) {
        return state;
      }
      
      const newBoard = [...state.board.map(r => [...r.map(c => ({...c}))])];
      
      // Notes mode handling
      if (state.isNotesMode) {
        const notes = [...cell.notes];
        const numIndex = notes.indexOf(action.number);
        
        if (numIndex !== -1) {
          notes.splice(numIndex, 1);
        } else {
          notes.push(action.number);
        }
        
        newBoard[row][col] = {
          ...cell,
          notes: notes
        };
        
        return {
          ...state,
          board: newBoard
        };
      }
      
      // Regular number input
      const isValid = state.solution[row][col] === action.number;
      let newMistakes = state.mistakes;
      let newGameStatus = state.gameStatus;
      
      // Check if move is valid
      newBoard[row][col] = {
        value: action.number,
        isFixed: false,
        hasError: !isValid,
        notes: []
      };
      
      if (!isValid) {
        newMistakes += 1;
        
        // Check if game is lost
        if (newMistakes >= 3) {
          newGameStatus = 'lost';
        }
      }
      
      // Check if game is won
      let isWon = true;
      if (newGameStatus !== 'lost') {
        outerLoop: for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (newBoard[r][c].value !== state.solution[r][c]) {
              isWon = false;
              break outerLoop;
            }
          }
        }
        
        if (isWon) {
          newGameStatus = 'won';
        }
      }
      
      return {
        ...state,
        board: newBoard,
        mistakes: newMistakes,
        gameStatus: newGameStatus
      };
    }
    
    case 'ERASE_CELL': {
      if (!state.selectedCell || state.gameStatus !== 'playing' || state.isPaused) {
        return state;
      }
      
      const { row, col } = state.selectedCell;
      const cell = state.board[row][col];
      
      // Can't erase fixed cells
      if (cell.isFixed) {
        return state;
      }
      
      const newBoard = [...state.board.map(r => [...r.map(c => ({...c}))])];
      newBoard[row][col] = {
        value: 0,
        isFixed: false,
        hasError: false,
        notes: []
      };
      
      return {
        ...state,
        board: newBoard
      };
    }
    
    case 'TOGGLE_NOTES_MODE':
      return {
        ...state,
        isNotesMode: !state.isNotesMode
      };
      
    case 'NEW_GAME': {
      const { board, solution } = generateSudoku(action.difficulty);
      
      const formattedBoard: BoardType = board.map(row => 
        row.map(value => ({
          value,
          isFixed: value !== 0,
          hasError: false,
          notes: []
        }))
      );
      
      return {
        ...state,
        board: formattedBoard,
        originalBoard: JSON.parse(JSON.stringify(formattedBoard)),
        solution,
        selectedCell: null,
        difficulty: action.difficulty,
        mistakes: 0,
        elapsedTime: 0,
        isPaused: false,
        gameStatus: 'playing'
      };
    }
    
    case 'RESET_BOARD':
      return {
        ...state,
        board: JSON.parse(JSON.stringify(state.originalBoard)),
        selectedCell: null,
        mistakes: 0,
        elapsedTime: 0,
        isPaused: false,
        gameStatus: 'playing'
      };
      
    case 'GET_HINT': {
      if (!state.selectedCell || state.gameStatus !== 'playing' || state.isPaused) {
        return state;
      }
      
      const { row, col } = state.selectedCell;
      const cell = state.board[row][col];
      
      // Can't get hint for fixed cells
      if (cell.isFixed || cell.value === state.solution[row][col]) {
        return state;
      }
      
      const newBoard = [...state.board.map(r => [...r.map(c => ({...c}))])];
      newBoard[row][col] = {
        value: state.solution[row][col],
        isFixed: true,
        hasError: false,
        notes: []
      };
      
      // Check if game is won after hint
      let isWon = true;
      outerLoop: for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (newBoard[r][c].value !== state.solution[r][c]) {
            isWon = false;
            break outerLoop;
          }
        }
      }
      
      return {
        ...state,
        board: newBoard,
        gameStatus: isWon ? 'won' : state.gameStatus
      };
    }
    
    case 'CHECK_BOARD': {
      if (state.gameStatus !== 'playing' || state.isPaused) {
        return state;
      }
      
      const newBoard = [...state.board.map(r => [...r.map(c => ({...c}))])];
      
      // Check all cells and mark errors
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const cell = newBoard[r][c];
          if (cell.value !== 0 && cell.value !== state.solution[r][c]) {
            newBoard[r][c] = {
              ...cell,
              hasError: true
            };
          }
        }
      }
      
      return {
        ...state,
        board: newBoard
      };
    }
    
    case 'TICK':
      if (state.gameStatus === 'playing' && !state.isPaused) {
        return {
          ...state,
          elapsedTime: state.elapsedTime + 1
        };
      }
      return state;
      
    case 'TOGGLE_PAUSE':
      if (state.gameStatus !== 'playing') {
        return state;
      }
      return {
        ...state,
        isPaused: !state.isPaused
      };
      
    case 'LOAD_GAME':
      return action.savedState;
      
    default:
      return state;
  }
}

// Provider
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: GameState = {
    board: Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => ({
        value: 0,
        isFixed: false,
        hasError: false,
        notes: []
      }))
    ),
    originalBoard: Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => ({
        value: 0,
        isFixed: false,
        hasError: false,
        notes: []
      }))
    ),
    solution: Array(9).fill(Array(9).fill(0)),
    selectedCell: null,
    difficulty: 'medium',
    isNotesMode: false,
    mistakes: 0,
    elapsedTime: 0,
    isPaused: false,
    gameStatus: 'playing'
  };
  
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Start a new game when component mounts
  useEffect(() => {
    dispatch({ type: 'NEW_GAME', difficulty: 'medium' });
    
    // Try to load saved game
    const savedGame = localStorage.getItem('sudoku-game');
    if (savedGame) {
      try {
        const parsedState = JSON.parse(savedGame);
        dispatch({ type: 'LOAD_GAME', savedState: parsedState });
      } catch (e) {
        console.error('Failed to load saved game', e);
      }
    }
  }, []);
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Functions to expose
  const selectCell = (row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', row, col });
  };
  
  const inputNumber = (num: number) => {
    dispatch({ type: 'INPUT_NUMBER', number: num });
  };
  
  const eraseCell = () => {
    dispatch({ type: 'ERASE_CELL' });
  };
  
  const toggleNotesMode = () => {
    dispatch({ type: 'TOGGLE_NOTES_MODE' });
  };
  
  const startNewGame = (difficulty: string) => {
    dispatch({ type: 'NEW_GAME', difficulty });
  };
  
  const resetBoard = () => {
    dispatch({ type: 'RESET_BOARD' });
  };
  
  const getHint = () => {
    dispatch({ type: 'GET_HINT' });
  };
  
  const checkBoard = () => {
    dispatch({ type: 'CHECK_BOARD' });
  };
  
  const togglePause = () => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  };
  
  const saveGame = () => {
    localStorage.setItem('sudoku-game', JSON.stringify(state));
  };
  
  const loadGame = () => {
    const savedGame = localStorage.getItem('sudoku-game');
    if (savedGame) {
      try {
        const parsedState = JSON.parse(savedGame);
        dispatch({ type: 'LOAD_GAME', savedState: parsedState });
      } catch (e) {
        console.error('Failed to load saved game', e);
      }
    }
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        selectCell,
        inputNumber,
        eraseCell,
        toggleNotesMode,
        startNewGame,
        resetBoard,
        getHint,
        checkBoard,
        togglePause,
        saveGame,
        loadGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};