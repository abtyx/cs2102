import React from 'react';
import FlexCenter from './FlexCenter';
import FAIcon from './FAIcon';

const IconStat = ({ icon, value, label }) => (
  <FlexCenter column>
    <FAIcon icon={icon} size="4x" className="m-b-md" />
    <h2 className="title is-1">{value}</h2>
    {label}
  </FlexCenter>
);

export default IconStat;
