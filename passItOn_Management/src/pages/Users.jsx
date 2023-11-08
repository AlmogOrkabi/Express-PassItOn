import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { getUsers } from '../api';
import Loading from '../components/Loading';
import UserCard from '../components/UserCard';

import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

export default function Users() {

    const navigate = useNavigate();

    const { users, setUsers, fetchUsers } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [currentUsers, setCurrentUsers] = useState(users);
    const [searchBy, setSearchBy] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [activationStatus, setActivationStatus] = useState('all');

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        console.log(searchQuery)
    }, [searchQuery]);
    useEffect(() => {
        console.log("radio button changed: " + activationStatus)
        filterUsers();
    }, [activationStatus]);
    useEffect(() => {
        console.log(" searchBy changed: " + searchBy)
    }, [searchBy]);


    async function loadUsers() {
        try {
            setLoading(true);
            await fetchUsers();
        } catch (error) {
            console.log("load users error: " + error)
        } finally {
            setLoading(false);
        }
    }

    const handleRadioBtnChange = (e) => {

        setActivationStatus(e.target.value);

        //filterUsers();

        //filterByStatus();

    }

    // const filterByStatus = () => {


    //     if (activationStatus === 'all') {

    //         setCurrentUsers(users);
    //         if (searchQuery !== '')
    //             filterUsers();
    //         else
    //             return;

    //     }


    //     else {
    //         filterUsers();
    //         setCurrentUsers(currentUsers.filter((u) => u.activationStatus === activationStatus))
    //     }

    // }

    const filterUsers = () => {
        const usersByStatus = filterByStatus();
        const filteredUsers = filterByQuery(usersByStatus);
        setCurrentUsers((prev) => filteredUsers);

    }

    const filterByStatus = () => {


        if (activationStatus === 'all')
            return users;
        else
            return users.filter((u) => u.activationStatus === activationStatus);
    }



    const filterByQuery = (toFilter) => {

        //if (searchQuery === '') filterByStatus();
        if (searchQuery === '') return toFilter;

        let filteredUsers;

        switch (searchBy) {
            case 'name':
                filteredUsers = toFilter.filter((u) => {
                    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
                    return fullName.includes(searchQuery) ||
                        u.firstName.toLowerCase().includes(searchQuery) ||
                        u.lastName.toLowerCase().includes(searchQuery);
                });
                break;

            case 'username':
                filteredUsers = toFilter.filter((u) => u.username == searchQuery);
                break;
            case 'ID':
                filteredUsers = toFilter.filter((u) => u._id == searchQuery);
                break;
            default:
                return;
        }

        return filteredUsers;

    }




    return (
        <div className='main-container2'>

            <h1>משתמשים</h1>

            <div className='flex-row margin-block input-container '>
                <IconButton className='input-icon' aria-label='search-users' onClick={() => filterUsers()}>
                    <SearchIcon />
                </IconButton>
                <input className='round-input' type='search' placeholder='חיפוש' onChange={(e) => { setSearchQuery((prev) => e.target.value) }}></input>

                <select className='select-style' aria-label='search-options' onChange={(e) => setSearchBy((prev) => e.target.value)}>
                    <option value='name'>שם</option>
                    <option value='username'>שם משתמש</option>
                    <option value='ID'>ID</option>
                </select>

            </div>

            <form className='flex-row margin-block'>
                <input type="radio" id="all" name="activation-status" value="all" onChange={(e) => handleRadioBtnChange(e)}></input>
                <label htmlFor="all">הכל</label>
                <input type="radio" id="inactive" name="activation-status" value="לא פעיל" onChange={(e) => handleRadioBtnChange(e)}></input>
                <label htmlFor="inactive">לא פעיל</label>
                <input type="radio" id="banned" name="activation-status" value="חסום" onChange={(e) => handleRadioBtnChange(e)}></input>
                <label htmlFor="banned">חסום</label>
            </form>



            {
                loading ? <Loading /> :
                    <div className='cards-container'>
                        {
                            Array.isArray(currentUsers) && currentUsers.length > 0 ?
                                currentUsers.map((user, index) => { return <UserCard user={user} key={index} /> })
                                :
                                <h3>
                                    לא נמצאו משתמשים מתאימים
                                </h3>
                        }
                    </div>
            }
        </div>
    )
}
