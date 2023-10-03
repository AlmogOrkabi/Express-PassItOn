import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import CountBox from '../components/CountBox';

import { CircularProgress } from '@mui/material';
import { getUsersStatistics, getPostsStatistics } from '../api';

export default function Statistics() {
    const { loadUsers, users } = useContext(AppContext);
    const [loading, setloading] = useState(false);


    const [userData, setUserData] = useState(null)
    const [postData, setPostData] = useState(null)





    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        try {
            setloading(true);
            //const res = await getStatistics({ type: 'usersByCity' })
            await userStatus();
            await usersPosted();
            await getPostsByCategory();
            await postsByCity();
            await postsDelivered();

        } catch (error) {
            console.log("statistics error: " + error)
        }
        finally {
            setloading(false);
        }


    }



    // async function userStatus() {
    //     try {

    //         const res = await getUsersStatistics({ type: 'userStatus' })

    //         console.log(res)

    //         if (res && res.length > 0) {
    //             setUserData({
    //                 labels: res.map((stat) => stat._id),
    //                 datasets: [{
    //                     label: 'משתמשים במערכת',
    //                     data: res.map((stat) => stat.count),
    //                 }]
    //             })
    //         }
    //     } catch (error) {
    //         console.log("error1 : " + error)
    //     }
    // }



    // { text => setAddress((prev) => ({ ...prev, notes: text })) }


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
            }

        } catch (error) {
            console.log("error4 : " + error.error)
        }
    }


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
                <div className='main-container'>
                    <h1>סטטיסטיקות</h1>

                    <div className='countbox-container'>

                        <CountBox title={'סה"כ משתמשים רשומים במערכת:'} amount={15} />
                        <CountBox title={'סה"כ משתמשים רשומים במערכת:'} amount={15} />
                        <CountBox title={'סה"כ משתמשים רשומים במערכת:'} amount={15} />

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
