import React from 'react';
import FlexCenter from '../../common/FlexCenter';
import FAIcon from '../../common/FAIcon';
import { faSackDollar } from '@fortawesome/pro-regular-svg-icons';
import { toReadable } from '../../../utils/money';

const TotalRevenueCard = ({ revenue }) => (
  <div className="card">
    <div className="card-content">
      <FlexCenter column>
        <FAIcon icon={faSackDollar} size="4x" className="m-b-md" />
        <h2 className="title is-1">{revenue}</h2>
        in total order revenue
      </FlexCenter>
    </div>
  </div>
);

export default TotalRevenueCard;
