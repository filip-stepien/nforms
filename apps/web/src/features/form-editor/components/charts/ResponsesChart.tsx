import React, { use } from 'react';
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
import { ResponsesChartData } from '../../lib/data';
import { Skeleton } from '@mantine/core';
import { Empty } from '@/components/Empty';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

type Props = {
    responsesChartData: Promise<ResponsesChartData[]>;
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
            beginAtZero: true,
            ticks: {
                stepSize: 1
            }
        }
    }
};

export function ResponsesChart({ responsesChartData: dataPromise }: Props) {
    const chartData = use(dataPromise);

    const data = {
        labels: chartData.map(({ label }) => label),
        datasets: [
            {
                label: 'Responses',
                data: chartData.map(({ value }) => value),
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.3,
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)'
            }
        ]
    };

    return (
        <div className='h-[250px]'>
            {chartData.every(({ value }) => value === 0) ? (
                <Empty />
            ) : (
                <Line data={data} options={options} />
            )}
        </div>
    );
}

ResponsesChart.Skeleton = function ResponsesChartSkeleton() {
    return <Skeleton className='h-[250px] w-full' />;
};
