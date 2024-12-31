import style from '../styling/WaitingScreen.module.css'

function WaitingScreen(){
    return <div className={style.waitingScreen}>
        <div className={style.background}></div>
        <button className={style.btn}>CANCEL</button>
        <h1 className={style.header}>PLEASE WAIT PLAYER 2 TO JOIN . . .</h1>
    </div>
}

export default WaitingScreen;