import style from '../styling/LoginScreen.module.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginScreen(){

    const [formData, setFormData] = useState({ username: '', password: ''});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const goBack = () => {
        navigate('/')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(
                'https://users.iee.ihu.gr/~iee2020188/adise_php/login.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include'
                }
            );
    
            if (response.ok) {
                const result = await response.json();

                if (response.status === 200) {
                    navigate('/roomsScreen', { state: { player1_id: result.user_id } });
                } else {
                    setError(result.message || 'Unexpected response');
                }
            } else {
                const result = await response.json();
                setError(result.error || 'Something went wrong');
            }
        } catch (err) {
            console.log(err);
            setError('Failed to connect to the server.');
        }
    };
    

    return <div className={style.loginScreen}>
                <div className={style.background}></div>
                <h1 className={style.header}>LOGIN</h1>
                <form className={style.form} onSubmit={handleSubmit}>
                <div className={style.formElement}>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={style.formElement}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className={style.buttonContainer}>
                    <button type="button" onClick={goBack} className={style.regBtn}>GO BACK</button>
                    <button type="submit" className={style.regBtn}>LOGIN</button>
                </div>
                </form>
            </div>
}

export default LoginScreen;