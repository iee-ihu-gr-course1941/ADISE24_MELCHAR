import style from "../styling/PlayerBoard.module.css";

const gridHight = 15;
const gridWidth = 15;
const totalBoxes = gridHight * gridWidth;

const getBlocks = async () => {


}


function PlayerBoard({player}) {
  const playerColor = player === 1 ? "blue" : "red";
  return (
    <div className={style.board}>
      {/* {Array.from({ length: totalBoxes }).map((_, index) => {
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
          ></div>
        );
      })} */}
    </div>
  );
}

export default PlayerBoard;
