import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { getReports } from '../api';
import ReportCard from '../components/ReportCard';
// import { CircularProgress } from '@mui/material';
import Loading from '../components/Loading';
import { AppContext } from '../contexts/AppContext';

import useErrorHandler from '../hooks/useErrorHandler';

export default function Reports() {
    const navigation = useNavigate();
    const [loading, setloading] = useState(false);

    const { reports, setReports, fetchUsers, fetchReports } = useContext(AppContext);

    const [currentReports, setCurrentReports] = useState([]);
    const [reportStatus, setReportStatus] = useState('all');

    const handleError = useErrorHandler()

    useEffect(() => {
        loadReports()
    }, [])

    async function loadReports() {
        try {
            setloading(true);
            await fetchReports();
            // await fetchUsers();
            setCurrentReports(() => reports)
            setloading(false);
        } catch (error) {
            console.log("error - reports: " + error);
            handleError(error);
        }
    }

    useEffect(() => {
        console.log(reportStatus);
        filterReports();
    }, [reportStatus])
    useEffect(() => {
        console.log(currentReports);
    }, [currentReports])

    const handleRadioBtnChange = (e) => {
        setReportStatus(e.target.value);
    }

    const filterReports = () => {
        console.log("reports =>" + reports)
        console.log("currentReports =>" + currentReports)

        // if (reportStatus === 'all') {
        //     setCurrentReports(reports);
        // }

        switch (reportStatus) {
            case 'all':
                setCurrentReports(reports);
                break;
            case 'בטיפול':
                setCurrentReports(reports.filter((r) =>
                    r.status !== 'פתוח' && r.status !== 'סגור'
                ))
                break;
            default:
                setCurrentReports(reports.filter((r) =>
                    r.status === reportStatus
                ))
                break;
        }

    }


    return (
        <>
            <div className='main-container2'>
                <h1>דיווחי משתמשים</h1>

                {
                    loading ? <Loading />
                        :
                        <div>

                            <form className='flex-row margin-block'>
                                <input type="radio" id="all" name="status" value="all" onChange={(e) => handleRadioBtnChange(e)}></input>
                                <label htmlFor="all">הכל</label>
                                <input type="radio" id="open" name="status" value="פתוח" onChange={(e) => handleRadioBtnChange(e)}></input>
                                <label htmlFor="inactive">פתוח</label>
                                <input type="radio" id="in-process" name="status" value="בטיפול" onChange={(e) => handleRadioBtnChange(e)}></input>
                                <label htmlFor="banned">בטיפול</label>
                                <input type="radio" id="closed" name="status" value="סגור" onChange={(e) => handleRadioBtnChange(e)}></input>
                                <label htmlFor="banned">סגור</label>
                            </form>



                            {
                                Array.isArray(currentReports) && currentReports.length > 0 ?

                                    currentReports.map((item, index) => {
                                        return <ReportCard report={item} _id={item._id} key={index} />
                                    })

                                    :

                                    <h3>
                                        לא נמצאו דיווחים מתאימים
                                    </h3>
                            }
                        </div>
                }
            </div>
        </>
    )
}
