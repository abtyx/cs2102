import { observable, action } from 'mobx';

class DashboardStore {
  @observable newCustomers = 0;
  @observable previousCustomers = 0;
  @observable orderCount = 0;
  @observable previousOrderCount = 0;
  @observable orderRevenue = 0;
  @observable previousRevenue = 0;
  @observable areas = [];

  @action setAreas = areas => {
    this.areas = areas;
  };

  @action setMonthData = ({ newCustomers, orderCount, revenue }) => {
    (this.newCustomers = newCustomers), (this.orderCount = orderCount);
    this.orderRevenue = revenue;
  };

  @action setPrevMonthData = ({ newCustomers, orderCount, revenue }) => {
    (this.previousCustomers = newCustomers), (this.previousOrderCount = orderCount);
    this.previousRevenue = revenue;
  };
}

export default DashboardStore;
