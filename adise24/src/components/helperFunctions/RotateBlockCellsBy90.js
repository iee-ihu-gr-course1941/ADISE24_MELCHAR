export function rotateBlockCellsBy90(cells) {
    if (!cells || cells.length === 0) return [];
  
    let minRow = Infinity, maxRow = -Infinity;
    let minCol = Infinity, maxCol = -Infinity;
  
    cells.forEach(({ row, col }) => {
      if (row < minRow) minRow = row;
      if (row > maxRow) maxRow = row;
      if (col < minCol) minCol = col;
      if (col > maxCol) maxCol = col;
    });
  
    const pivotRow = (minRow + maxRow) / 2;
    const pivotCol = (minCol + maxCol) / 2;
  
    return cells.map(({ row, col }) => {
      const shiftedR = row - pivotRow;
      const shiftedC = col - pivotCol;
  
      const rotatedR = shiftedC;
      const rotatedC = -shiftedR;
  
      const newR = Math.round(pivotRow + rotatedR);
      const newC = Math.round(pivotCol + rotatedC);
  
      return { row: newR, col: newC };
    });
  }