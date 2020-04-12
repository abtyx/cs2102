import React from 'react';
import classnames from 'classnames';
import PaginationView from '../../../common/PaginationView';
import Image from '../../../common/Image';
import { Link } from 'react-router-dom';

const RestaurantsPaginationView = ({ restaurants, page, setPage, totalPages }) => (
  <PaginationView
    data={restaurants}
    component={RestaurantView}
    page={page}
    setPage={setPage}
    totalPages={totalPages}
  />
);

const RestaurantView = ({ data: restaurant, index }) => (
  <Link to={`/admin/restaurants/${restaurant.username}`} className="has-text-black">
    <article
      className={classnames('media p-md', 'pointer', {
        'has-background-light': index % 2 === 1,
      })}
    >
      <figure className="media-left">
        <Image size="m" rounded src={`https://api.adorable.io/avatars/64/${restaurant.name}`} />
      </figure>
      <div className="media-content">
        <p className="is-size-4">{restaurant.name}</p>
        <small>Minimum Order: ${restaurant.minOrder}</small>
      </div>
    </article>
  </Link>
);

export default RestaurantsPaginationView;
