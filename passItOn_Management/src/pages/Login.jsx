/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import Logo from '../components/Logo'
import { TextField, CircularProgress } from '@mui/material';
//import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { login } from '../api/index';
import { AppContext } from '../contexts/AppContext';


export default function Login({ navigation }) {
    // const navigation = useNavigate();
    // navigation('/login')
    const { handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);


    async function userLogin(data) {
        console.log("data : " + { ...data })
        try {
            setLoading(true)
            let user = await login(data.email, data.password);
            if (!user) {
                alert('משתמש לא קיים');
            }
            else if (user.role != 'admin') {
                alert('משתמש לא מורשה');
            }
            else {

                //navigation(`/profile/${user.username}`);
                navigation.navigate(`OverView`)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? <CircularProgress /> :
                <div className='main-container'>
                    <Logo></Logo>
                    <div className='container-right'>
                        <h2 className='title'>התחברות</h2>
                        <form className='form login-form' onSubmit={handleSubmit(userLogin)}>
                            <TextField id="email" label="כתובת אימייל" variant="outlined" type="email" />
                            <TextField id="password" label="סיסמה" variant="outlined" type="password" />
                            <button className='btn btn-small align-center'>התחברות</button>
                        </form>
                    </div>
                </div>}
        </>
    )
}
