import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { getUsers } from '../api';
import Loading from '../components/Loading';
import UserCard from '../components/UserCard';
export default function Users() {

    const { users, setUsers } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);


    async function loadUsers() {
        try {
            setLoading(true);
            const res = await getUsers({});
            setUsers(() => res);


        } catch (error) {
            console.log("load users error: " + error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1>משתמשים</h1>
            {
                loading ? <Loading /> :
                    <div>
                        {
                            users.map((user, index) => { return <UserCard user={user} key={index} /> })
                        }
                    </div>
            }
        </>
    )
}
