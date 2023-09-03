import React from 'react'
import Logo from '../components/Logo'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <>
            <div className='main-container'>
                <Logo />
                <h1>מערכת ניהול משתמשים</h1>
                {/* <Button className='btn btn-login' variant="contained">התחברות</Button> */}
                <Link to='/Login' className='link'><button className='btn'>התחברות</button></Link>
            </div >
        </>
    )
}
