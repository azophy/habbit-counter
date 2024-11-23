'use client'

import React, { useState, useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import { addDays, subDays } from 'date-fns'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Checkbox } from '@/components/ui/checkbox'
import { DateRangePicker } from '@/components/ui/date-range-picker'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Habit {
  id: string
  name: string
  entries: { date: string; count: number }[]
}

export default function EvaluationPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 13),
    to: new Date(),
  })
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchHabitsAndData()
    }
  }, [dateRange])

  const fetchHabitsAndData = async () => {
    const startDate = dateRange.from!.toISOString().split('T')[0]
    const endDate = dateRange.to!.toISOString().split('T')[0]
    const response = await fetch(`/api/habits/evaluation?startDate=${startDate}&endDate=${endDate}`)
    const data = await response.json()
    setHabits(data)
    setSelectedHabits(data.map((h: Habit) => h.id))
  }

  const chartData = {
    labels: habits.length > 0 ? habits[0].entries.map((e) => e.date) : [],
    datasets: selectedHabits.map((habitId) => {
      const habit = habits.find((h) => h.id === habitId)
      return {
        label: habit?.name,
        data: habit?.entries.map((e) => e.count) || [],
        borderColor: `hsl(${parseInt(habitId) * 100}, 70%, 50%)`,
        tension: 0.1,
      }
    }),
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Habit Progress',
      },
    },
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Habit Evaluation</h1>
      <div className="mb-4">
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Habits to Display</h2>
        <div className="flex flex-wrap gap-4">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center space-x-2">
              <Checkbox
                id={habit.id}
                checked={selectedHabits.includes(habit.id)}
                onCheckedChange={(checked) => {
                  setSelectedHabits(
                    checked
                      ? [...selectedHabits, habit.id]
                      : selectedHabits.filter((id) => id !== habit.id)
                  )
                }}
              />
              <label htmlFor={habit.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {habit.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-[400px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

