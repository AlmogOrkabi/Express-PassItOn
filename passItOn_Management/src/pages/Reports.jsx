import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { getReports } from '../api';
import ReportCard from '../components/ReportCard';
// import { CircularProgress } from '@mui/material';
import Loading from '../components/Loading';
import { AppContext } from '../contexts/AppContext';

export default function Reports() {
    const navigation = useNavigate();
    const [loading, setloading] = useState(false);

    const { reports, setReports, fetchUsers, fetchReports } = useContext(AppContext);


    useEffect(() => {
        loadReports()
    }, [])

    async function loadReports() {
        try {
            setloading(true);
            await fetchReports();
            // await fetchUsers();
            setloading(false);
        } catch (error) {
            console.log("error - reports: " + error);
        }
    }


    return (
        <>
            <h1>דיווחי משתמשים</h1>

            {
                loading ? <Loading />
                    :
                    <div>

                        {
                            reports.map((item, index) => {
                                return <ReportCard report={item} index={index} key={index} />
                            })
                        }
                    </div>
            }
        </>
    )
}
