import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import PaginationView from '../../../common/PaginationView';
import Image from '../../../common/Image';
import { Link } from 'react-router-dom';

const CustomersPaginationView = ({ customers, page, setPage, totalPages }) => (
  <PaginationView
    data={customers}
    component={CustomerView}
    page={page}
    setPage={setPage}
    totalPages={totalPages}
  />
);

const CustomerView = ({ data: customer, index }) => (
  <Link to={`/admin/customers/${customer.username}`} className="has-text-black">
    <article
      className={classnames('media p-md', 'pointer', {
        'has-background-light': index % 2 === 1,
      })}
    >
      <figure className="media-left">
        <Image size="m" rounded src={`https://api.adorable.io/avatars/64/${customer.name}`} />
      </figure>
      <div className="media-content">
        <small className="has-text-grey">
          Registered at: {moment(customer.signupDate).format('YYYY-MM-DD HH:mm:ss')}
        </small>
        <p className="is-size-4">{customer.name}</p>
        <div>
          <small>Loyalty Points: {customer.loyaltyPoints}</small>
        </div>
      </div>
    </article>
  </Link>
);

export default CustomersPaginationView;
