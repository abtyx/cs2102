import React from 'react';
import FlexCenter from '../../common/FlexCenter';
import FAIcon from '../../common/FAIcon';
import { faSackDollar } from '@fortawesome/pro-regular-svg-icons';
import classnames from 'classnames';

const TotalRevenueCard = ({ revenue, prev }) => (
  <div className="card">
    <div className="card-content">
      <FlexCenter column>
        <FAIcon icon={faSackDollar} size="4x" className="m-b-md" />
        <h2 className="title is-1 m-b-none-i">${revenue}</h2>
        <p>in total order revenue</p>
        <p
          className={classnames('has-text-centered', {
            'has-text-danger': prev > revenue,
            'has-text-success': revenue > prev,
            'has-text-grey': revenue === prev,
          })}
        >
          {prev < revenue ? '+' : null}
          {(((revenue - prev) / prev) * 100).toFixed(2)}% from the previous month. (
          {prev <= revenue ? '+' : '-'}${Math.abs(revenue - prev)})
        </p>
      </FlexCenter>
    </div>
  </div>
);

export default TotalRevenueCard;
