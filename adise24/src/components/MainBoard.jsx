import style from '../styling/MainBoard.module.css'

const gridSize = 20;
const totalBoxes = gridSize * gridSize

function MainBoard({ highlightedBoxes }) {
    return (
        <div className={style.mainBoard}>
            {Array.from({ length: totalBoxes }).map((_, index) => {
                const row = Math.floor(index / gridSize) + 1;
                const col = (index % gridSize) + 1;

                const isHighlighted = highlightedBoxes.some(
                    (box) => box.row === row && box.col === col
                );

                return (
                    <div
                        key={index}
                        className={style.box}
                        style={{
                            backgroundColor: isHighlighted ? "yellow" : "transparent",
                            border: "1px solid black",
                        }}
                    ></div>
                );
            })}
        </div>
    );
}

export default MainBoard;