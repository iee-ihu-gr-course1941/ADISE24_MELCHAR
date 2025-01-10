import { useEffect, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import style from "../styling/FinishedGameScreen.module.css";

function FinishedGameScreen(){

    const location = useLocation();
    const navigate = useNavigate();

    const [canGoHome, setCanGoHome] = useState(false);

    const deleteRoomAndBoard = useCallback( async () => {
        try{
            const roomResponse = await fetch(
                "https://users.iee.ihu.gr/~iee2020188/adise_php/deleteRoom.php",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    room_id: location.state.room_id
                  }),
                  credentials: "include",
                }
              );

              if(roomResponse.ok){
                const boardResponse = await fetch(
                    "https://users.iee.ihu.gr/~iee2020188/adise_php/deleteBoardById.php",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        room_id: location.state.room_id
                      }),
                      credentials: "include",
                    }
                  );

                  if(boardResponse.ok){
                    setCanGoHome(true);
                  }else{
                    const result = await boardResponse.json();
                    alert(result.error || "An error occurred while deleting the board.");
                  }
              }else{
                const result = await roomResponse.json();
                alert(result.error || "An error occurred while deleting the room.");
              }
        }catch(err){
            console.log(err);
            alert("An error occurred while deleting the room.");
        }
    }, [location.state.room_id]);

    useEffect(() => {
        deleteRoomAndBoard();
    }, [deleteRoomAndBoard]);

    const goHome = () => {
        navigate("/roomsScreen", {state: { player1_id: location.state.player1_id }});
    }

    return (
        <div className={style.finishedGameScreen}>
            <div className={style.background}></div>
            <h1 className={style.header}>{location.state.winner}</h1>
            <button
              className={style.btn}
              onClick={canGoHome ? goHome : undefined}
              disabled={!canGoHome}
            >
              GO HOME
            </button>
        </div>
    );
}

export default FinishedGameScreen;
