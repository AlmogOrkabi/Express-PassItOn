import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import { CircularProgress } from '@mui/material';
import { getStatistics } from '../api';

export default function Statistics() {
    const { loadUsers, users } = useContext(AppContext);
    const [loading, setloading] = useState(false);

    useEffect(() => {
        getData();
    }, []);


    // async function getData() {
    //     try {
    //         setloading(true);
    //         await loadUsers({ full: 'true' })
    //         if (users && users.length > 0) {
    //             const filteredUsers = users.filter((user) => user.address && user.address.city);
    //             setUserData({
    //                 labels: [filteredUsers.map((user) => user.address.city)],
    //                 datasets: [{
    //                     label: 'מספר משתמשים לפי ערים',
    //                     data: filteredUsers.map((user) => user.address.city),
    //                 }]
    //             })
    //         }



    //     } catch (error) {
    //         console.log("statistics error: " + error)
    //     }
    //     finally {
    //         setloading(false);
    //     }


    // }


    // async function getData() {
    //     try {
    //         setloading(true);
    //         const res = await getStatistics({ type: 'usersByCity' })

    //         console.log(res)
    //         // if (res && res.length > 0) {
    //         //     const filteredUsers = users.filter((user) => user.address && user.address.city);
    //         //     setUserData({
    //         //         labels: [filteredUsers.map((user) => user.address.city)],
    //         //         datasets: [{
    //         //             label: 'מספר משתמשים לפי ערים',
    //         //             data: filteredUsers.map((user) => user.address.city),
    //         //         }]
    //         //     })
    //         // }
    //         if (res && res.length > 0) {
    //             setUserData({
    //                 labels: res.map((stat) => stat._id),
    //                 datasets: [{
    //                     label: 'מספר משתמשים לפי ערים',
    //                     data: res.map((stat) => stat.count),
    //                 }]
    //             })
    //         }


    //     } catch (error) {
    //         console.log("statistics error: " + error)
    //     }
    //     finally {
    //         setloading(false);
    //     }


    // }
    async function getData() {
        try {
            setloading(true);
            //const res = await getStatistics({ type: 'usersByCity' })
            const res = await getStatistics({ type: 'userStatus' })

            console.log(res)
            // if (res && res.length > 0) {
            //     const filteredUsers = users.filter((user) => user.address && user.address.city);
            //     setUserData({
            //         labels: [filteredUsers.map((user) => user.address.city)],
            //         datasets: [{
            //             label: 'מספר משתמשים לפי ערים',
            //             data: filteredUsers.map((user) => user.address.city),
            //         }]
            //     })
            // }
            if (res && res.length > 0) {
                setUserData({
                    labels: res.map((stat) => stat._id),
                    datasets: [{
                        label: 'משתמשים במערכת',
                        data: res.map((stat) => stat.count),
                    }]
                })
            }


        } catch (error) {
            console.log("statistics error: " + error)
        }
        finally {
            setloading(false);
        }


    }


    const [userData, setUserData] = useState(null)


    return (
        <>
            {loading ? <CircularProgress /> :
                (userData && (<div>
                    <h1>סטטיסטיקות</h1>
                    <div>
                        <BarChart chartData={userData} />
                    </div>
                </div>))
                // <div>
                //     <h1>סטטיסטיקות</h1>
                // </div>

            }
        </>
    )
}
