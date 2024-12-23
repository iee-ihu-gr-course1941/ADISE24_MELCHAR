import { useNavigate } from 'react-router-dom';
import style from '../styling/WelcomeScreen.module.css'

function WelcomeScreen(){

    const navigate = useNavigate();
    const goToRegisterScreen = () => {
        navigate("/registerScreen");
    }

    return <div className={style.welcomeScreen}>
                <div className={style.background}></div>
                <h1 className={style.header}>WELCOME TO BLOKUS!</h1>
                <div className={style.buttonsContainer}>
                    <button className={style.wsBtn}>LOGIN</button>
                    <button className={style.wsBtn} onClick={goToRegisterScreen}>REGISTER</button>
                    <button className={style.wsBtn}>CONTINUE AS GUEST</button>
                </div>
            </div>
}

export default WelcomeScreen;