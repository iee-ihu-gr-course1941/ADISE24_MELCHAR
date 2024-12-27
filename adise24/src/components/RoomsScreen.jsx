import { useState } from "react"
import style from "../styling/RoomsScreen.module.css";

function RoomsScreen(){

    const[rooms, setRooms] = useState([{room_id: 1235, player1_id: 34, player2_id: 49, status: "waiting"},{room_id: 1235, player1_id: 34, player2_id: 49, status: "waiting"}]);

    const performLogOut = () => {

    }

    const initializeRoom = () => {

    }

    return <div className={style.screen}>
        <div className={style.header}>
            <h1 className={style.title}>Available Rooms</h1>
            <button onClick={initializeRoom} className={style.roomsBtn}>CREATE ROOM</button>
            <button onClick={performLogOut} className={style.roomsBtn}>LOGOUT</button>
        </div>
        <div className={style.roomsContainer}>
            <ul className = {style.roomsList}>
                {
                    rooms.map( room =>
                        <li className={style.roomCard} key = {room.room_id}>
                            <h3 className={style.roomId}>#{room.room_id}</h3>
                            <img className={style.cardImg} src="/user.png"/>
                            <p className={style.cardDesc}>1/2</p>
                            <button className={style.cardBtn}>JOIN</button>
                        </li> 
                    )
                }
            </ul>
        </div>
    </div>
}

export default RoomsScreen