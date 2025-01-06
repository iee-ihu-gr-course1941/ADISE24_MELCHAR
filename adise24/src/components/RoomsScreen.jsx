import { useState, useEffect, useCallback } from "react";
import style from "../styling/RoomsScreen.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import initializePlayerBlocks from "./helperFunctions/InitializePlayerBlocks.js";

function RoomsScreen() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { player1_id } = location.state || {};
  const blocks = initializePlayerBlocks();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setError("");
    try {
      const response = await fetch(
        "https://users.iee.ihu.gr/~iee2020188/adise_php/getAvailableRooms.php",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        setRooms(result.rooms || []);
      } else if(response.status === 401 || response.status === 403){
        navigate('/loginScreen', { state: { from: location } })
      } else {
        const result = await response.json();
        setError(result.error || "Failed to fetch rooms.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  const performLogOut = useCallback(
    async (e) => {
      if (e?.preventDefault) {
        e.preventDefault();
      }
      setError("");
      try {
        const response = await fetch(
          "https://users.iee.ihu.gr/~iee2020188/adise_php/logout.php",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (response.ok) {
          if (response.status === 200) {
            navigate("/");
          } else if (response.status === 401 || response.status === 403) {
            navigate("/loginScreen", { state: { from: location } });
          } else {
            const result = await response.json();
            setError(result.message || "Unexpected response");
          }
        } else {
          const result = await response.json();
          setError(result.error || "Logout has failed, please try again.");
        }
      } catch (err) {
        console.log(err);
        setError("Failed to connect to the server.");
      }
    },
    [navigate, location, setError]
  );

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
  
    const handlePopState = (e) => {
      e.preventDefault();
      const confirmed = window.confirm("Are you sure you want to go back? You will log out!");
      if (confirmed) {
        performLogOut();
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };
  
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [performLogOut]);

  const initializeRoom = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://users.iee.ihu.gr/~iee2020188/adise_php/createRoom.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ player1_id }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        navigate(`/waitingScreen?room_id=${result.room_id}`, {state: { player1_id: player1_id }});
      }else if(response.status === 401  || response.status === 403){
        navigate('/loginScreen', { state: { from: location } })
      } else {
        const result = await response.json();
        setError(result.error || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to connect to the server.");
    }
  };

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
          navigate(`/gameScreen?room_id=${room_id}`, {state: {player_id: player1_id}});
      } else if(response.status === 401 || response.status === 403){
        navigate('/loginScreen', { state: { from: location } })
      }else {
          const result = await response.json();
          setError(result.error || "Unknown error");
      }
    } catch (err) {
        console.log(err);
        setError("Failed to connect to the server.");
    }
  }

  const onJoinBtnClick = async (room_id) => {
    try{
      const response = await fetch(
        "https://users.iee.ihu.gr/~iee2020188/adise_php/player2Join.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_id: parseInt(room_id),
            player2_id: parseInt(player1_id)
          }),
          credentials: "include"
        }
      );

      if(response.ok){
        gameScreen(room_id);
      }else if(response.status === 401 || response.status === 403){
        navigate('/loginScreen', { state: { from: location } })
      }else{
        const result = await response.json();
        setError(result.error || "Unknown error");
      }
    }catch(err){
      console.log(err);
      setError("Failed to connect to the server.");
    }
  }

  return (
    <div className={style.screen}>
      <div className={style.header}>
        <h1 className={style.title}>Available Rooms</h1>
        <button onClick={initializeRoom} className={style.roomsBtn}>
          CREATE ROOM
        </button>
        <button onClick={performLogOut} className={style.roomsBtn}>
          LOGOUT
        </button>
      </div>
      <div className={style.roomsContainer}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul className={style.roomsList}>
          {rooms.map((room) => (
            <li className={style.roomCard} key={room.room_id}>
              <h3 className={style.roomId}>#{room.room_id}</h3>
              <img className={style.cardImg} src="/user.png" alt="user icon" />
              <p className={style.cardDesc}>{room.player2_id !== null ? '2/2' : '1/2'}</p>
              <button onClick={() => room.player2_id === null ? onJoinBtnClick(room.room_id) : setError("You cannot join. The room is full.")} className={style.cardBtn}>JOIN</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RoomsScreen;
