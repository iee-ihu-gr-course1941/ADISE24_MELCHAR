import style from '../styling/RegisterScreen.module.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterScreen(){

    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
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
                'https://users.iee.ihu.gr/~iee2020188/adise_php/register.php',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
                }
            );
    
            if (response.ok) {
                if (response.status === 201) {
                    navigate('/loginScreen');
                } else {
                    const result = await response.json();
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
    

    return <div className={style.registerScreen}>
                <div className={style.background}></div>
                <h1 className={style.header}>INSERT YOUR CREDENTIALS</h1>
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
                <div className={style.formElement}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className={style.buttonContainer}>
                    <button type="button" onClick={goBack} className={style.regBtn}>GO BACK</button>
                    <button type="submit" className={style.regBtn}>REGISTER</button>
                </div>
                </form>
            </div>
}

export default RegisterScreen;