/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import Logo from '../components/Logo'
import { TextField, CircularProgress, InputAdornment, IconButton, Input, OutlinedInput, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { login } from '../api/index';
import { AppContext } from '../contexts/AppContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Loading from '../components/Loading';
//import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
    const navigation = useNavigate();
    // navigation('/login')
    const { handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
    })
    const [err, setErr] = useState(null);

    const { setLoggedUser, loadAppData } = useContext(AppContext)

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    async function userLogin() {
        try {
            setLoading(true)
            setErr(null);
            const res = await login(inputs.email, inputs.password);
            setLoggedUser(res);

            await loadAppData();
            //navigation(`/profile/${user.username}`);
            navigation(`/Overview`)

        } catch (error) {
            console.log(error)
            setErr(error)
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? <Loading /> :
                <div className='main-container'>
                    <Logo />
                    <div className='sub-container'>
                        <h2 className='title align-center'>התחברות</h2>
                        <form className='form login-form   align-center' onSubmit={handleSubmit(userLogin)}>
                            <InputLabel htmlFor="email">כתובת אימייל</InputLabel>
                            <OutlinedInput id="email" type="email"
                                value={inputs.email}
                                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                            />

                            <InputLabel htmlFor="password">סיסמה</InputLabel>
                            <OutlinedInput id="password"
                                value={inputs.password}
                                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <button className='btn btn-small align-center'>התחברות</button>
                            <h3 className='errMsg'>{err ? err.msg : null}</h3>
                        </form>
                    </div>
                </div>}
        </>
    )
}
