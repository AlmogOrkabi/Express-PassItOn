import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as chartjs } from 'chartjs/auto'

export default function BarChart({ chartData, options = null }) {
    return (
        <>
            <Bar data={chartData} options={options} />
        </>
    )
}
