import React, { useState, useEffect, useContext } from 'react'
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UserCard({ user }) {

    const navigation = useNavigate();

    return (
        <>
            <div className='user-card-container box-shadow-card'>
                <img className='user-pfp-small' src={user.photo ? user.photo.url : '../../public/Pictures/DefaultPfp.jpg'} />
                <div className='card-details-container'>
                    <p>שם משתמש: {user.username}</p>
                    <p>שם מלא: {user.firstName + ' ' + user.lastName}</p>
                    <p>כתובת מייל: {user.email}</p>
                    <p>סטטוס פעילות: {user.activationStatus}</p>
                </div>
                <IconButton className='btn-end' aria-label="open" onClick={() => { navigation(`/users/${user.username}`) }} >
                    <OpenInFullIcon />
                </IconButton>
            </div>
        </>
    )
}
