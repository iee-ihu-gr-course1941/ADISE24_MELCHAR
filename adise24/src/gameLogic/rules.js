export const lightBoxesForNextMove = (block, rounds) => {
    let  boxes = [];
    if (rounds <= 2) {
        boxes = [
            { row: 1, col: 1 }
        ]
        return boxes; 
    }
    return [];
};

