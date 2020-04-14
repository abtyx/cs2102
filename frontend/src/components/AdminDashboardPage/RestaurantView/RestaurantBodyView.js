import {
  faPiggyBank,
  faUser,
  faFileInvoice,
  faMoneyBill,
  faUtensils,
} from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import { toReadable } from '../../../utils/money';
import Field from '../../common/Field';
import FlexCenter from '../../common/FlexCenter';
import MonthPicker from '../../common/MonthPicker';
import LabelledField from '../../common/LabelledField';
import YearPicker from '../../common/YearPicker';
import moment from 'moment';
import { observer } from 'mobx-react';
import { toTwoDec } from '../../../utils/fmt';
import FAIcon from '../../common/FAIcon';

const RestaurantBodyView = observer(
  ({
    restaurant,
    month,
    setMonth,
    year,
    setYear,
    editProps: { isEditMode, minOrder, setMinOrder },
  }) => {
    const renderMinOrder = () => {
      if (isEditMode) {
        return <LabelledField label="Minimum Order ($)" value={minOrder} onChange={setMinOrder} />;
      }
      return (
        <Field
          icon={faPiggyBank}
          label="Minimum Order"
          value={`$${toTwoDec(restaurant.minOrder)}`}
        />
      );
    };

    const renderUsername = () => {
      return <Field icon={faUser} label="Username" value={restaurant.username} />;
    };

    console.log(restaurant.foodItems);
    return (
      <>
        <div className="columns m-b-lg-i">
          <div className="column">{renderMinOrder()}</div>
          <div className="column">{renderUsername()}</div>
        </div>
        <h2 className="title is-4">Menu</h2>
        {restaurant.foodItems
          ? restaurant.foodItems.map(item => (
              <div className="card" key={item.id}>
                <div className="card-content">
                  <FlexCenter vertical>
                    <FAIcon icon={faUtensils} size="lg" className="m-r-lg" />
                    <div>
                      <p className="is-size-4">{item.name}</p>
                      <p>${item.price}</p>
                    </div>
                  </FlexCenter>
                </div>
              </div>
            ))
          : null}
        <FlexCenter className="m-b-lg m-t-lg">
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
            <Field icon={faFileInvoice} label="Orders" value={restaurant.orderCount} />
          </div>
          <div className="column">
            <Field
              icon={faMoneyBill}
              label="Order Revenue"
              value={`$${toTwoDec(restaurant.totalCost)}`}
            />
          </div>
        </div>
        <h2 className="title is-4">Best Sellers</h2>
        {restaurant.topSellers
          ? restaurant.topSellers.map(item => (
              <div className="card" key={item.id}>
                <div className="card-content">
                  <FlexCenter vertical>
                    <FAIcon icon={faUtensils} size="3x" className="m-r-lg" />
                    <div>
                      <p className="is-size-4">{item.name}</p>
                      <p>${item.price}</p>
                      <p>
                        <strong>{item.qty}</strong> times ordered
                      </p>
                    </div>
                  </FlexCenter>
                </div>
              </div>
            ))
          : null}
      </>
    );
  },
);

export default RestaurantBodyView;
