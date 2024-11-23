import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 })
  }

  const habits = await prisma.habit.findMany({
    include: {
      entries: {
        where: {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      },
    },
  })

  const formattedData = habits.map(habit => ({
    id: habit.id,
    name: habit.name,
    entries: habit.entries.map(entry => ({
      date: entry.date.toISOString().split('T')[0],
      count: entry.count,
    })),
  }))

  return NextResponse.json(formattedData)
}

