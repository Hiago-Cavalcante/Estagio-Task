'use client'

import { Bar, Chart } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { ProductsChartProps } from '@/app/lib/definitions'

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Set the font family directly as a string, e.g., 'Lusitana, sans-serif'
ChartJS.defaults.font.family = 'Lusitana, sans-serif'
ChartJS.defaults.font.weight = 400

export default function ProductsChart({ data }: ProductsChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        label: 'Quantidade de Produtos',
        data: data.map((item) => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
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
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Products Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Categories',
        },
      },
    },
  }

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="w-full h-[400px] md:h-[500px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
