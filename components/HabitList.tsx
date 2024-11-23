import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'

interface Habit {
  id: string
  name: string
  count: number
}

interface HabitListProps {
  habits: Habit[]
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
}

export function HabitList({ habits, onIncrement, onDecrement }: HabitListProps) {
  return (
    <ul className="space-y-4">
      {habits.map((habit) => (
        <li key={habit.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <span className="text-lg font-medium">{habit.name}</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => onDecrement(habit.id)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-bold">{habit.count}</span>
            <Button variant="outline" size="icon" onClick={() => onIncrement(habit.id)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

