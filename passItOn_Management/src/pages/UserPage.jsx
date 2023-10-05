import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext';
import { IconButton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { updateUserRole, updateUserStatus } from '../api';
import Loading from '../components/Loading';


export default function UserPage() {

    const { username } = useParams();
    const { users } = useContext(AppContext);
    const [user, setUser] = useState(users.find((u) => u.username === username));

    const [edit, setEdit] = useState(null);
    const [data, setData] = useState(null);
    const userStatuses = ['פעיל', 'לא פעיל', 'חסום']

    const [loading, setloading] = useState(false);

    function handleSelectStatus(e) {
        const selectedValue = event.target.value;
        setData((prev) => ({ ...prev, activationStatus: selectedValue }))
    }
    function handleSelectRole(e) {
        const selectedValue = event.target.value;
        setData((prev) => ({ ...prev, role: selectedValue }))
    }

    async function handleChanges() {
        try {
            setloading(true);
            let res1, res2;
            if (edit.activationStatus) {
                res1 = await updateUserStatus(user._id, data.activationStatus)
            }
            if (edit.role) {
                res2 = await updateUserRole(user._id, data.role);
            }
            if (res1)
                setUser((prev) => ({ ...prev, activationStatus: data.activationStatus }));
            if (res2)
                setUser((prev) => ({ ...prev, role: data.role }));


        } catch (error) {
            console.log("update user error: " + error)
        } finally {
            setloading(false);
        }
    }


    return (
        <>
            {loading ? <Loading /> :
                <div className='sub-container'>
                    <div>
                        <img className='user-pfp' src={user.photo ? user.photo.url : '../../public/Pictures/DefaultPfp.jpg'} />
                        <p>שם משתמש: {user.username}</p>
                        <p>שם פרטי: {user.firstName}</p>
                        <p>שם משפחה: {user.lastName}</p>
                        <p>כתובת מייל: {user.email}</p>
                        <p>מספר טלפון: {user.phoneNumber}</p>
                        {edit && edit.activationStatus ?
                            <div>
                                <label for="status">סוג משתמש: </label>

                                <select name="status" id="status" onChange={(e) => handleSelectStatus(e)}>


                                    {
                                        userStatuses.map((s, index) => { return <option value={s} key={index}>{s}</option> })

                                    }




                                </select>
                                <IconButton aria-label="cancel" onClick={() => { setEdit((prev) => ({ ...prev, activationStatus: false })) }}>
                                    <ClearIcon />
                                </IconButton>
                            </div>
                            :
                            <p>סטטוס פעילות: {user.activationStatus} <IconButton aria-label="cancel" onClick={() => setEdit((prev) => ({ ...prev, activationStatus: true }))} >
                                <EditIcon />
                            </IconButton></p>}
                        {edit && edit.role ?
                            <div>
                                <label for="role">סוג משתמש: </label>

                                <select name="role" id="role" onChange={(e) => handleSelectStatus(e)}>

                                    <option value={'user'}>user</option>
                                    <option value={'admin'}>admin</option>



                                </select>
                                <IconButton aria-label="cancel" onClick={() => { setEdit((prev) => ({ ...prev, role: false })) }}>
                                    <ClearIcon />
                                </IconButton>
                            </div>
                            :
                            <p> סוג משתמש: {user.role} <IconButton aria-label="cancel" onClick={() => setEdit((prev) => ({ ...prev, role: true }))} >
                                <EditIcon />
                            </IconButton></p>
                        }
                        <p>מספר טלפון: {user.phoneNumber}</p>

                        {edit && (edit.role || edit.activationStatus) ? <button className='btn' onClick={() => handleChanges()}  >שמור שינויים</button> : null}
                    </div>
                    {/* <div>
                    <button className='btn' onClick={() => setEdit({ activationStatus: true })}>שינוי סטטוס</button>
                    <button className='btn'>שינוי סוג משתמש</button>
                </div> */}
                </div>}
        </>
    )
}
