// GameScreen.jsx
import React, { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import style from "../styling/App.module.css";
import PlayerBoard from "./PlayerBoard";
import MainBoard from "./MainBoard"; 

function GameScreen() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const room_id = searchParams.get("room_id");

  const [highlightedBoxes, setHighlightedBoxes] = useState([]);

  const handleHighLight = (newHighlightedBoxes) => {
    setHighlightedBoxes(newHighlightedBoxes);
  };

  const [blockToMain, setBlockToMain] = useState(null);

  const handleBlockToMain = (newBlock, player, playerBoardNum) => {
    setBlockToMain({
      block: newBlock,
      player: player,
      playerBoardNum: playerBoardNum,
      board_id: room_id,
    });
  };

  const [fetchTrigger, setFetchTrigger] = useState(0);

  const handleMainBoardSuccess = useCallback(() => {
    setFetchTrigger((prev) => prev + 1);
  }, []);

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
