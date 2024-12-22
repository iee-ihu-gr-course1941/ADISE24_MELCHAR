import style from "./styling/App.module.css";
import PlayerBoard from "./components/PlayerBoard";
import Mainboard from "./components/MainBoard";

function App() {
  return (
    <div className={style.container}>
      <div className={style.section1}>
        <PlayerBoard />
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
        <PlayerBoard />
        <h2>Player 2</h2>
      </div>
    </div>
  );
}

export default App;
