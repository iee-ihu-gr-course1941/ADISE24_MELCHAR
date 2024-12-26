// import style from "./styling/App.module.css";
// import PlayerBoard from "./components/PlayerBoard";
// import Mainboard from "./components/MainBoard";

import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import RoomsScreen from "./components/RoomsScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen/>}/>
        <Route path="/registerScreen" element={<RegisterScreen/>}/>
        <Route path="/loginScreen" element={<LoginScreen/>}/>
        <Route path="/roomsScreen" element={<RoomsScreen/>}/>
      </Routes>
    </BrowserRouter>
    // <div className={style.container}>
    //   <div className={style.section1}>
    //     <PlayerBoard />
    //     <h2>Player 1</h2>
    //   </div>
    //   <div className={style.section2}>
    //     <div className={style.marginBottom}>
    //       <>
    //         <h1>Blokus</h1>
    //         <Mainboard />
    //       </>
    //     </div>
    //   </div>
    //   <div className={style.section3}>
    //     <PlayerBoard />
    //     <h2>Player 2</h2>
    //   </div>
    // </div>
  );
}

export default App;
