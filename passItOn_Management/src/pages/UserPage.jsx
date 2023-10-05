import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext';

export default function UserPage() {

    const { username } = useParams();
    const { users } = useContext(AppContext);
    const [user, setUsers] = useState(users.find((u) => u.username === username));
    return (
        <>
            <div className='sub-container'>
                <div>
                    <img className='user-pfp' src={user.photo ? user.photo.url : '../../public/Pictures/DefaultPfp.jpg'} />
                    <p>שם משתמש: {user.username}</p>
                    <p>שם פרטי: {user.firstName}</p>
                    <p>שם משפחה: {user.lastName}</p>
                    <p>כתובת מייל: {user.email}</p>
                    <p>מספר טלפון: {user.phoneNumber}</p>
                    <p>סטטוס פעילות: {user.activationStatus}</p>
                    <p> סוג משתמש: {user.role}</p>
                    <p>מספר טלפון: {user.phoneNumber}</p>
                </div>
                <div>
                    <button className='btn'>שינוי סטטוס</button>
                    <button className='btn'>שינוי סוג משתמש</button>
                </div>
            </div>
        </>
    )
}
