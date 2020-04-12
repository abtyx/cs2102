import { faSmilePlus } from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import FAIcon from '../../common/FAIcon';
import FlexCenter from '../../common/FlexCenter';

const NewCustomersCard = ({ count }) => (
  <div className="card">
    <div className="card-content">
      <FlexCenter column>
        <FAIcon icon={faSmilePlus} size="4x" className="m-b-md" />
        <h2 className="title is-1">{count}</h2>
        new customers
      </FlexCenter>
    </div>
  </div>
);

export default NewCustomersCard;
