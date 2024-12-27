import { useState } from "react"
import style from "../styling/RoomsScreen.module.css";
import { useNavigate } from 'react-router-dom';

function RoomsScreen(){

    const[rooms, setRooms] = useState([{room_id: 1235, player1_id: 34, player2_id: 49, status: "waiting"},{room_id: 1235, player1_id: 34, player2_id: 49, status: "waiting"}]);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const performLogOut = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(
                'https://users.iee.ihu.gr/~iee2020188/adise_php/logout.php',
                {
                    method: 'POST',
                }
            );
    
            if (response.ok) {
                if (response.status === 200) {
                    navigate('/');
                } else {
                    const result = await response.json();
                    setError(result.message || 'Unexpected response');
                }
            } else {
                const result = await response.json();
                setError(result.error || 'Logout has failed, please try again.');
            }
        } catch (err) {
            console.log(err);
            setError('Failed to connect to the server.');
        }
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul className = {style.roomsList}>
                {
                    rooms.map( room =>
                        <li className={style.roomCard} key = {room.room_id}>
                            <h3 className={style.roomId}>#{room.room_id}</h3>
                            <img className={style.cardImg} src="/user.png" alt="user icon"/>
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