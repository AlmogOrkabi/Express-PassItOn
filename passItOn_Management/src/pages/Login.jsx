import React from 'react'
import Logo from '../components/Logo'
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';


export default function Login() {
    const navigation = useNavigate();
    // navigation('/login')
    const { handleSubmit } = useForm();

    function userLogin(data) {
        let user = login(data.email, data.password);
        if (!user) {
            alert('משתמש לא קיים');
        }
        else if (user.role != 'admin') {
            alert('משתמש לא מורשה');
        }
        else {
            navigation(`/profile/${user.username}`);
        }
    }

    return (
        <>
            <div className='main-container'>
                <Logo></Logo>
                <div className='container-right'>
                    <h2 className='title'>התחברות</h2>
                    <form className='form login-form' onSubmit={handleSubmit}>
                        <TextField id="outlined-basic" label="כתובת אימייל" variant="outlined" />
                        <TextField id="outlined-basic" label="סיסמה" variant="outlined" />
                        <button className='btn btn-small align-center' >התחברות</button>
                    </form>
                </div>
            </div>
        </>
    )
}
