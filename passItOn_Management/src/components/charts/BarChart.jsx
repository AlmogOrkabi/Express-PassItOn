import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as chartJS } from 'chart.js/auto'

export default function BarChart({ chartData, options = null }) {
    return (
        <>
            <div className='chart'>
                <Bar data={chartData} options={options} />
            </div>
        </>
    )
}
