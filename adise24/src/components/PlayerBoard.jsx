import React, { useState, useEffect, useCallback } from "react";
import style from "../styling/PlayerBoard.module.css";

const gridHeight = 15;
const gridWidth = 15;
const totalBoxes = gridHeight * gridWidth;

function PlayerBoard({
  playerBoardNum,
  room_id,
  player,
  sendBlockToMain,
  triggerFetch,
}) {
  const [blocks, setBlocks] = useState([]);
  let blocksColor = "";
  const [isTheFirstMove, setIsTheFirstMove] = useState(true);

  switch (playerBoardNum) {
    case "board_p1_1":
      blocksColor = "blue";
      break;
    case "board_p1_2":
      blocksColor = "red";
      break;
    case "board_p2_1":
      blocksColor = "yellow";
      break;
    case "board_p2_2":
      blocksColor = "green";
      break;
    default:
      blocksColor = "transparent";
  }

  const fetchPieces = useCallback(async () => {
    try {
      const response = await fetch(
        `https://users.iee.ihu.gr/~iee2020188/adise_php/getPlayerBoardByIdAndRoom.php?room_id=${encodeURIComponent(
          room_id
        )}&boardNum=${encodeURIComponent(playerBoardNum)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        const pieces = await response.json();
        const boardDataString = pieces.board[playerBoardNum];

        if (boardDataString) {
          const boardData = JSON.parse(boardDataString);
          setBlocks(boardData);
          setIsTheFirstMove(parseInt(boardData.length) === 21);
        } else {
          console.error(`No data found for board number: ${playerBoardNum}`);
          setBlocks([]);
        }
      } else {
        console.error("Network response was not ok.");
      }
    } catch (err) {
      console.error("Error fetching player pieces:", err);
    }
  }, [room_id, playerBoardNum]);

  useEffect(() => {
    fetchPieces();
  }, [fetchPieces, triggerFetch]); 

  const sendBlock = (block) => {
    if (typeof sendBlockToMain === "function") {
      sendBlockToMain(block, player, playerBoardNum, isTheFirstMove);
    }
  };

  return (
    <div className={style.board}>
      {Array.from({ length: totalBoxes }).map((_, index) => {
        const row = Math.floor(index / gridHeight) + 1;
        const col = (index % gridWidth) + 1;

        const block = blocks.find((b) =>
          b.cells.some((cell) => cell.row === row && cell.col === col)
        );

        return (
          <div
            key={index}
            className={style.box}
            style={{
              backgroundColor: block ? blocksColor : "transparent",
              border: block ? "2px solid black" : "none",
            }}
            onClick={() => block && sendBlock(block)}
          ></div>
        );
      })}
    </div>
  );
}

export default PlayerBoard;
