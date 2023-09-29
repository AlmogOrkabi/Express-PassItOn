import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import { CircularProgress } from '@mui/material';
import { getUsersStatistics, getPostsStatistics } from '../api';

export default function Statistics() {
    const { loadUsers, users } = useContext(AppContext);
    const [loading, setloading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            setloading(true);
            //const res = await getStatistics({ type: 'usersByCity' })
            await userStatus();
            await postsByCategory();

        } catch (error) {
            console.log("statistics error: " + error)
        }
        finally {
            setloading(false);
        }


    }

    async function userStatus() {
        try {
            const res = await getUsersStatistics({ type: 'userStatus' })

            console.log(res)

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
            console.log("error1 : " + error)
        }
    }

    async function postsByCategory() {
        try {
            const res = await getPostsStatistics({ type: 'postsByCategory' })

            console.log(res)

            if (res && res.length > 0) {
                setPostData({
                    labels: res.map((stat) => stat._id),
                    datasets: [{
                        label: 'פריטים שפורסמו לפי קטגוריה',
                        data: res.map((stat) => stat.count),
                    }]
                })
            }
        } catch (error) {
            console.log("error2 : " + error)
        }
    }


    const [userData, setUserData] = useState(null)
    const [postData, setPostData] = useState(null)


    return (
        <>
            {/* {loading ? <CircularProgress /> :
                (userData && (<div>
                    <h1>סטטיסטיקות</h1>
                    <div>
                        <BarChart chartData={userData} />
                    </div>
                </div>)
                )
                // <div>
                //     <h1>סטטיסטיקות</h1>
                // </div>

            } */}


            {loading ? <CircularProgress /> :
                <div>
                    <h1>סטטיסטיקות</h1>
                    {userData &&
                        <BarChart chartData={userData} />
                    }
                    {postData && <BarChart chartData={postData} />}
                </div>
            }

        </>
    )
}
