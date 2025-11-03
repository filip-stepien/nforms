import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
        {
            label: 'Przykładowe dane',
            data: [300, 50, 100],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)'
            ],
            borderWidth: 1
        }
    ]
};

const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'left',
            labels: {
                padding: 20
            }
        },
        tooltip: {
            enabled: true
        }
    }
};

export function CategoriesChart() {
    return (
        <div className='h-[250px] max-w-[500px]'>
            <Pie data={data} options={options} />
        </div>
    );
}
