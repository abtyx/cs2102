import React, { useEffect, useState } from 'react';
import NewCustomersCard from './NewCustomersCard';
import OrderCountCard from './OrderCountCard';
import TotalRevenueCard from './TotalRevenueCard';
import { getAreas, getAdminSummary, getAdminAreaSummary } from '../../../api';
import useStore from '../../../stores';
import { observer } from 'mobx-react';
import HourPicker from '../../common/HourPicker';
import IconStat from '../../common/IconStat';
import { faFileInvoiceDollar } from '@fortawesome/pro-regular-svg-icons';
import moment from 'moment';
import YearPicker from '../../common/YearPicker';
import DayPicker from '../../common/DayPicker';
import MonthPicker from '../../common/MonthPicker';

const DashboardView = observer(() => {
  const dashboardStore = useStore('dashboard');
  const [area, setArea] = useState(0);
  const [hour, setHour] = useState(10);
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [date, setDate] = useState(moment().date());
  const [areaCount, setAreaCount] = useState(0);

  useEffect(() => {
    getAreas().then(areas => {
      dashboardStore.setAreas(areas.map(a => a.name));
    });
  }, []);

  useEffect(() => {
    if (area >= dashboardStore.areas.length) {
      // areas not fetched yet
      return;
    }

    const areaName = dashboardStore.areas[area];
    getAdminAreaSummary(areaName, hour, `${year}-${month}-${date}`).then(result => {
      setAreaCount(result.count);
    });
  }, [area, hour, month, year, date]);

  useEffect(() => {
    getAdminSummary(month, year).then(result => {
      dashboardStore.setNewCustomerCount(result.newCustomerCount);
      dashboardStore.setOrderCount(result.orderCount);
      dashboardStore.setOrderRevenue(result.totalOrderCost);
    });
  }, [month, year]);

  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">Statistics for</h2>
      <YearPicker
        year={year}
        onChange={setYear}
        yearMin={moment().year() - 10}
        yearMax={moment().year()}
      />
      <MonthPicker month={month} onChange={setMonth} />
      <div className="columns m-b-lg">
        <div className="column">
          <NewCustomersCard count={dashboardStore.newCustomers} />
        </div>
        <div className="column">
          <OrderCountCard count={dashboardStore.orderCount} />
        </div>
        <div className="column">
          <TotalRevenueCard revenue={dashboardStore.orderRevenue} />
        </div>
      </div>
      <h2 className="title is-4 m-b-sm-i">Statistics by Area</h2>
      <div className="card">
        <div className="card-content">
          <div className="select m-r-md">
            <select value={area} onChange={e => setArea(e.target.value)}>
              {dashboardStore.areas.map((a, i) => (
                <option value={i} key={i}>
                  {a}
                </option>
              ))}
              )}
            </select>
          </div>
          <DayPicker year={year} month={month} value={date} onChange={setDate} />
          <HourPicker value={hour} onChange={setHour} />
          <IconStat icon={faFileInvoiceDollar} value={areaCount} label="orders placed" />
        </div>
      </div>
    </div>
  );
});

export default DashboardView;
