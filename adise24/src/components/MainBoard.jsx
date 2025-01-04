import React, { useEffect, useState, useCallback } from "react";
import style from '../styling/MainBoard.module.css'
import { use } from "react";

const gridSize = 20;
const totalBoxes = gridSize * gridSize

function MainBoard({ highlightedBoxes, blockToMain, player, playerBoardNum, board_id}) {
    const [coloredBlocks, setColoredBlocks] = useState([]);

    const fetchColoredBlocks = useCallback( async () => {
        try {
            const response = await fetch(
                `https://users.iee.ihu.gr/~iee2020188/adise_php/getMainBoard.php?board_id=${encodeURIComponent(board_id)}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            if (response.ok) {
                const result = await response.json();

                let blocksColor = "";
                let allColoredBlocks = []

                result.board.forEach((field) => {
                    switch(field.player_field){
                        case "board_p1_1": blocksColor = "blue"
                        break;
                        case "board_p1_2": blocksColor = "red"
                        break;
                        case "board_p2_1": blocksColor = "yellow"
                        break;
                        case "board_p2_2": blocksColor = "green"
                        break;
                    }


                    field.main_board.forEach(cell => 
                        allColoredBlocks.push({
                            row: cell.row,
                            col: cell.col,
                            color: blocksColor
                        }))
                });

                setColoredBlocks(allColoredBlocks);
            } else {
                const result = await response.json();
                console.log(result.error);
            }
        } catch (err) {
            console.log(err);
        }
    });

    useEffect(() => {
        fetchColoredBlocks();
    }, []);

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

        const blockDB = blockToMain.cells.map((cell) => ({
            row: cell.row + rowOffset,
            col: cell.col + colOffset
        }));

        sendBlockToDB(blockDB, blockToMain)
    };

    const sendBlockToDB = async (blockDB, initialBlocks) => {
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
            initialBlocks: initialBlocks,
            board_id: parseInt(board_id),
            player: player
            }),
            credentials: 'include'
        }
        );

        if (response.ok) {
        const result = await response.json();
        fetchColoredBlocks();
        console.log("Block uploaded successfully");
        console.log(result);
        } else {
        const result = await response.json();
        console.log("Block didn't upload");
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