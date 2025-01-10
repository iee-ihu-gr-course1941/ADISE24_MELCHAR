import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import RoomsScreen from "./components/RoomsScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import GameScreen from "./components/GameScreen"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WaitingScreen from "./components/WaitingScreen";
import FinishedGameScreen from "./components/FinishedGameScreen";

function App() {
  return (
    <BrowserRouter basename="/~iee2020188">
      <Routes>
        <Route path="/" element={<WelcomeScreen/>}/>
        <Route path="/registerScreen" element={<RegisterScreen/>}/>
        <Route path="/loginScreen" element={<LoginScreen/>}/>
        <Route path="/roomsScreen" element={<RoomsScreen/>}/>
        <Route path="/gameScreen" element={<GameScreen/>}/>
        <Route path="/waitingScreen" element={<WaitingScreen/>}/>
        <Route path="/finishedGameScreen/:room_id" element={<FinishedGameScreen/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
