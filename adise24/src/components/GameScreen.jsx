import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import style from "../styling/App.module.css";
import PlayerBoard from "./PlayerBoard";
import MainBoard from "./MainBoard"; 

function GameScreen() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const room_id = searchParams.get("room_id");

  const [highlightedBoxes, setHighlightedBoxes] = useState([]);
  const [blockToMain, setBlockToMain] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [error, setError] = useState(null);

  const handleHighLight = (newHighlightedBoxes) => {
    setHighlightedBoxes(newHighlightedBoxes);
  };

  const handleBlockToMain = (newBlock, player, playerBoardNum) => {
    setBlockToMain({
      block: newBlock,
      player: player,
      playerBoardNum: playerBoardNum,
      board_id: room_id,
    });
  };

  const handleMainBoardSuccess = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!room_id) {
      setError("Invalid room ID");
      return;
    }

    const eventSource = new EventSource(
      `https://users.iee.ihu.gr/~iee2020188/adise_php/sse.php?board_id=${room_id}`,
      { withCredentials: true }
    );

    eventSource.addEventListener("connected", (event) => {
      const data = JSON.parse(event.data);
      console.log(data.message);
    });

    eventSource.addEventListener("update", (event) => {
      const data = JSON.parse(event.data);
      if (data.message === "Data changed") {
        console.log("Update detected via SSE.");
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

  if (error) {
    return <div className={style.error}>Error: {error}</div>;
  }

  return (
    <div className={style.container}>
      <div className={style.section1}>
        <h2>Player 1</h2>
        <PlayerBoard
          playerBoardNum={"board_p1_1"}
          room_id={room_id}
          player={1.1}
          onHighlight={handleHighLight}
          sendBlockToMain={handleBlockToMain}
          triggerFetch={fetchTrigger}
        />

        <PlayerBoard
          playerBoardNum={"board_p1_2"}
          room_id={room_id}
          player={1.2}
          onHighlight={handleHighLight}
          sendBlockToMain={handleBlockToMain}
          triggerFetch={fetchTrigger} 
        />
      </div>
      <div className={style.section2}>
        <div className={style.marginBottom}>
          <>
            <h1>Blokus</h1>
            <MainBoard
              highlightedBoxes={highlightedBoxes}
              blockToMain={blockToMain ? blockToMain.block : null}
              player={blockToMain ? blockToMain.player : null}
              board_id={room_id}
              onSuccess={handleMainBoardSuccess}
              triggerFetch={fetchTrigger}
            />
          </>
        </div>
      </div>
      <div className={style.section3}>
        <h2>Player 2</h2>
        <PlayerBoard
          playerBoardNum={"board_p2_1"}
          room_id={room_id}
          player={2.1}
          onHighlight={handleHighLight}
          sendBlockToMain={handleBlockToMain}
          triggerFetch={fetchTrigger}
        />

        <PlayerBoard
          playerBoardNum={"board_p2_2"}
          room_id={room_id}
          player={2.2}
          onHighlight={handleHighLight}
          sendBlockToMain={handleBlockToMain}
          triggerFetch={fetchTrigger}
        />
      </div>
    </div>
  );
}

export default GameScreen;
