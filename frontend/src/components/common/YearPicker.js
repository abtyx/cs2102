import React from 'react';
import moment from 'moment';

// expects 1-indexed month
const range = (m, n) => [...Array(n - m).keys()].map(x => x + m);

const YearPicker = ({ year, yearMin, yearMax, onChange }) => {
  return (
    <div className="select">
      <select value={year} onChange={e => onChange(e.target.value)}>
        {range(yearMin, yearMax + 1)
          .reverse()
          .map(i => {
            return (
              <option value={i} key={i}>
                {i}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default YearPicker;
