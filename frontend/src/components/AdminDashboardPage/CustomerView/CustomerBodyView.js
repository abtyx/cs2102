import React from 'react';
import Field from '../../common/Field';
import MonthPicker from '../../common/MonthPicker';
import FlexCenter from '../../common/FlexCenter';
import {
  faCoins,
  faFileInvoiceDollar,
  faDollarSign,
  faUser,
} from '@fortawesome/pro-regular-svg-icons';
import IconStat from '../../common/IconStat';
import { toReadable } from '../../../utils/money';
import LabelledField from '../../common/LabelledField';
import YearPicker from '../../common/YearPicker';
import moment from 'moment';

const CustomerBodyView = ({ customer, month, setMonth, year, setYear }) => {
  const renderLoyaltyPoints = () => {
    return <Field icon={faCoins} label="Loyalty Points" value={customer.loyaltyPoints} />;
  };

  const renderUsername = () => {
    return <Field icon={faUser} label="Username" value={customer.username} />;
  };
  return (
    <>
      <div>
        {renderLoyaltyPoints()}
        {renderUsername()}
      </div>
      <FlexCenter className="m-b-lg">
        <h2 className="title is-5 m-r-md m-b-none-i">Statistics for</h2>
        <YearPicker
          year={year}
          yearMin={moment().year() - 10}
          yearMax={moment().year()}
          onChange={setYear}
        />
        <MonthPicker month={month} onChange={setMonth} />
      </FlexCenter>
      <div className="columns">
        <div className="column">
          <IconStat icon={faFileInvoiceDollar} value={customer.orderCount} label="orders made" />
        </div>
        <div className="column">
          <IconStat icon={faDollarSign} value={customer.totalCost} label="of order revenue" />
        </div>
      </div>
    </>
  );
};

export default CustomerBodyView;
