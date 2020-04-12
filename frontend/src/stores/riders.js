import { observable, action, computed } from 'mobx';

class RiderStore {
  @computed get riders() {
    return Object.values(this.riderMap);
  }
  @observable riderMap = {};
  @observable searchTerm = '';
  @observable pageNumber = 0;
  @observable numberPerPage = 20;

  @computed get filteredPageCount() {
    return Math.ceil(this.filteredRiders.length / this.numberPerPage);
  }

  @computed get filteredRiders() {
    return this.riders.filter(rider =>
      rider.username.toLowerCase().match(`${this.searchTerm.toLowerCase()}`),
    );
  }

  @computed get displayedRiders() {
    return this.filteredRiders.slice(
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

  @action replaceRiders = json => {
    this.riderMap = {};
    json.forEach(rider => {
      this.riderMap[rider.username] = rider;
    });
  };

  @action updateRider = json => {
    this.riderMap[json.username] = {
      ...this.riderMap[json.username],
      ...json,
    };
  };
}

export default RiderStore;
