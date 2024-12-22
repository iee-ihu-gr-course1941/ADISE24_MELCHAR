import style from '../styling/MainBoard.module.css'

const gridSize = 20;
const totalBoxes = gridSize * gridSize

function MainBoard(){
    return <div className={style.mainBoard}>
        {Array.from({length: totalBoxes}).map((_, index) => (
            <div key={index} className={style.box}> </div>
        ))}
    </div>
}

export default MainBoard;