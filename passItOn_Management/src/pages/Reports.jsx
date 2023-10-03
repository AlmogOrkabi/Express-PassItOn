import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { getReports } from '../api';
import ReportCard from '../components/ReportCard';


export default function Reports() {
    const navigation = useNavigate();
    const [loading, setloading] = useState(false);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        loadReports()
    }, [])

    async function loadReports() {
        try {
            setloading(true);
            const reportslist = await getReports({ full: 'true' });
            setReports(reportslist);
            setloading(false);
        } catch (error) {
            console.log("error - reports " + error);
        }



    }

    return (
        <>
            <h1>דיווחי משתמשים</h1>

            <div>

                {
                    reports.map((item, index) => {
                        return <ReportCard report={item} key={index} />
                    })
                }
            </div>
        </>
    )
}
