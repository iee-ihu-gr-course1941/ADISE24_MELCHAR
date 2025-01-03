import React, { useState } from "react";
import style from '../styling/MainBoard.module.css'

const gridSize = 20;
const totalBoxes = gridSize * gridSize

function MainBoard({ highlightedBoxes, blockToMain, player, board_id}) {
    const [coloredBlocks, setColoredBlocks] = useState([]);

    const handleClick = (row, col) => {
        const minCell = blockToMain.cells.reduce((min, cell) => {
            if (
                cell.row < min.row || 
                (cell.row === min.row && cell.col < min.col)
            ) {
                return cell;
            }
            return min;
        });

        const rowOffset = row - minCell.row;
        const colOffset = col - minCell.col;

        const newColoredBlock  = blockToMain.cells.map((cell) => ({
            row: cell.row + rowOffset,
            col: cell.col + colOffset,
            color: player === 1 ? "blue" : "red",
        }));

        const blockDB = newColoredBlock.map((cell) => ({
            row: cell.row,
            col: cell.col
        }));

        sendBlockToDB(blockDB)


        setColoredBlocks((prevColoredBlocks) => [
            ...prevColoredBlocks,
            ...newColoredBlock.filter(
                (newBox) =>
                    !prevColoredBlocks.some(
                        (box) => box.row === newBox.row && box.col === newBox.col
                    )
            ),
        ]);
    };

    const sendBlockToDB = async (blockDB) => {
    try {
        const response = await fetch(
        "https://users.iee.ihu.gr/~iee2020188/adise_php/setBlockToMainBoard.php",
        {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            block: blockDB,
            board_id: board_id,
            player: player
            }),
            credentials: 'include'
        }
        );

        if (response.ok) {
        const result = await response.json();
        console.log("Block uploaded successfully");
        console.log(result);
        } else {
        const result = await response.json();
        console.log("Block doesn't uploaded");
        console.error(result.error);
        }
    } catch (err) {
        console.log("Error", err);
    }
    
    };

    return (
        <div className={style.mainBoard}>
            {Array.from({ length: totalBoxes }).map((_, index) => {
                const row = Math.floor(index / gridSize) + 1;
                const col = (index % gridSize) + 1;

                const isHighlighted = highlightedBoxes.some(
                    (box) => box.row === row && box.col === col
                );

                const coloredBox = coloredBlocks.find(
                    (box) => box.row === row && box.col === col
                );

                return (
                    <div
                        key={index}
                        className={style.box}
                        style={{
                            backgroundColor: coloredBox ? coloredBox.color : "transparent",
                            border: "1px solid black",
                        }}
                        onClick={() => handleClick(row, col)}
                    ></div>
                );
            })}
        </div>
    );
}

export default MainBoard;