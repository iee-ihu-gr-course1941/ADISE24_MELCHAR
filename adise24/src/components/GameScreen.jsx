import React from "react";
import { useLocation } from "react-router-dom";
import style from "../styling/App.module.css";
import PlayerBoard from "./PlayerBoard";
import Mainboard from "./MainBoard";



function GameScreen() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const room_id = searchParams.get("room_id");

  return (
    <div className={style.container}>
      <div className={style.section1}>
        <PlayerBoard player={1} room_id={room_id} />
        <h2>Player 1</h2>
      </div>
      <div className={style.section2}>
        <div className={style.marginBottom}>
          <>
            <h1>Blokus</h1>
            <Mainboard />
          </>
        </div>
      </div>
      <div className={style.section3}>
        <PlayerBoard player={2} room_id={room_id} />
        <h2>Player 2</h2>
      </div>
    </div>
  );
}

export default GameScreen;