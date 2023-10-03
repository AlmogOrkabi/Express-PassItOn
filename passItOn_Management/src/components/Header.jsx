import React, { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { userLogOut } from '../api';
import { AppContext } from '../contexts/AppContext';

export default function Header() {
    const navigation = useNavigate();
    const location = useLocation();
    const hideHeaderOnPaths = ['/', '/Login'];

    const { setLoggedUser } = useContext(AppContext);;

    if (hideHeaderOnPaths.includes(location.pathname)) {
        return null; // Don't render anything if the current path not be able to access the header
    }

    const handleLogout = async () => {
        try {
            const res = await userLogOut();
            setLoggedUser((prev) => null);
            navigation('/');

        } catch (error) {
            console.log("logout error", error);
        }
    };


    return (
        <>
            <div className='header-container'>
                <button className='logo-btn' onClick={() => navigation(`/Overview`)}>
                    <img className='logo-top' src='../public/pictures/bpio.png' />
                </button>
                <IconButton aria-label="delete" onClick={() => handleLogout()}>
                    <LogoutIcon />
                </IconButton>
            </div>
        </>
    )
}
