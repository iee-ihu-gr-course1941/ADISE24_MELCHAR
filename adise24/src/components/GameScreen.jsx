import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import style from "../styling/App.module.css";
import PlayerBoard from "./PlayerBoard";
import MainBoard from "./MainBoard"; 
import { rotateBlockCellsBy90 } from "./helperFunctions/RotateBlockCellsBy90";
import { flipBlockCellsHorizontally } from "./helperFunctions/FlipBlockCellsHorizontally";

function GameScreen() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const room_id = searchParams.get("room_id");
  const navigate = useNavigate();

  const [blockToMain, setBlockToMain] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [error, setError] = useState(null);
  const { player_id } = location.state || {};
  const [isPlayerPlayer1, setIsPlayerPlayer1] = useState(null);
  const [playersTurn, setPlayersTurn] = useState(1.1);

  const isBoardEmpty = (boardData) => {
    return !boardData || boardData.length === 0;
  };

  const handleBlockToMain = (newBlock, player, playerBoardNum, isTheFirstMove) => {
    setBlockToMain({
      block: newBlock,
      player: player,
      playerBoardNum: playerBoardNum,
      isTheFirstMove: isTheFirstMove,
      board_id: room_id,
    });
  };

  const handleMainBoardSuccess = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  const handleMainBoardError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  const handleRotateBlock = () => {
    if (!blockToMain?.block?.cells) return;

    const rotatedCells = rotateBlockCellsBy90(blockToMain.block.cells);
    setBlockToMain((prev) => ({
      ...prev,
      block: {
        ...prev.block,
        cells: rotatedCells,
      },
    }));
  };

  const handleFlipBlock = () => {
    if (!blockToMain?.block?.cells) return;

    const flippedCells = flipBlockCellsHorizontally(blockToMain.block.cells);

    setBlockToMain((prev) => ({
      ...prev,
      block: {
        ...prev.block,
        cells: flippedCells,
      },
    }));
  };

  useEffect(() => {
    const checkIsPlayerPlayer1 = async () => {
      try {
        const response = await fetch(
          `https://users.iee.ihu.gr/~iee2020188/adise_php/getRoomById.php?room_id=${encodeURIComponent(room_id)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          result.room.player1_id === player_id
            ? setIsPlayerPlayer1(true)
            : setIsPlayerPlayer1(false);
        } else if (response.status === 401 || response.status === 403) {
          navigate('/loginScreen');
        } else {
          const result = await response.json();
          console.log(result.error);
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkIsPlayerPlayer1();
  }, [room_id, player_id, navigate]);

  useEffect(() => {
    if (!room_id || isNaN(parseInt(room_id))) {
      return;
    }

    const eventSource = new EventSource(
      `https://users.iee.ihu.gr/~iee2020188/adise_php/sse.php?board_id=${parseInt(room_id)}`,
      { withCredentials: true }
    );

    eventSource.addEventListener("connected", (event) => {
      const data = JSON.parse(event.data);
      setFetchTrigger((prev) => prev + 1);
      console.log(data.message);
    });

    eventSource.addEventListener("update", (event) => {
      const data = JSON.parse(event.data);
      if (data.message === "Data changed") {
        setFetchTrigger((prev) => prev + 1);
      }
    });

    eventSource.addEventListener("error", (event) => {
      const data = JSON.parse(event.data);
      console.error("SSE Error:", data.message);
      setError(data.message);
      eventSource.close();
    });

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error:", err);
      setError("SSE Connection Error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [room_id]);

  useEffect(() => {
    const fetchPlayerTurn = async () => {
      try {
        const response = await fetch(
          `https://users.iee.ihu.gr/~iee2020188/adise_php/getBoardById.php?board_id=${encodeURIComponent(room_id)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          if(result.board.player_aborded !== null){
            if(result.board.player_aborded === "1.1" || result.board.player_aborded === "1.2"){
              if(isPlayerPlayer1){
                navigate("/roomsScreen", { state: { player1_id: player_id } })
              }else{
                navigate(`/finishedGameScreen/${room_id}`, { state: { winner: "Winner: Player 2. Player 1 aborded the game.", player1_id: player_id, room_id: room_id} })
              }
            }else if(result.board.player_aborded === "2.1" || result.board.player_aborded === "2.2"){
              if(isPlayerPlayer1){
                navigate(`/finishedGameScreen/${room_id}`, { state: { winner: "Winner: Player 1. Player 2 aborded the game.", player1_id: player_id, room_id: room_id} })
              }else{
                navigate("/roomsScreen", { state: { player1_id: player_id } })
              }
            }
          }else{
            if(isBoardEmpty(result.board.board_p1_1) || 
            isBoardEmpty(result.board.board_p1_2) || 
            isBoardEmpty(result.board.board_p2_1) || 
            isBoardEmpty(result.board.board_p2_2)
            ){
              const winner = result.board.player1_points < result.board.player2_points ? "Winner: Player 1" : result.board.player1_points > result.board.player2_points ? "Winner: Player 2" : "Tie"
              navigate(`/finishedGameScreen/${room_id}`, { state: { winner: winner, player1_id: player_id, room_id: room_id} });
          } else {
              let playerBoardToCheck = [];

              switch(result.board.player_turn){
                case 1.1:
                  playerBoardToCheck = result.board.board_p1_1;
                break;
              case 1.2:
                playerBoardToCheck = result.board.board_p1_2;
                break;
              case 2.1:
                playerBoardToCheck = result.board.board_p2_1;
                break;
              case 2.2:
                playerBoardToCheck = result.board.board_p2_2;
                break;
              }


              let noValidMoves = true;

              playerBoardToCheck.forEach((piece) => {
                if (!noValidMoves) return;

                const originalCells = piece.cells;

                const getBoundingBox = (cells) => {
                  let minRow = Infinity, maxRow = -Infinity;
                  let minCol = Infinity, maxCol = -Infinity;
                  cells.forEach(({ row, col }) => {
                    if (row < minRow) minRow = row;
                    if (row > maxRow) maxRow = row;
                    if (col < minCol) minCol = col;
                    if (col > maxCol) maxCol = col;
                  });
                  return { minRow, maxRow, minCol, maxCol };
                };

                const getAllTransformations = (cells) => {
                  const transformations = [];

                  let current = [...cells];
                  for (let r = 0; r < 4; r++) {
                    if (r > 0) {
                      current = rotateBlockCellsBy90(current);
                    }

                    const unflipped = [...current];
                    const flipped = flipBlockCellsHorizontally(current);

                    transformations.push(unflipped);
                    transformations.push(flipped);
                  }

                  return transformations;
                };

                const allTransformedCells = getAllTransformations(originalCells);

                const shiftPiece = (cells, targetRow, targetCol) => {
                  const { minRow, minCol } = getBoundingBox(cells);
                  const rowOffset = targetRow - minRow;
                  const colOffset = targetCol - minCol;

                  return cells.map(({ row, col }) => ({
                    row: row + rowOffset,
                    col: col + colOffset,
                  }));
                };

                const isPlacementValid = (cells) => {
                  const outOfBounds = cells.some(
                    (cell) => cell.row < 1 || cell.row > 20 || cell.col < 1 || cell.col > 20
                  );
                  if (outOfBounds) return false;

                  const existingBlocks = result.board.board_main.flatMap((block) =>
                    block.main_board
                  );

                  const collisionDetected = existingBlocks.some((existingCell) =>
                    cells.some(
                      (pieceCell) =>
                        pieceCell.row === existingCell.row && pieceCell.col === existingCell.col
                    )
                  );
                  if (collisionDetected) return false;

                  return true;
                };

                for (const transformedCells of allTransformedCells) {
                  for (let row = 1; row <= 20; row++) {
                    for (let col = 1; col <= 20; col++) {
                      const shiftedPiece = shiftPiece(transformedCells, row, col);

                      if (isPlacementValid(shiftedPiece)) {

                        noValidMoves = false;
                        break;
                      }
                    }
                    if (!noValidMoves) break;
                  }
                  if (!noValidMoves) break;
                }
              });

              if (noValidMoves) {
                const winner = result.board.player1_points < result.board.player2_points ? "Winner: Player 1" : result.board.player1_points > result.board.player2_points ? "Winner: Player 2" : "Tie"
                navigate(`/finishedGameScreen/${room_id}`, { state: { winner: winner, player1_id: player_id, room_id: room_id} });
              }else{
                setPlayersTurn(parseFloat(result.board.player_turn));
              }
            }
          }
        } else if (response.status === 401 || response.status === 403) {
          navigate('/loginScreen');
        } else {
          const result = await response.json();
          console.log(result.error);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (room_id && player_id) {
      fetchPlayerTurn();
    }
  }, [fetchTrigger, room_id, player_id, navigate]);

  const onLeaveButtonPressed = useCallback(async (pressed_by_player) => {
    try {
      const response = await fetch(
        `https://users.iee.ihu.gr/~iee2020188/adise_php/updateAborded.php?board_id=${encodeURIComponent(room_id)}&player_aborded=${encodeURIComponent(pressed_by_player)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
  
      if (!response.ok) {
        setError("Something went wrong.");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred while leaving the game.");
    }
  }, [room_id]);
  
  return (
    <div className={style.container}>
      <div className={style.section1}>
        <h2>Player 1</h2>
        <PlayerBoard
          playerBoardNum={"board_p1_1"}
          room_id={room_id}
          player={1.1}
          sendBlockToMain={isPlayerPlayer1 && playersTurn === 1.1 ? handleBlockToMain : () => {}}
          triggerFetch={fetchTrigger}
        />

        <PlayerBoard
          playerBoardNum={"board_p1_2"}
          room_id={room_id}
          player={1.2}
          sendBlockToMain={isPlayerPlayer1 && playersTurn === 1.2 ? handleBlockToMain : () => {}}
          triggerFetch={fetchTrigger} 
        />
      </div>
      <div className={style.section2}>
        <div className={style.marginBottom}>
          <>
            <h1>Blokus</h1>
            <MainBoard
              blockToMain={blockToMain ? blockToMain.block : null}
              player={blockToMain ? blockToMain.player : null}
              board_id={room_id}
              isTheFirstMove={blockToMain ? blockToMain.isTheFirstMove : true}
              onError={handleMainBoardError}
              onSuccess={handleMainBoardSuccess}
              triggerFetch={fetchTrigger}
              player_id={player_id}
            />
            <div className={style.gameScreenActions}>
              <div className={style.btnWrapper}>
                <button className={style.gameScreenRotateBtn} onClick={handleRotateBlock}>ROTATE 90o</button>
                <button className={style.gameScreenFlipBtn} onClick={handleFlipBlock}>FLIP</button>
              </div>
              <div className={style.messagesWrapper}>
                {error && <div className={style.error}>Error: {error}</div>}
                <div className={style.turn}>
                  {(playersTurn === 1.1 || playersTurn === 1.2) && isPlayerPlayer1 ? `Player 1 turn! Color playing: ${playersTurn === 1.1 ? "Blue" : "Red"}` : 
                    (playersTurn === 2.1 || playersTurn === 2.2) && isPlayerPlayer1 ? "Player 2 turn!" :
                    (playersTurn === 2.1 || playersTurn === 2.2) && !isPlayerPlayer1 ? `Player 2 turn! Color playing: ${playersTurn === 2.1 ? "Yellow" : "Green"}` :
                    (playersTurn === 1.1 || playersTurn === 1.2) && !isPlayerPlayer1 ? "Player 1 turn!" : ""
                  }
                </div>
              </div>
              <button className={style.leaveBtn} onClick={() => ((isPlayerPlayer1 && (playersTurn === 1.1 || playersTurn === 1.2)) || ((playersTurn === 2.1 || playersTurn === 2.2) && !isPlayerPlayer1)) && onLeaveButtonPressed(playersTurn)}>LEAVE</button>
            </div>
          </>
        </div>
      </div>
      <div className={style.section3}>
        <h2>Player 2</h2>
        <PlayerBoard
          playerBoardNum={"board_p2_1"}
          room_id={room_id}
          player={2.1}
          sendBlockToMain={!isPlayerPlayer1 && playersTurn === 2.1 ? handleBlockToMain : () => {}}
          triggerFetch={fetchTrigger}
        />

        <PlayerBoard
          playerBoardNum={"board_p2_2"}
          room_id={room_id}
          player={2.2}
          sendBlockToMain={!isPlayerPlayer1 && playersTurn === 2.2 ? handleBlockToMain : () => {}}
          triggerFetch={fetchTrigger}
        />
      </div>
    </div>
  );
}

export default GameScreen;
