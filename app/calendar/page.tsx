"use client";
import Calendar from '../../components/Calendar'
import Header from '../../components/Header'

export default function CalendarPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Header />
      <h1 className="text-2xl font-bold mb-4 text-center">Events Calendar</h1>
      <Calendar />
    </main>
  )
}