'use client'
import React, { useState } from 'react'
import classnames from 'classnames'

import styles from '../styles/Calendar.module.css'

export interface Event {
  id: string
  name: string
  dueDate: string
  theme:
    | 'pikachu' // yellow / black
    | 'charmander' // red / yellow
    | 'bulbasaur' // green / yellow
}

export const CalendarClient = ({ events }: { events: Event[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value, 10)
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1))
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value, 10)
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1))
  }

  const renderCalendarGrid = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const today = new Date()

    const grid = []

    // Add days of the week header
    for (let i = 0; i < daysOfWeek.length; i++) {
      grid.push(
        <div key={`day-${i}`} className={styles.dayOfWeek}>
          {daysOfWeek[i]}
        </div>,
      )
    }

    // Add empty days for the first week
    const prevMonthLastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0,
    ).getDate()

    for (let i = 0; i < startDay; i++) {
      grid.push(
        <div key={`empty-${i}`} className={styles.emptyDay}>
          {prevMonthLastDate - startDay + 1 + i}
        </div>,
      )
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear()

      const dayEvents =
        events?.filter((event) => {
          const eventDate = new Date(event.dueDate)
          return (
            eventDate.getDate() === day &&
            eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear()
          )
        }) || []

      grid.push(
        <div key={day} className={`${styles.day} ${isToday ? styles.today : ''}`}>
          {day}
          {dayEvents.map((event) => (
            <div key={event.id} className={classnames(styles.event, styles[event.theme])}>
              {event.name}
            </div>
          ))}
        </div>,
      )
    }

    // Add empty days for the last week
    const totalDays = startDay + daysInMonth
    const nextMonthEmptyDays = (7 - (totalDays % 7)) % 7
    for (let i = 0; i < nextMonthEmptyDays; i++) {
      grid.push(
        <div key={`next-empty-${i}`} className={styles.emptyDay}>
          {i + 1}
        </div>,
      )
    }

    return grid
  }

  return (
    <div className={styles.calendarWrapper}>
      <h1>Calendar</h1>
      <div className={styles.navigation}>
        <select onChange={handleMonthChange} value={currentDate.getMonth()}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <button onClick={handleToday}>Today</button>
        <select onChange={handleYearChange} value={currentDate.getFullYear()}>
          {Array.from({ length: 21 }, (_, i) => (
            <option key={i} value={currentDate.getFullYear() - 10 + i}>
              {currentDate.getFullYear() - 10 + i}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.navigation}>
        <button onClick={handlePrevMonth}>Previous</button>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div className={styles.calendarGrid}>{renderCalendarGrid()}</div>
    </div>
  )
}
