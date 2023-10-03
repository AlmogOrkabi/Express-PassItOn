import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as chartJS } from 'chart.js/auto'

export default function PieChart({ chartData, options = null }) {
    return (
        <>
            <div className='chart'>
                <Pie data={chartData} options={options} />
            </div>
        </>
    )
}
