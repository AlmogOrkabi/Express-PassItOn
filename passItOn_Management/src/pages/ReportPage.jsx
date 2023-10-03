import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext';

export default function ReportPage() {

    const { reports } = useContext(AppContext);

    const { index } = useParams();
    const [report, setReport] = useState(reports[index]);

    return (
        <>
            <h1>דף דיווח</h1>
            <p>סטטוס: {report.status}</p>
            <p>סוג דיווח: {report.reportType}</p>
            <p>תיאור: {report.description}</p>
            <p>המשתמש המדווח: {report.owner.username}</p>
        </>
    )
}
