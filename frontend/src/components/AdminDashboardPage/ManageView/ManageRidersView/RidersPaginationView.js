import React from 'react';
import classnames from 'classnames';
import PaginationView from '../../../common/PaginationView';
import Image from '../../../common/Image';
import { Link } from 'react-router-dom';

const RidersPaginationView = ({ riders, page, setPage, totalPages }) => (
  <PaginationView
    data={riders}
    component={RiderView}
    page={page}
    setPage={setPage}
    totalPages={totalPages}
  />
);

const RiderView = ({ data: rider, index }) => (
  <Link to={`/admin/riders/${rider.username}`} className="has-text-black">
    <article
      className={classnames('media p-md', 'pointer', {
        'has-background-light': index % 2 === 1,
      })}
    >
      <figure className="media-left">
        <Image size="m" rounded src={`https://api.adorable.io/avatars/64/${rider.name}`} />
      </figure>
      <div className="media-content">
        <small className="has-text-grey">
          {rider.type === 'fulltime' ? 'Full Timer' : 'Part Timer'}
        </small>
        <p className="is-size-4">{rider.name}</p>
      </div>
    </article>
  </Link>
);

export default RidersPaginationView;
