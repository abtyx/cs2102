import React from 'react';
import classnames from 'classnames';
import PaginationView from '../../common/PaginationView';
import Image from '../../common/Image';
import { Link } from 'react-router-dom';
import moment from 'moment';

const fmtTime = dt => moment.utc(dt).format('dddd, MMMM Do YYYY, h:mm:ss a');

const RestaurantCampaignPaginationView = ({ campaigns, page, setPage, totalPages }) => (
  <PaginationView
    data={campaigns}
    component={CampaignView}
    page={page}
    setPage={setPage}
    totalPages={totalPages}
    keyMapper={campaign => campaign.code}
  />
);

const CampaignView = ({ data: campaign, index }) => (
  <Link to={`/restaurant/campaigns/${campaign.code}`} className="has-text-black">
    <article
      className={classnames('media p-md', 'pointer', {
        'has-background-light': index % 2 === 1,
      })}
    >
      <figure className="media-left">
        <Image size="m" rounded src={`https://api.adorable.io/avatars/64/${campaign.name}`} />
      </figure>
      <div className="media-content">
        <small className="has-text-grey">Code: {campaign.code}</small>
        <p className="is-size-4">{campaign.name}</p>
        <p className="has-text-grey">{campaign.description}</p>
        <small>
          {fmtTime(campaign.startDate)} - {fmtTime(campaign.endDate)} (
          {moment(campaign.endDate).diff(moment(campaign.startDate), 'days', true)} days)
        </small>
      </div>
    </article>
  </Link>
);

export default RestaurantCampaignPaginationView;
