import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';


export default function Header() {
    const navigation = useNavigate();
    const location = useLocation();
    const hideHeaderOnPaths = ['/', '/Login'];


    if (hideHeaderOnPaths.includes(location.pathname)) {
        return null; // Don't render anything if the current path not be able to access the header
    }


    return (
        <>
            <div className='header-container'>
                <button className='logo-btn' onClick={() => navigation(`/Overview`)}>
                    <img className='logo-top' src='../public/pictures/bpio.png' />
                </button>
                <IconButton aria-label="delete" onClick={ }>
                    <LogoutIcon />
                </IconButton>
            </div>
        </>
    )
}
