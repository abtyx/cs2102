import {
  faFileInvoiceDollar,
  faPercent,
  faCode,
  faCalendar,
  faDollarSign,
} from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import IconStat from '../../common/IconStat';
import Field from '../../common/Field';
import moment from 'moment';

const fmtTime = dt => moment.utc(dt).format('dddd, MMMM Do YYYY, h:mm:ss a');
const CampaignBodyView = ({ campaign }) => {
  const durationDays = moment(campaign.endDate).diff(moment(campaign.startDate), 'days', true);

  return (
    <>
      <div className="columns has-text-centered">
        <div className="column">
          <Field icon={faCode} label="Code" value={campaign.code} />
        </div>
        <div className="column">
          <Field
            icon={faCalendar}
            label="Active Period"
            value={`${fmtTime(campaign.startDate)} - ${fmtTime(
              campaign.endDate,
            )} (${durationDays} days)`}
          />
        </div>
        <div className="column">
          <Field
            icon={faDollarSign}
            label="Discount"
            value={`${campaign.type === 'flat' ? '$' : ''}${campaign.value}${
              campaign.type === 'percent' ? '%' : ''
            }`}
          />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <IconStat
            icon={faFileInvoiceDollar}
            value={campaign.orderCount}
            label="orders received"
          />
        </div>
        <div className="column">
          <IconStat
            icon={faPercent}
            value={parseInt(campaign.orderCount) / durationDays}
            label="orders / day"
          />
        </div>
      </div>
    </>
  );
};

export default CampaignBodyView;
