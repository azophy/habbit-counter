import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
  }

  const habits = await prisma.habit.findMany({
    include: {
      entries: {
        where: {
          date: new Date(date),
        },
      },
    },
  })

  const formattedHabits = habits.map(habit => ({
    id: habit.id,
    name: habit.name,
    count: habit.entries[0]?.count || 0,
  }))

  return NextResponse.json(formattedHabits)
}

export async function POST(request: Request) {
  const { name } = await request.json()

  const habit = await prisma.habit.create({
    data: { name },
  })

  return NextResponse.json(habit)
}

