import React from 'react';
import FAIcon from './FAIcon';

const Field = ({ icon, label, value }) => (
  <div>
    <small className="has-text-grey">
      <FAIcon icon={icon} className="m-r-sm" />
      <span>{label}</span>
    </small>
    <div className="is-size-4">{value}</div>
  </div>
);

export default Field;
