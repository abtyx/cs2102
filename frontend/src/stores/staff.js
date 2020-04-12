import { observable, action, computed } from 'mobx';

class StaffStore {
  @computed get staff() {
    return Object.values(this.staffMap);
  }
  @observable searchTerm = '';
  @observable pageNumber = 0;
  @observable numberPerPage = 20;

  @observable staffMap = {};

  @computed get filteredPageCount() {
    return Math.ceil(this.filteredStaff.length / this.numberPerPage);
  }

  @computed get filteredStaff() {
    return this.staff.filter(staff =>
      staff.username.toLowerCase().match(`${this.searchTerm.toLowerCase()}`),
    );
  }

  @computed get displayedStaff() {
    return this.filteredStaff.slice(
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

  @action replaceStaff = json => {
    this.staffMap = {};
    json.forEach(m => {
      this.staffMap[m.username] = m;
    });
  };

  @action updateStaff = json => {
    this.staffMap[json.username] = {
      ...this.staffMap[json.username],
      ...json,
    };
  };
}

export default StaffStore;
