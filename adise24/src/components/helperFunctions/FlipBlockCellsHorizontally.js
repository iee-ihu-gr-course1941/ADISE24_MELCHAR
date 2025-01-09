export function flipBlockCellsHorizontally(cells) {
    if (!cells || cells.length === 0) return [];
  
    let minRow = Infinity, maxRow = -Infinity;
    let minCol = Infinity, maxCol = -Infinity;
  
    for (const { row, col } of cells) {
      if (row < minRow) minRow = row;
      if (row > maxRow) maxRow = row;
      if (col < minCol) minCol = col;
      if (col > maxCol) maxCol = col;
    }
  
    const pivotCol = (minCol + maxCol) / 2;
  
    return cells.map(({ row, col }) => {
      const newCol = 2 * pivotCol - col;
      return {
        row,
        col: Math.round(newCol),
      };
    });
  }