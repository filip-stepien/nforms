import React, { use } from 'react';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CategoriesChartData } from '../../lib/data';
import { Empty } from '@/components/Empty';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            ticks: {
                precision: 0
            }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: true
        }
    }
};

type Props = {
    categoriesChartData: Promise<CategoriesChartData[]>;
};

export function CategoriesChart({ categoriesChartData }: Props) {
    const dataRaw = use(categoriesChartData).toSorted(ctg => (ctg.categoryName === 'None' ? 1 : 0));

    const data: ChartData<'bar', number[], string> = {
        labels: dataRaw.map(item => item.categoryName),
        datasets: [
            {
                label: 'Number of respondents',
                data: dataRaw.map(item => item.count),
                backgroundColor: dataRaw.map(item => item.categoryColor),
                borderRadius: 5,
                maxBarThickness: 40
            }
        ]
    };

    return (
        <div className='h-[250px] w-full'>
            {dataRaw.length > 0 ? <Bar data={data} options={options} /> : <Empty />}
        </div>
    );
}
