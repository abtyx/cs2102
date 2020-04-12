import { observable, action } from 'mobx';

class DashboardStore {
  @observable newCustomers = 0;
  @observable orderCount = 0;
  @observable orderRevenue = 0;
  @observable areas = [];

  @action setAreas = areas => {
    this.areas = areas;
  };

  @action setNewCustomerCount = count => {
    this.newCustomers = count;
  };

  @action setOrderCount = count => {
    this.orderCount = count;
  };

  @action setOrderRevenue = revenue => {
    this.orderRevenue = revenue;
  };
}

export default DashboardStore;
