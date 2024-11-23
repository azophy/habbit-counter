'use client'

import React, { useState, useEffect } from 'react'
import { DateSelector } from '@/components/DateSelector'
import { HabitList } from '@/components/HabitList'

interface Habit {
  id: string
  name: string
  count: number
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    fetchHabits(selectedDate)
  }, [selectedDate])

  const fetchHabits = async (date: Date) => {
    const response = await fetch(`/api/habits?date=${date.toISOString().split('T')[0]}`)
    const data = await response.json()
    setHabits(data)
  }

  const updateHabit = async (id: string, increment: boolean) => {
    const response = await fetch(`/api/habits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate.toISOString().split('T')[0], increment }),
    })

    if (response.ok) {
      fetchHabits(selectedDate)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Daily Habit Tracker</h1>
      <DateSelector date={selectedDate} onDateChange={setSelectedDate} />
      <HabitList
        habits={habits}
        onIncrement={(id) => updateHabit(id, true)}
        onDecrement={(id) => updateHabit(id, false)}
      />
    </div>
  )
}

