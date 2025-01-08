import React, { useEffect, useState, useCallback } from "react";
import style from '../styling/MainBoard.module.css';

const gridSize = 20;
const totalBoxes = gridSize * gridSize;

function MainBoard({blockToMain, player, board_id, onSuccess, triggerFetch, player_id, isTheFirstMove, onError }) {
  const [coloredBlocks, setColoredBlocks] = useState([]);
  const fetchColoredBlocks = useCallback(async () => {
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
        let allColoredBlocks = [];

        result.board.forEach((field) => {
          switch (field.player_field) {
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

          field.main_board.forEach((cell) =>
            allColoredBlocks.push({
              row: cell.row,
              col: cell.col,
              color: blocksColor,
            })
          );
        });

        setColoredBlocks(allColoredBlocks);
      } else {
        const result = await response.json();
        console.error("Error fetching main board:", result.error);
      }
    } catch (err) {
      console.error("Fetch error in MainBoard:", err);
    }
  }, [board_id]);
  

  useEffect(() => {
    fetchColoredBlocks();
  }, [fetchColoredBlocks, triggerFetch]);

  const handleClick = (row, col) => {
    if (!blockToMain || !blockToMain.cells) return;

    const minCell = blockToMain.cells.reduce((min, cell) => {
      if (
        cell.row < min.row ||
        (cell.row === min.row && cell.col < min.col)
      ) {
        return cell;
      }
      return min;
    }, blockToMain.cells[0]);

    const rowOffset = row - minCell.row;
    const colOffset = col - minCell.col;

    const blockDB = blockToMain.cells.map((cell) => ({
      row: cell.row + rowOffset,
      col: cell.col + colOffset,
    }));

    checkIfIsValidMove(blockDB);

  };

  const checkIfIsValidMove = async (blockDB) => {
    if(onError){
      onError(null);
    }
    try {
      const response = await fetch(
        `https://users.iee.ihu.gr/~iee2020188/adise_php/getMainBoard.php?board_id=${encodeURIComponent(board_id)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if(response.ok){
        const result = await response.json();
        const isAnotherBlockPlaced = result.board.some((element) => {
          return element.main_board.some((boardCell) => {
            return blockDB.some((blockCell) => {
              return boardCell.row === blockCell.row && boardCell.col === blockCell.col;
            });
          });
        });

        const isBlockOffBounds = blockDB.some((blockCell) => {
            return blockCell.row > 20 || blockCell.col > 20 || blockCell.row < 1 || blockCell.col < 1
        });

        console.log(blockDB);

        if(isAnotherBlockPlaced){
          if(onError){
            onError("Another block is placed in this position.");
          }
        }else if(isBlockOffBounds){
          if(onError){
            onError("Block exceeds the main board boarder.");
          }
        }else{
          if(isTheFirstMove){
            const isBlockPlacedInCorner = blockDB.some((blockCell) => {
                console.log(blockCell);
                return (blockCell.row === 1 && blockCell.col === 1)
                || (blockCell.row === 1 && blockCell.col === 20)
                || (blockCell.row === 20 && blockCell.col === 1)
                || (blockCell.row === 20 && blockCell.col === 20)
            })
            if(isBlockPlacedInCorner){
              sendBlockToDB(blockDB, blockToMain);
            }else{
              if(onError){
                onError("The first block must be placed to one of the available corners.");
              }
            }
          }else{
            sendBlockToDB(blockDB, blockToMain);
          }
        }
      }
    }catch(err){
      if(onError){
        onError("Something went wrong. Try again.");
      }
    }
  }

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
            player: player,
            player_id: player_id
          }),
          credentials: 'include',
        }
      );

      if (response.ok) {
        const result = await response.json();
        await fetchColoredBlocks();

        if (onSuccess) {
          onSuccess();
        }
        
        console.log("Block uploaded successfully:", result);
      } else {
        const result = await response.json();
        console.error("Block upload failed:", result.error);
      }
    } catch (err) {
      console.error("Error sending block to DB:", err);
    }
  };

  return (
    <div className={style.mainBoard}>
      {Array.from({ length: totalBoxes }).map((_, index) => {
        const row = Math.floor(index / gridSize) + 1;
        const col = (index % gridSize) + 1;

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
