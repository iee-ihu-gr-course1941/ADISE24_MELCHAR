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
  const [isPlayersTurn, setIsPlayersTurn] = useState(false);
  const [colorPlaying, setColorPlaying] = useState("");

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
    if (isPlayerPlayer1 !== null) {
      if (isPlayerPlayer1) {
        setColorPlaying("blue");
      } else {
        setColorPlaying("green");
      }
    }
  }, [isPlayerPlayer1]);

  useEffect(() => {
    if (isPlayerPlayer1 === null) return;

    if (isPlayerPlayer1) {
      setColorPlaying((prevColor) =>
        prevColor === "red" ? "blue" : "red"
      );
    } else {
      setColorPlaying((prevColor) =>
        prevColor === "green" ? "yellow" : "green"
      );
    }
  }, [fetchTrigger, isPlayerPlayer1]);

  useEffect(() => {
    const fetchPlayerTurn = async () => {
      try {
        const response = await fetch(
          `https://users.iee.ihu.gr/~iee2020188/adise_php/getBoardMatchDetails.php?board_id=${encodeURIComponent(room_id)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          setIsPlayersTurn(result.player_turn === player_id);
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
  
  return (
    <div className={style.container}>
      <div className={style.section1}>
        <h2>Player 1</h2>
        <PlayerBoard
          playerBoardNum={"board_p1_1"}
          room_id={room_id}
          player={1.1}
          sendBlockToMain={isPlayerPlayer1 && isPlayersTurn && colorPlaying === "blue" ? handleBlockToMain : () => {}}
          triggerFetch={fetchTrigger}
        />

        <PlayerBoard
          playerBoardNum={"board_p1_2"}
          room_id={room_id}
          player={1.2}
          sendBlockToMain={isPlayerPlayer1 && isPlayersTurn && colorPlaying === "red" ? handleBlockToMain : () => {}}
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
                  {isPlayersTurn && isPlayerPlayer1 ? `Player 1 turn! Color playing: ${colorPlaying}` : 
                    !isPlayersTurn && isPlayerPlayer1 ? "Player 2 turn!" :
                    isPlayersTurn && !isPlayerPlayer1 ? `Player 2 turn! Color playing: ${colorPlaying}` :
                    !isPlayersTurn && !isPlayerPlayer1 ? "Player 1 turn!" : ""
                  }
                </div>
              </div>
              <button className={style.leaveBtn}>LEAVE</button>
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
          sendBlockToMain={!isPlayerPlayer1 && isPlayersTurn  && colorPlaying === "yellow" ? handleBlockToMain : () => {}}
          triggerFetch={fetchTrigger}
        />

        <PlayerBoard
          playerBoardNum={"board_p2_2"}
          room_id={room_id}
          player={2.2}
          sendBlockToMain={!isPlayerPlayer1 && isPlayersTurn  && colorPlaying === "green" ? handleBlockToMain : () => {}}
          triggerFetch={fetchTrigger}
        />
      </div>
    </div>
  );
}

export default GameScreen;
