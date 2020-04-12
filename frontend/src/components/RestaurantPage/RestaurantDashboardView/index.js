import { faFileInvoiceDollar, faSackDollar, faUtensils } from '@fortawesome/pro-regular-svg-icons';
import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { toReadable } from '../../../utils/money';
import IconStat from '../../common/IconStat';
import MonthPicker from '../../common/MonthPicker';
import useStore from '../../../stores';
import TopItemEntry from './TopItemEntry';
import YearPicker from '../../common/YearPicker';
import moment from 'moment';
import FlexCenter from '../../common/FlexCenter';
import FAIcon from '../../common/FAIcon';
import { getRestaurantSummary } from '../../../api';
import { toTwoDec } from '../../../utils/fmt';

const RestaurantDashboardView = observer(() => {
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());

  const sessionStore = useStore('session');
  const restaurantsStore = useStore('restaurants');
  const username = sessionStore.entityId;

  const restaurant = restaurantsStore.restaurantMap[username];

  useEffect(() => {
    getRestaurantSummary(username, month, year).then(result => {
      restaurantsStore.updateRestaurant({ username, ...result });
    });
  }, [username, month, year]);

  if (!restaurant) {
    return null;
  }

  return (
    <section className="section">
      <h1 className="title">Welcome back, {restaurant.name}</h1>
      <h2 className="title is-4 m-b-sm-i">Statistics for</h2>
      <YearPicker
        year={year}
        onChange={setYear}
        yearMin={moment().year() - 10}
        yearMax={moment().year()}
      />
      <MonthPicker month={month} onChange={setMonth} />
      <div className="m-b-lg" />
      <div className="columns">
        <div className="column">
          <IconStat
            icon={faFileInvoiceDollar}
            value={restaurant.orderCount}
            label="completed orders"
          />
        </div>
        <div className="column">
          <IconStat
            icon={faSackDollar}
            value={`$${toTwoDec(restaurant.totalCost)}`}
            label="total revenue"
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
    </section>
  );
});

export default RestaurantDashboardView;
