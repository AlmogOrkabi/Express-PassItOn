import React from 'react'

export default function ReportCard({ report }) {
    return (
        <>
            <div className='report-card'>
                <p>סטטוס: {report.status}</p>
                <p>תאריך יצירה: {new Date(report.creationDate).toLocaleDateString()}</p>
                <p>סוג דיווח: {report.reportType}</p>
                <p>תיאור: {report.description}</p>
            </div>
        </>
    )
}
