import React from 'react';
import moment from 'moment';

// expects 1-indexed month
const range = n => [...Array(n).keys()];

const DayPicker = ({ year = moment().year(), month, day, onChange }) => {
  return (
    <div className="select">
      <select value={day} onChange={e => onChange(e.target.value)}>
        {range(moment(`${year}-${month}`, 'YYYY-M').daysInMonth()).map(i => {
          return (
            <option value={i + 1} key={i}>
              {i + 1}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default DayPicker;
