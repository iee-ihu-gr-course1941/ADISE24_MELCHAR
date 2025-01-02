import style from "../styling/PlayerBoard.module.css";
import { useState, useEffect } from "react";
import { lightBoxesForNextMove } from "../gameLogic/rules";

const gridHight = 15;
const gridWidth = 15;
const totalBoxes = gridHight * gridWidth;

function PlayerBoard({player, room_id, rounds, onHighlight, blockToMainBoard}) {
  const [blocks, setBlocks] = useState([]);
  const playerColor = player === 1 ? "blue" : "red";
  
  
  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    
    try{
      const response = await fetch(
        `https://users.iee.ihu.gr/~iee2020188/adise_php/getBoards.php?board_id=${room_id}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      if(response.ok) {
        const result = await response.json();
        console.log("Blocks fetch successfully");
        console.log(result)
        setBlocks(result.board_p1 || []);
      } else {
        const result = await response.json();
        console.log("Fetch didn't complete", result.error)
      }
    } catch(err) {
      console.error("Error", err);
    }
  }; 

  const handleClick = (block, rounds) => {
    console.log("Block", block);
    if (!block) return;
    const highlightedBoxes  = lightBoxesForNextMove(block, rounds);
    onHighlight(highlightedBoxes);
  };

  const sendBlockInMainBoard = async (block, player) => {
    console.log("Sending data to server:", {
      board_id: room_id,
      block: block,
      player: player
    });
    try {
      const response = await fetch(
        "https://users.iee.ihu.gr/~iee2020188/adise_php/setBlockToMainBoard.php",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            block: block,
            board_id: room_id,
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
    <div className={style.board}>
      {Array.from({ length: totalBoxes }).map((_, index) => {
        const row = Math.floor(index / gridHight) + 1;
        const col = (index % gridWidth) + 1;

        const block = blocks.find((b) =>
          b.cells.some(cell => cell.row === row && cell.col === col)
        );

        return (
          <div
            key={index}
            className={style.box}
            style={{
              backgroundColor: block ? playerColor : "transparent",
              border: block ? "2px solid black" : "none",
            }}
            // onClick={() => block && handleClick(block, rounds)}
            onClick={() => block && sendBlockInMainBoard(block, player)}
          ></div>
        );
      })}
    </div>
  );
}

export default PlayerBoard;
