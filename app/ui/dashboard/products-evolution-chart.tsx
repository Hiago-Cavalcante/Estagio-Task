'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { useEffect, useState } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

ChartJS.defaults.font.family = 'Lusitana, serif'
ChartJS.defaults.font.weight = 400

interface ProductsEvolutionData {
  month: string
  count: number
}

interface ProductsEvolutionChartProps {
  data: ProductsEvolutionData[]
}

export default function ProductsEvolutionChart({
  data,
}: ProductsEvolutionChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: 'Products Created',
        data: data.map((item) => item.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Products Created Over Time',
        font: {
          family: 'Lusitana, serif',
          size: 20,
          weight: 400,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context: { parsed: { y: number } }) {
            return `Products: ${context.parsed.y}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Number of Products',
        },
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  }

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="w-full h-[400px] md:h-[500px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
