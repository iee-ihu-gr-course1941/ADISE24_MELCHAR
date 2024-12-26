import { useNavigate } from 'react-router-dom';
import style from '../styling/WelcomeScreen.module.css'

function WelcomeScreen(){

    const navigate = useNavigate();

    const goToRegisterScreen = () => {
        navigate("/registerScreen");
    }

    const goToLoginScreen = () => {
        navigate("/loginScreen");
    }

    return <div className={style.welcomeScreen}>
                <div className={style.background}></div>
                <h1 className={style.header}>WELCOME TO BLOKUS!</h1>
                <div className={style.buttonsContainer}>
                    <button className={style.wsBtn} onClick={goToLoginScreen}>LOGIN</button>
                    <button className={style.wsBtn} onClick={goToRegisterScreen}>REGISTER</button>
                </div>
            </div>
}

export default WelcomeScreen;