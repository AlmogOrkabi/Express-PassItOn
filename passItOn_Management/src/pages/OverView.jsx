import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

export default function OverView() {
    const { loggedUser, fetchReports, fetchUsers, fetchPosts } = useContext(AppContext);

    const [loading, setloading] = useState(false);


    const navigation = useNavigate();

    useEffect(() => {
        // loadAppData();
    }, [])


    return (
        <>
            {loading ? <Loading /> :
                <div className='main-container sub-container'>
                    <h1 className='title'>ברוך הבא {loggedUser.username} </h1>
                    <div className='sub-container'>


                        <div className='buttons-container'>
                            <button className='btn' onClick={() => { navigation('/reports') }}>דיווחים</button>
                            <button className='btn' onClick={() => { navigation('/users') }}>משתמשים</button>
                            <button className='btn' onClick={() => { navigation('/posts') }}>פוסטים</button>
                            <button className='btn' onClick={() => { navigation('/statistics') }}>סטטיסטיקות</button>

                        </div>
                    </div>
                </div>}

        </>
    )
}
