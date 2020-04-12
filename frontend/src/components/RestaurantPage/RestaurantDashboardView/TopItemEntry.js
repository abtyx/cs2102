import React from 'react';
import { toReadable } from '../../../utils/money';

const TopItemEntry = ({ imageSrc, name, price, totalOrders }) => (
  <div className="card">
    <div className="card-content">
      <article className="media">
        <figure className="media-left">
          <div
            style={{
              width: '100px',
              height: '100px',
              background: `url(${imageSrc}) no-repeat center center`,
              backgroundSize: 'cover',
            }}
          />
        </figure>
        <div className="media-content">
          <p className="is-size-5">{name}</p>
          <p className="is-size-6">{toReadable(price)}</p>
          <p className="is-size-6">{totalOrders} orders</p>
        </div>
      </article>
    </div>
  </div>
);

export default TopItemEntry;
