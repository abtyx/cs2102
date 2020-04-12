import React from 'react';
import FAIcon from '../../common/FAIcon';
import { faUtensils } from '@fortawesome/pro-regular-svg-icons';
import FlexCenter from '../../common/FlexCenter';

const OrderCountCard = ({ count }) => (
  <div className="card">
    <div className="card-content">
      <FlexCenter column>
        <FAIcon icon={faUtensils} size="4x" className="m-b-md" />
        <h2 className="title is-1">{count}</h2>
        total orders
      </FlexCenter>
    </div>
  </div>
);

export default OrderCountCard;
