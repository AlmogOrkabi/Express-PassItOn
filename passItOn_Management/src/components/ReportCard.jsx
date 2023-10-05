import React from 'react'
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ReportCard({ report, index }) {

    const navigation = useNavigate();

    return (
        <>
            <div className='report-card'>
                <p>סטטוס: {report.status}</p>
                <p>תאריך יצירה: {new Date(report.creationDate).toLocaleDateString()}</p>
                <p>סוג דיווח: {report.reportType}</p>
                <p>תיאור: {report.description}</p>
                <p>המשתמש המדווח: {report.owner.username}</p>
                <IconButton className='btn-end' aria-label="open" onClick={() => { navigation(`/reports/${index}`,) }} >
                    <OpenInFullIcon />
                </IconButton>
            </div>
        </>
    )
}
