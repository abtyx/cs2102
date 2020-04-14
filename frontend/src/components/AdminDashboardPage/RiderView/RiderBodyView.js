import {
  faBriefcase,
  faPhone,
  faPiggyBank,
  faSackDollar,
  faSmile,
  faStar,
  faTruck,
  faUser,
  faMoneyBill,
} from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import Field from '../../common/Field';
import FlexCenter from '../../common/FlexCenter';
import IconStat from '../../common/IconStat';
import MonthPicker from '../../common/MonthPicker';
import LabelledField from '../../common/LabelledField';
import YearPicker from '../../common/YearPicker';
import moment from 'moment';
import { toTwoDec } from '../../../utils/fmt';

const RiderBodyView = ({
  rider,
  month,
  setMonth,
  year,
  setYear,
  editProps: { isEditMode, contact, bankAccount, setContact, setBankAccount, salary, setSalary },
}) => {
  const renderBankAccount = () => {
    if (isEditMode) {
      return <LabelledField label="Bank Account" value={bankAccount} onChange={setBankAccount} />;
    }
    return <Field icon={faPiggyBank} label="Bank Account" value={rider.bankAccount} />;
  };

  const renderContact = () => {
    if (isEditMode) {
      return <LabelledField label="Contact Number" value={contact} onChange={setContact} />;
    }
    return <Field icon={faPhone} label="Contact Number" value={rider.contact} />;
  };

  const renderUsername = () => {
    return <Field icon={faUser} label="Username" value={rider.username} />;
  };

  const renderSalary = () => {
    if (isEditMode) {
      return <LabelledField label="Salary" value={salary} onChange={setSalary} />;
    }
    return <Field icon={faMoneyBill} label="Salary" value={'$' + rider.salary} />;
  };
  return (
    <>
      <div className="columns m-b-lg-i">
        <div className="column">{renderBankAccount()}</div>
        <div className="column">{renderContact()}</div>
        <div className="column">{renderUsername()}</div>
        <div className="column">{renderSalary()}</div>
      </div>
      <FlexCenter className="m-b-lg">
        <h2 className="title is-5 m-r-md m-b-none-i">Statistics for</h2>
        <div className="m-r-md">
          <YearPicker
            year={year}
            yearMin={moment().year() - 10}
            yearMax={moment().year()}
            onChange={setYear}
          />
        </div>
        <MonthPicker month={month} onChange={setMonth} />
      </FlexCenter>
      <div className="columns">
        <div className="column">
          <IconStat icon={faTruck} value={rider.ordersDelivered} label="orders delivered" />
        </div>
        <div className="column">
          <IconStat icon={faBriefcase} value={rider.totalWorkHours} label="hours worked" />
        </div>
        <div className="column">
          <IconStat
            icon={faSackDollar}
            value={`$${parseFloat(rider.totalSalary).toFixed(2)}`}
            label="salary earned"
          />
        </div>
        <div className="column">
          <IconStat icon={faSmile} value={rider.ratingCount} label="ratings received" />
        </div>
        <div className="column">
          <IconStat icon={faStar} value={toTwoDec(rider.averageRating)} label="average rating" />
        </div>
      </div>
    </>
  );
};

export default RiderBodyView;
