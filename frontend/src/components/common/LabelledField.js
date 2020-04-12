import React from 'react';

const LabelledField = ({ label, value, onChange, type }) => (
  <div className="field">
    <label className="label">{label}</label>
    <div className="control">
      <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  </div>
);

LabelledField.defaultProps = {
  type: 'text',
};

export default LabelledField;
