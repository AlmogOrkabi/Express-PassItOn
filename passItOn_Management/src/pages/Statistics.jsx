import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import CountBox from '../components/CountBox';

import { CircularProgress } from '@mui/material';
import { getUsersStatistics, getPostsStatistics, amountOfUsers, amountOfPosts } from '../api';

export default function Statistics() {
    const { loadUsers, users } = useContext(AppContext);
    const [loading, setloading] = useState(false);


    const [userData, setUserData] = useState(null)
    const [postData, setPostData] = useState(null)
    const [countData, setCountData] = useState([])





    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            setloading(true);
            await userStatus();
            await usersPosted();
            await getPostsByCategory();
            await postsByCity();
            await postsDelivered();
            await getNumbers();

        } catch (error) {
            console.log("statistics error: " + error)
        }
        finally {
            setloading(false);
        }


    }

    async function getNumbers() {
        try {
            const users = await amountOfUsers();
            const posts = await amountOfPosts();


            if (!countData.some(item => item.title == 'משתמשים רשומים')) {
                setCountData((prev) => ([...prev, { title: 'משתמשים רשומים', amount: users }]));
            }
            if (!countData.some(item => item.title == 'פוסטים במערכת')) {
                setCountData((prev) => ([...prev, { title: 'פוסטים במערכת', amount: posts }]));
            }



        } catch (error) {
            console.log("error6 : " + error)
        }
    }

    async function userStatus() {
        try {

            const res = await getUsersStatistics({ type: 'userStatus' })

            console.log(res)

            if (res && res.length > 0) {

                const data = {
                    labels: res.map((stat) => stat._id),
                    datasets: [{
                        label: 'משתמשים במערכת',
                        data: res.map((stat) => stat.count),
                    }]
                }

                setUserData((prev) => ({ ...prev, byStatus: data }))
            }

            console.log("userData", userData)

        } catch (error) {
            console.log("error1 : " + error)
        }
    }
    async function usersPosted() {
        try {

            const res = await getUsersStatistics({ type: 'userPosts' })

            console.log(res)

            if (res && res.length > 0) {

                const data = {
                    labels: res.map((stat) => stat._id.hasPosted == 'Has Not Posted' ? 'לא פירסמו פריטים' : 'כן פירסמו פריטים'),
                    datasets: [{
                        label: 'משתמשים שפירסמו פוסטים',
                        data: res.map((stat) => stat.count),
                    }]
                }

                setUserData((prev) => ({ ...prev, byPosts: data }))
            }

            console.log("userData", userData)

        } catch (error) {
            console.log("error4 : " + error)
        }
    }

    async function getPostsByCategory() {
        try {
            const res = await getPostsStatistics({ type: 'postsByCategory' })

            console.log(res)

            if (res && res.length > 0) {
                const data = {
                    labels: res.map((stat) => stat._id),
                    datasets: [{
                        label: 'פריטים שפורסמו לפי קטגוריה',
                        data: res.map((stat) => stat.count),
                    }
                    ]
                }
                setPostData((prev) => ({ ...prev, byCategory: data }))
            }

        } catch (error) {
            console.log("error2 : " + error.error)
        }
    }

    async function postsByCity() {
        try {
            const res = await getPostsStatistics({ type: 'postsByCity' })

            console.log(res)
            if (res && res.length > 0) {
                const data = {
                    labels: res.map((stat) => stat._id),
                    datasets: [{
                        label: 'פריטים שפורסמו לפי עיר',
                        data: res.map((stat) => stat.count),
                    }]
                }
                setPostData((prev) => ({ ...prev, byCity: data }))
            }

        } catch (error) {
            console.log("error3 : " + error.error)
        }
    }


    async function postsDelivered() {
        try {

            console.log("postsDelivered called");

            const res = await getPostsStatistics({ type: 'postsDelivered' })

            console.log(res)
            if (res && res.length > 0) {
                const data = {
                    labels: res.map((stat) => stat._id),
                    datasets: [{
                        label: 'פריטים שנמסרו בפועל',
                        data: res.map((stat) => stat.count),
                    }]
                }
                setPostData((prev) => ({ ...prev, byDelivered: data }))

                // setCountData((prev) => ([...prev, { title: 'פריטים שנמסרו', amount: res[1].count }]));
                // !for dev purposes only (hot-reloading while saving changes)
                if (!countData.some(item => item.title == 'פריטים שנמסרו')) {
                    setCountData((prev) => ([...prev, { title: 'פריטים שנמסרו', amount: res[1].count }]));
                }


            }

        } catch (error) {
            console.log("error4 : " + error.error)
        }
    }


    return (
        <>
            {loading ? <CircularProgress /> :
                <div className='main-container'>
                    <h1>סטטיסטיקות</h1>

                    <div className='countbox-container'>

                        {
                            countData.map((item, index) => {
                                return <CountBox title={item.title} amount={item.amount} key={index} />
                            })
                        }

                    </div>



                    <div className='statistics-container'>
                        <h3>סטטיסטיקות משתמשים:</h3>
                        <div className='charts-container'>
                            {userData && userData.byStatus &&
                                <BarChart chartData={userData.byStatus} className='chart' />
                            }
                            {userData && userData.byPosts &&
                                <BarChart chartData={userData.byPosts} className='chart' />
                            }
                        </div>
                    </div>


                    <div className='statistics-container'>
                        <h3>סטטיסטיקות פוסטים:</h3>
                        <div className='charts-container'>
                            {postData && postData.byCity && <BarChart chartData={postData.byCity} />}
                            {postData && postData.byCategory && <BarChart chartData={postData.byCategory} />}
                            {postData && postData.byDelivered && <BarChart chartData={postData.byDelivered} />}
                        </div>
                    </div>

                </div>
            }

        </>
    )
}
