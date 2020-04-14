import { faSmilePlus } from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import FAIcon from '../../common/FAIcon';
import FlexCenter from '../../common/FlexCenter';
import classnames from 'classnames';

const NewCustomersCard = ({ count, prev }) => (
  <div className="card">
    <div className="card-content">
      <FlexCenter column>
        <FAIcon icon={faSmilePlus} size="4x" className="m-b-md" />
        <h2 className="title is-1 m-b-none-i">{count}</h2>
        <p>new customers</p>
        <p
          className={classnames('has-text-centered', {
            'has-text-danger': prev > count,
            'has-text-success': count > prev,
            'has-text-grey': count === prev,
          })}
        >
          {prev < count ? '+' : null}
          {(((count - prev) / prev) * 100).toFixed(2)}% from the previous month. (
          {prev < count ? '+' : null}
          {count - prev})
        </p>
      </FlexCenter>
    </div>
  </div>
);

export default NewCustomersCard;
