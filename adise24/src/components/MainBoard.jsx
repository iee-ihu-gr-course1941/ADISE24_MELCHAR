import React, { useEffect, useState, useCallback } from "react";
import style from '../styling/MainBoard.module.css';
import { useNavigate } from 'react-router-dom';

const gridSize = 20;
const totalBoxes = gridSize * gridSize;

function MainBoard({blockToMain, player, board_id, onSuccess, triggerFetch, player_id, isTheFirstMove, onError }) {
  const navigate = useNavigate();
  const [coloredBlocks, setColoredBlocks] = useState([]);

  const fetchColoredBlocks = useCallback(async () => {
    try {
      const response = await fetch(
        `https://users.iee.ihu.gr/~iee2020188/adise_php/getBoardById.php?board_id=${encodeURIComponent(board_id)}`,
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

        result.board.board_main.forEach((field) => {
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
        `https://users.iee.ihu.gr/~iee2020188/adise_php/getBoardById.php?board_id=${encodeURIComponent(board_id)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if(response.ok){
        const result = await response.json();
        const isAnotherBlockPlaced = result.board.board_main.some((element) => {
          return element.main_board.some((boardCell) => {
            return blockDB.some((blockCell) => {
              return boardCell.row === blockCell.row && boardCell.col === blockCell.col;
            });
          });
        });

        const isBlockOffBounds = blockDB.some((blockCell) => {
            return blockCell.row > 20 || blockCell.col > 20 || blockCell.row < 1 || blockCell.col < 1
        });


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
                return (blockCell.row === 1 && blockCell.col === 1)
                || (blockCell.row === 1 && blockCell.col === 20)
                || (blockCell.row === 20 && blockCell.col === 1)
                || (blockCell.row === 20 && blockCell.col === 20)
            })
            if(isBlockPlacedInCorner){
              sendBlockToDB(blockDB);
            }else{
              if(onError){
                onError("The first block must be placed to one of the available corners.");
              }
            }
          }else{
            let converted_player_field = "";

            switch (player) {
              case 1.1:
                converted_player_field = "board_p1_1";
                break;
              case 1.2:
                converted_player_field = "board_p1_2";
                break;
              case 2.1:
                converted_player_field = "board_p2_1";
                break;
              case 2.2:
                converted_player_field = "board_p2_2";
                break;
            }

            const sameColorFields = result.board.board_main.filter((field) => field.player_field === converted_player_field);

            const sameColorCells = sameColorFields.reduce((acc, field) => {
              return acc.concat(field.main_board);
            }, []);

            const isSideAdjacent = (cellA, cellB) => {
              return (
                (cellA.row === cellB.row && Math.abs(cellA.col - cellB.col) === 1) ||
                (cellA.col === cellB.col && Math.abs(cellA.row - cellB.row) === 1)
              );
            };

            const isCornerAdjacent = (cellA, cellB) => {
              return (
                Math.abs(cellA.row - cellB.row) === 1 &&
                Math.abs(cellA.col - cellB.col) === 1
              );
            };

            const touchesCornerOfSameColor = blockDB.some((newCell) => {
              return sameColorCells.some((existingCell) => {
                return isCornerAdjacent(newCell, existingCell);
              });
            });

            const sharesSideWithSameColor = blockDB.some((newCell) => {
              return sameColorCells.some((existingCell) => {
                return isSideAdjacent(newCell, existingCell);
              });
            });

            if (!touchesCornerOfSameColor) {
              if (onError) {
                onError(
                  "At least one corner of your new piece must touch a corner of a piece of the same color."
                );
              }
            } else if (sharesSideWithSameColor) {
              if (onError) {
                onError(
                  "Your new piece cannot share an edge with any of your existing pieces."
                );
              }
            } else {
              sendBlockToDB(blockDB);
            }
          }
        }
      }
    }catch(err){
      if(onError){
        onError("Something went wrong. Try again.", err);
      }
    }
  }

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
            block_id: parseInt(blockToMain.id),
            board_id: parseInt(board_id),
            player: player,
            player_id: parseInt(player_id),
            piece_length: parseInt(blockDB.length)
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

      } else {
        const result = await response.json();
        console.error("Block upload failed: ", result);
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
