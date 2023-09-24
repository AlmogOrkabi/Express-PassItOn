import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as chartJS } from 'chart.js/auto'

export default function PieChart({ chartData, options = null }) {
    return (
        <>
            <Pie data={chartData} options={options} />
        </>
    )
}
