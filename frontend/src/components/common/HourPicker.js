import React from 'react';

const HourPicker = ({ hour, onChange }) => {
  return (
    <div className="select">
      <select value={hour} onChange={e => onChange(e.target.value)}>
        <option value="10">10am</option>
        <option value="11">11am</option>
        <option value="12">12pm</option>
        <option value="13">1pm</option>
        <option value="14">2pm</option>
        <option value="15">3pm</option>
        <option value="16">4pm</option>
        <option value="17">5pm</option>
        <option value="18">6pm</option>
        <option value="19">7pm</option>
      </select>
    </div>
  );
};

export default HourPicker;
