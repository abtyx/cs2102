import { observable, action, computed } from 'mobx';

class CustomerStore {
  @observable customerMap = {};
  @computed get customers() {
    return Object.values(this.customerMap);
  }

  @observable searchTerm = '';
  @observable pageNumber = 0;
  @observable numberPerPage = 20;

  @computed get filteredPageCount() {
    return Math.ceil(this.filteredCustomers.length / this.numberPerPage);
  }

  @computed get filteredCustomers() {
    return this.customers.filter(customer =>
      customer.name.toLowerCase().match(`${this.searchTerm.toLowerCase()}`),
    );
  }

  @computed get displayedCustomers() {
    return this.filteredCustomers.slice(
      this.pageNumber * this.numberPerPage,
      (this.pageNumber + 1) * this.numberPerPage,
    );
  }

  @action setPage = number => {
    this.pageNumber = number;
  };

  @action setSearchTerm = term => {
    this.searchTerm = term;
    this.pageNumber = 0;
  };

  @action resetSearch = () => {
    this.searchTerm = '';
    this.pageNumber = 0;
    this.numberPerPage = 10;
  };

  @action replaceCustomers = json => {
    this.customerMap = {};
    json.forEach(cust => {
      this.customerMap[cust.username] = cust;
    });
  };

  @action updateCustomer = json => {
    this.customerMap[json.username] = {
      ...this.customerMap[json.username],
      ...json,
    };
  };
}

export default CustomerStore;
