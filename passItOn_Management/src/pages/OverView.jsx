import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom';

export default function OverView() {
    const { loggedUser } = useContext(AppContext);

    const navigation = useNavigate();

    useEffect(() => {
        console.log(loggedUser)
    }, [])


    return (
        <>
            <div className='main-container sub-container'>
                <h1 className='title'>ברוך הבא {loggedUser.username} </h1>
                <div className='sub-container'>


                    <div className='buttons-container'>
                        <button className='btn' onClick={() => { navigation('/reports') }}>דיווחים</button>
                        <button className='btn' onClick={() => { navigation('/users') }}>משתמשים</button>
                        <button className='btn' onClick={() => { navigation('/posts') }}>פוסטים</button>
                        <button className='btn'>בקשות</button>
                        <button className='btn'>סטטיסטיקות</button>

                    </div>
                </div>
            </div>

        </>
    )
}
