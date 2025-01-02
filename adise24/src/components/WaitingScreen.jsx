import style from '../styling/WaitingScreen.module.css'
import { useNavigate, useLocation } from "react-router-dom";
import initializePlayerBlocks from "./helperFunctions/InitializePlayerBlocks.js";
import { useEffect } from "react";

function WaitingScreen(){

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const room_id = searchParams.get("room_id");
    const navigate = useNavigate();
    const blocks = initializePlayerBlocks();

    useEffect(() => {
        const gameScreen = async (room_id) => {
            try {
                const response = await fetch(
                    "https://users.iee.ihu.gr/~iee2020188/adise_php/setBoards.php",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            board_id: room_id,
                            blocks
                        }),
                        credentials: "include",
                    }
                );
                
                if(response.ok) {
                    navigate(`/gameScreen?room_id=${room_id}`);
                } else {
                    const result = await response.json();
                    alert(result.error || "Unknown error");
                }
            } catch (err) {
                console.log(err);
                alert("Failed to connect to the server.");
            }
        }

        const interval = setInterval(async () => {
            try{
                const response  = await fetch(
                    `https://users.iee.ihu.gr/~iee2020188/adise_php/getRoomById.php?room_id=${encodeURIComponent(room_id)}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );

                if(response.ok){
                    const result = await response.json();
                    if(result.room.player2_id !== null){
                        gameScreen(room_id);
                    }
                } else {
                    const result = await response.json();
                    console.log(result.error);
                }
            } catch(err){
                console.log(err);
            }
        }, 3000);
    
        return () => clearInterval(interval);
    }, [room_id, blocks, navigate]);

    const onCancelBtnClicked = async () => {
        
        const confirmed = window.confirm("Are you sure you want to cancel waiting? By canceling, the room will be deleted.");
    
        if (!confirmed) {
            return;
        }

        try{
            const response = await fetch(
                "https://users.iee.ihu.gr/~iee2020188/adise_php/deleteRoom.php",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    room_id: room_id
                  }),
                  credentials: "include",
                }
              );

              if(response.ok){
                navigate('/roomsScreen');
              }else{
                const result = await response.json();
                alert(result.error || "An error occurred while deleting the room.");
              }
        }catch(err){
            console.log(err);
            alert("An error occurred while deleting the room.");
        }

    }

    return <div className={style.waitingScreen}>
        <div className={style.background}></div>
        <button className={style.btn} onClick={() => onCancelBtnClicked()}>CANCEL</button>
        <h1 className={style.header}>PLEASE WAIT PLAYER 2 TO JOIN . . .</h1>
    </div>
}

export default WaitingScreen;