import React from 'react';
import classnames from 'classnames';
import PaginationView from '../../../common/PaginationView';
import Image from '../../../common/Image';
import { Link } from 'react-router-dom';

const StaffPaginationView = ({ staff, page, setPage, totalPages }) => (
  <PaginationView
    data={staff}
    component={StaffView}
    page={page}
    setPage={setPage}
    totalPages={totalPages}
  />
);

const StaffView = ({ data: staff, index }) => (
  <Link to={`/admin/managers/${staff.username}`} className="has-text-black">
    <article
      className={classnames('media p-md', 'pointer', {
        'has-background-light': index % 2 === 1,
      })}
    >
      <figure className="media-left">
        <Image size="m" rounded src={`https://api.adorable.io/avatars/64/${staff.username}`} />
      </figure>
      <div className="media-content">
        <p className="is-size-4">{staff.username}</p>
      </div>
    </article>
  </Link>
);

export default StaffPaginationView;
