import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const { date, increment } = await request.json()

  const habit = await prisma.habit.findUnique({ where: { id } })

  if (!habit) {
    return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
  }

  const entry = await prisma.entry.upsert({
    where: {
      habitId_date: {
        habitId: id,
        date: new Date(date),
      },
    },
    update: {
      count: { increment: increment ? 1 : -1 },
    },
    create: {
      habitId: id,
      date: new Date(date),
      count: increment ? 1 : 0,
    },
  })

  return NextResponse.json(entry)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  await prisma.entry.deleteMany({ where: { habitId: id } })
  const habit = await prisma.habit.delete({ where: { id } })

  return NextResponse.json(habit)
}

