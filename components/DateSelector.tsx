import React from 'react'
import { Calendar } from '@/components/ui/calendar'

interface DateSelectorProps {
  date: Date
  onDateChange: (date: Date) => void
}

export function DateSelector({ date, onDateChange }: DateSelectorProps) {
  return (
    <div className="mb-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => newDate && onDateChange(newDate)}
        className="rounded-md border"
      />
    </div>
  )
}

