// Function to generate a Sudoku puzzle
export function generateSudoku(difficulty: string): { board: number[][], solution: number[][] } {
  // Create a solved Sudoku board
  const solution = createSolvedBoard();
  
  // Create a copy to remove numbers from
  const board = solution.map(row => [...row]);
  
  // Determine how many cells to remove based on difficulty
  let cellsToRemove;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 35; // ~46 cells filled
      break;
    case 'medium':
      cellsToRemove = 45; // ~36 cells filled
      break;
    case 'hard':
      cellsToRemove = 52; // ~29 cells filled
      break;
    case 'expert':
      cellsToRemove = 58; // ~23 cells filled
      break;
    default:
      cellsToRemove = 45; // Default to medium
  }
  
  // Remove random cells
  removeRandomCells(board, cellsToRemove);
  
  return { board, solution };
}

// Create a solved Sudoku board
function createSolvedBoard(): number[][] {
  // Start with an empty board
  const board = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Try to solve it
  solveSudoku(board);
  
  return board;
}

// Remove random cells while ensuring the puzzle still has a unique solution
function removeRandomCells(board: number[][], count: number): void {
  // Get all cell positions
  const positions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col });
    }
  }
  
  // Shuffle positions
  shuffleArray(positions);
  
  // Remove cells
  let removed = 0;
  for (const pos of positions) {
    const { row, col } = pos;
    const value = board[row][col];
    
    // Temporarily remove the cell
    board[row][col] = 0;
    
    removed++;
    if (removed >= count) break;
  }
}

// Solve a Sudoku board using backtracking
export function solveSudoku(board: number[][]): boolean {
  // Find an empty cell
  let emptyCell = findEmptyCell(board);
  
  // If no empty cell is found, the board is solved
  if (!emptyCell) {
    return true;
  }
  
  const { row, col } = emptyCell;
  
  // Try digits 1-9
  for (let num = 1; num <= 9; num++) {
    // Check if number can be placed
    if (isValidMove(board, row, col, num)) {
      // Place the number
      board[row][col] = num;
      
      // Recursively solve the rest of the board
      if (solveSudoku(board)) {
        return true;
      }
      
      // If placing this number doesn't lead to a solution, backtrack
      board[row][col] = 0;
    }
  }
  
  // No solution found with current configuration
  return false;
}

// Find an empty cell in the board
function findEmptyCell(board: number[][]): { row: number, col: number } | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return { row, col };
      }
    }
  }
  return null;
}

// Check if a move is valid
export function isValidMove(board: number[][], row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) {
      return false;
    }
  }
  
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) {
      return false;
    }
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[boxRow + r][boxCol + c] === num) {
        return false;
      }
    }
  }
  
  return true;
}

// Shuffle an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}