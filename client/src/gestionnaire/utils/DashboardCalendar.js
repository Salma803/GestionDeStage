import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DashboardCalendar = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className='react-calendar-body'>
      <Calendar
        onChange={onChange}
        value={date}
      />
    </div>
  );
};

export default DashboardCalendar;
