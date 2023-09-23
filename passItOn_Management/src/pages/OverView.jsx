import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'

export default function OverView() {
    const { loggedUser } = useContext(AppContext);

    return (

        <>
            <h1>loggedUser.username</h1>
        </>
    )
}
