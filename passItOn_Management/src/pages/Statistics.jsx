import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'

export default function Statistics() {
    const { loadUsers, users } = useContext(AppContext);

    useEffect(() => {
        getData();
    }, []);


    async function getData() {
        await loadUsers({ full: 'true' }).then(() => {
            console.log(users)
        });
    }

    return (
        <>
            <h1>סטטיסטיקות</h1>
        </>
    )
}
