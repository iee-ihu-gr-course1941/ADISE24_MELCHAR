import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import style from "../styling/App.module.css";
import PlayerBoard from "./PlayerBoard";
import Mainboard from "./MainBoard";

function GameScreen() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const room_id = searchParams.get("room_id");
  const player_round = 1; 
  const rounds = 0;
  const [highlightedBoxes, setHighlightedBoxes] = useState([]);
  const handleHighLight = (newHighlightedBoxes) => {
    setHighlightedBoxes(newHighlightedBoxes);
  };
  


  return (
    <div className={style.container}>
      <div className={style.section1}>
        <PlayerBoard 
          player={1} 
          room_id={room_id} 
          rounds={rounds}
          onHighlight={handleHighLight}
        />
        <h2>Player 1</h2>
      </div>
      <div className={style.section2}>
        <div className={style.marginBottom}>
          <>
            <h1>Blokus</h1>
            <Mainboard
              highlightedBoxes={highlightedBoxes}
            />
            <h3>Player {player_round}</h3>
          </>
        </div>
      </div>
      <div className={style.section3}>
        <PlayerBoard 
          player={2} 
          room_id={room_id} 
          rounds={rounds}
          onHighlight={handleHighLight}
        />
        <h2>Player 2</h2>
      </div>
    </div>
  );
}

export default GameScreen;