"use client"
import { useState } from 'react';
import Link from 'next/link';

const Calendar = () => {
  // Use today's date as the initial state
  const [date, setDate] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const month = date.getMonth();
  const year = date.getFullYear();

  // Get the first day of the month (0=Sunday, 1=Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create an array representing the days on the calendar grid
  const calendarDays: (number | null)[] = [];

  // Fill in blanks for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Fill in the days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Ensure the total number of cells is a multiple of 7 (for full weeks)
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  // Split the array into rows (weeks)
  const rows: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    rows.push(calendarDays.slice(i, i + 7));
  }

  // Helper to go to previous month
  const goToPreviousMonth = () => {
    setDate(new Date(year, month - 1, 1));
  };

  // Helper to go to next month
  const goToNextMonth = () => {
    setDate(new Date(year, month + 1, 1));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={goToPreviousMonth}>Prev</button>
        <h2>
          {date.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <button onClick={goToNextMonth}>Next</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <th key={day} style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => {
                if (!cell) {
                  return (
                    <td
                      key={cellIdx}
                      style={{
                        border: '1px solid #eee',
                        padding: '8px',
                        height: '50px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    ></td>
                  );
                }
                // Compute the day of the week for this cell.
                const dayOfWeek = (firstDayOfMonth + (cell - 1)) % 7;
                // Determine if the 7pm Dinner event should be shown.
                // Only show for Wednesday (3) and Friday (5) and when cell date is not in the past.
                const showDinner = (dayOfWeek === 3 || dayOfWeek === 5);
                const cellDate = new Date(year, month, cell);
                
                return (
                  <td
                    key={cellIdx}
                    style={{
                      border: '1px solid #eee',
                      padding: '8px',
                      height: '50px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                    }}
                  >
                    <div>{cell}</div>
                    {showDinner && cellDate >= today && (
                      <Link href="/calendar/rsvp">
                        <button
                          style={{
                            fontSize: '0.75rem',
                            marginTop: '4px',
                            color: 'white',
                            backgroundColor: 'red',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          7pm Dinner
                        </button>
                      </Link>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;