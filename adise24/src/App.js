import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import RoomsScreen from "./components/RoomsScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import GameScreen from "./components/GameScreen"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen/>}/>
        <Route path="/registerScreen" element={<RegisterScreen/>}/>
        <Route path="/loginScreen" element={<LoginScreen/>}/>
        <Route path="/roomsScreen" element={<RoomsScreen/>}/>
        <Route path="/gameScreen" element={<GameScreen/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
