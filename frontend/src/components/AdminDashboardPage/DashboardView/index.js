import React, { useEffect, useState } from 'react';
import NewCustomersCard from './NewCustomersCard';
import OrderCountCard from './OrderCountCard';
import TotalRevenueCard from './TotalRevenueCard';
import { getAreas, getAdminSummary, getAdminAreaSummary, getAdminAreaHotspots } from '../../../api';
import useStore from '../../../stores';
import { observer } from 'mobx-react';
import HourPicker from '../../common/HourPicker';
import IconStat from '../../common/IconStat';
import { faFileInvoiceDollar, faFileInvoice } from '@fortawesome/pro-regular-svg-icons';
import moment from 'moment';
import YearPicker from '../../common/YearPicker';
import DayPicker from '../../common/DayPicker';
import MonthPicker from '../../common/MonthPicker';

const getPreviousMonth = (month, year) => {
  if (month === 1 || month === '1') {
    return {
      month: 12,
      year: year - 1,
    };
  }
  return {
    month: month - 1,
    year: year,
  };
};

const DashboardView = observer(() => {
  const dashboardStore = useStore('dashboard');
  const [area, setArea] = useState(0);
  const [hour, setHour] = useState(10);
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [date, setDate] = useState(moment().date());
  const [areaCount, setAreaCount] = useState(0);
  const [hotspotCount, setHotspotCount] = useState(0);

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
    getAdminAreaHotspots(areaName, hour).then(result => {
      setHotspotCount(result.count);
    });
  }, [area, hour, month, year, date, dashboardStore.areas]);

  useEffect(() => {
    getAdminSummary(month, year).then(result => {
      dashboardStore.setMonthData({
        newCustomers: result.newCustomerCount,
        orderCount: result.orderCount,
        revenue: result.totalOrderCost,
      });
    });
    const prevMonth = getPreviousMonth(month, year);
    getAdminSummary(prevMonth.month, prevMonth.year).then(result => {
      dashboardStore.setPrevMonthData({
        newCustomers: result.newCustomerCount,
        orderCount: result.orderCount,
        revenue: result.totalOrderCost,
      });
    });
  }, [month, year]);

  let areaName = '';
  if (area >= 0 && area < dashboardStore.areas.length) {
    areaName = dashboardStore.areas[area];
  }
  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">Statistics for</h2>
      <div style={{ display: 'flex' }} className="m-b-md">
        <div className="m-r-md">
          <YearPicker
            year={year}
            onChange={setYear}
            yearMin={moment().year() - 10}
            yearMax={moment().year()}
          />
        </div>
        <MonthPicker month={month} onChange={setMonth} />
      </div>
      <div className="columns m-b-lg">
        <div className="column">
          <NewCustomersCard
            count={dashboardStore.newCustomers}
            prev={dashboardStore.previousCustomers}
          />
        </div>
        <div className="column">
          <OrderCountCard
            count={dashboardStore.orderCount}
            prev={dashboardStore.previousOrderCount}
          />
        </div>
        <div className="column">
          <TotalRevenueCard
            revenue={dashboardStore.orderRevenue}
            prev={dashboardStore.previousRevenue}
          />
        </div>
      </div>
      <h2 className="title is-4 m-b-sm-i">Statistics by Area</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="m-b-md">
        <div>
          <label className="label">Area</label>
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
        </div>
        <div>
          <label className="label">
            {moment()
              .year(year)
              .month(month - 1)
              .format(`YYYY MMMM`)}
          </label>
          <DayPicker year={year} month={month} value={date} onChange={setDate} />
        </div>
        <div>
          <label className="label">At hour</label>
          <HourPicker value={hour} onChange={setHour} />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <div className="card is-fullwidth">
          <div className="card-content">
            <h5 className="title is-5">
              <span>On </span>
              <span>
                {moment()
                  .year(year)
                  .month(month - 1)
                  .date(date)
                  .format(`YYYY DD MMMM`)}
              </span>
              <span>
                , between {hour}00 to {parseInt(hour) + 1}00, in the {areaName} area
              </span>
            </h5>
            <IconStat icon={faFileInvoiceDollar} value={areaCount} label="orders placed" />
          </div>
        </div>
        <div className="card m-l-md is-fullwidth">
          <div className="card-content">
            <h5 className="title is-5">
              Between {hour}00 to {parseInt(hour) + 1}00 across all days, in the {areaName} area
            </h5>
          </div>
          <IconStat icon={faFileInvoice} value={hotspotCount} label="orders placed" />
        </div>
      </div>
    </div>
  );
});

export default DashboardView;
