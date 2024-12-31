import { useState, useEffect } from "react";
import style from "../styling/RoomsScreen.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function RoomsScreen() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { player1_id } = location.state || {};
  const blocks = [
    {
      id: 1,
      cells: [
        {row: 1, col: 1},
      ]
    },
    {
      id: 2,
      cells: [
        {row: 1, col: 3},
        {row: 1, col: 4},
      ],
    },
    {
      id: 3,
      cells: [
        {row: 1, col: 6},
        {row: 1, col: 7},
        {row: 1, col: 8}
      ],
    },
    {
      id: 4,
      cells: [
        {row: 1, col: 10},
        {row: 1, col: 11},
        {row: 1, col: 12},
        {row: 1, col: 13}
      ],
    },
    {
      id: 5,
      cells: [
        {row: 3, col: 2},
        {row: 4, col: 1},
        {row: 4, col: 2},
      ],
    },
    {
      id: 6,
      cells: [
        {row: 2, col: 15},
        {row: 3, col: 15},
        {row: 3, col: 13},
        {row: 3, col: 14}
      ],
    },
    {
      id: 7,
      cells: [
        {row: 3, col: 4},
        {row: 3, col: 5},
        {row: 4, col: 4},
        {row: 4, col: 5}
      ],
    },
    {
      id: 8,
      cells: [
        {row: 3, col: 7},
        {row: 3, col: 8},
        {row: 4, col: 8},
        {row: 4, col: 9}
      ],
    },
    {
      id: 9,
      cells: [
        {row: 3, col: 11},
        {row: 4, col: 11},
        {row: 5, col: 11},
        {row: 6, col: 11},
        {row: 6, col: 12}
      ],
    },
  {
      id: 10,
      cells: [
        {row: 6, col: 1},
        {row: 6, col: 2},
        {row: 6, col: 3},
        {row: 7, col: 2}
      ],
    },
    {
      id: 11,
      cells: [
        {row: 6, col: 6},
        {row: 6, col: 7},
        {row: 7, col: 6},
        {row: 7, col: 5},
        {row: 8, col: 6}
      ],
    },
    {
      id: 12,
      cells: [
        {row: 5, col: 14},
        {row: 5, col: 15},
        {row: 6, col: 14},
        {row: 6, col: 15},
        {row: 7, col: 14}
      ],
    },
    {
      id: 13,
      cells: [
        {row: 6, col: 9},
        {row: 7, col: 9},
        {row: 8, col: 9},
        {row: 9, col: 9},
        {row: 10, col: 9}
      ],
    },
    {
      id: 14,
      cells: [
        {row: 8, col: 11},
        {row: 8, col: 12},
        {row: 9, col: 12},
        {row: 10, col: 12},
        {row: 10, col: 13}
      ]
    },
    {
      id: 15,
      cells: [
        {row: 10, col: 15},
        {row: 11, col: 15},
        {row: 12, col: 15},
        {row: 12, col: 14},
        {row: 12, col: 13}
      ]
    },
    {
      id: 16,
      cells: [
        {row: 15, col: 13},
        {row: 15, col: 14},
        {row: 15, col: 15},
        {row: 14, col: 13},
        {row: 14, col: 15}
      ]
    },
    {
      id: 17,
      cells: [
        {row: 15, col: 7},
        {row: 15, col: 8},
        {row: 14, col: 8},
        {row: 14, col: 9},
        {row: 13, col: 9}
      ]
    },
    {
      id: 18,
      cells: [
        {row: 10, col: 1},
        {row: 10, col: 2},
        {row: 9, col: 2},
        {row: 11, col: 2},
        {row: 10, col: 3}
  
      ]
    },
    {
      id: 19,
      cells: [
        {row: 13, col: 2},
        {row: 13, col: 1},
        {row: 13, col: 3},
        {row: 14, col: 2},
        {row: 15, col: 2}
      ]
    },
    {
      id: 20,
      cells: [
        {row: 15, col: 5},
        {row: 14, col: 5},
        {row: 13, col: 5},
        {row: 13, col: 6},
        {row: 12, col: 6}
      ]
    },
    {
      id: 21,
      cells: [
        {row: 12, col: 10},
        {row: 14, col: 11},
        {row: 13, col: 11},
        {row: 12, col: 11},
        {row: 11, col: 11}
      ]
    }
  ];

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
      } else {
        const result = await response.json();
        setError(result.error || "Failed to fetch rooms.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  const performLogOut = async (e) => {
    e.preventDefault();
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
  };

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
        navigate("/waitingScreen");
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
          navigate(`/gameScreen?room_id=${room_id}`);
      } else {
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
        console.log("success");
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
              <button onClick={() => onJoinBtnClick(room.room_id)} className={style.cardBtn}>JOIN</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RoomsScreen;
