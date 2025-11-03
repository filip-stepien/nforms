import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const data = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
        {
            label: 'Sprzedaż',
            data: [10, 25, 18, 35, 28, 45],
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.3,
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
        }
    ]
};

const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true
        }
    }
};

export function ResponsesChart() {
    return (
        <div className='h-[250px]'>
            <Line data={data} options={options} />
        </div>
    );
}
