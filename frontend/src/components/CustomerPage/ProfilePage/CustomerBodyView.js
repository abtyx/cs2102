import React from 'react';
import Field from '../../common/Field';
import MonthPicker from '../../common/MonthPicker';
import FlexCenter from '../../common/FlexCenter';
import {
  faCoins,
  faFileInvoiceDollar,
  faDollarSign,
  faUser,
  faStore,
  faBiking,
  faAddressBook,
  faClock,
  faCashRegister,
  faCheck,
  faCreditCard,
} from '@fortawesome/pro-regular-svg-icons';
import IconStat from '../../common/IconStat';
import { toReadable } from '../../../utils/money';
import LabelledField from '../../common/LabelledField';
import YearPicker from '../../common/YearPicker';
import moment from 'moment';

const fmtTime = dt => moment.utc(dt).format('dddd, MMMM Do YYYY, h:mm:ss a');

const CustomerBodyView = ({
  customer,
  month,
  setMonth,
  year,
  setYear,
  editProps: { isEditMode, name, setName, password, setPassword },
}) => {
  const renderLoyaltyPoints = () => {
    return <Field icon={faCoins} label="Loyalty Points" value={customer.loyaltyPoints} />;
  };

  const renderUsername = () => {
    return <Field icon={faUser} label="Username" value={customer.username} />;
  };

  const renderPassword = () => {
    return isEditMode ? (
      <LabelledField label="Password" value={password} onChange={setPassword} type="password" />
    ) : null;
  };
  return (
    <>
      <div>
        {renderLoyaltyPoints()}
        {renderUsername()}
        {renderPassword()}
      </div>
      <FlexCenter className="m-b-lg">
        <h2 className="title is-5 m-r-md m-b-none-i">Statistics for</h2>
        <YearPicker
          year={year}
          onChange={setYear}
          yearMin={moment().year() - 10}
          yearMax={moment().year()}
        />
        <MonthPicker month={month} onChange={setMonth} />
      </FlexCenter>
      <div className="columns">
        <div className="column">
          <IconStat icon={faFileInvoiceDollar} value={customer.orderCount} label="orders made" />
        </div>
        <div className="column">
          <IconStat icon={faDollarSign} value={customer.totalCost} label="spent" />
        </div>
      </div>
      <h2 className="title is-5">Latest 10 Orders</h2>
      {customer.orders.map(order => (
        <div className="card m-b-sm" key={order.id}>
          <div className="card-content">
            <div className="m-b-md">
              <small className="has-text-grey">{`Order #${order.id}`}</small>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }} className="m-b-md">
              <Field icon={faStore} label="Restaurant" value={order.restName} />
              <Field icon={faBiking} label="Rider" value={order.riderName} />
            </div>
            <Field icon={faAddressBook} label="Address" value={order.address} />
            <Field icon={faClock} label="Time Ordered" value={fmtTime(order.timeCreated)} />
            <Field icon={faClock} label="Time Collected" value={fmtTime(order.timeCollection)} />
            <Field
              icon={faClock}
              label="Time Departed from Restaurant"
              value={fmtTime(order.timeDeparture)}
            />
            <Field icon={faClock} label="Time Delivered" value={fmtTime(order.timeDelivered)} />
            <Field icon={faCashRegister} label="Delivery Fee" value={`$${order.fee}`} />
            <Field icon={faCheck} label="Status" value={order.status} />
            <Field icon={faCreditCard} label="Mode of Payment" value={order.modeOfPayment} />
            {order.restaurantReview ? (
              <>
                <hr />
                <div className="m-b-md">
                  <p>
                    Review for <b>{order.restName}</b>
                  </p>
                  <p>Rating: {order.restaurantReview.rating} / 5</p>
                  <p>
                    <em>{order.restaurantReview.description}</em>
                  </p>
                </div>
              </>
            ) : null}
            {order.riderReview ? (
              <>
                <hr />
                <div>
                  <p>
                    Review for <b>{order.riderName}</b>
                  </p>
                  <p>Rating: {order.riderReview.rating} / 5</p>
                  <p>
                    <em>{order.riderReview.description}</em>
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
};

export default CustomerBodyView;
