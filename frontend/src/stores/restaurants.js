import { observable, action, computed } from 'mobx';

class RestaurantStore {
  @computed get restaurants() {
    return Object.values(this.restaurantMap);
  }
  @observable restaurantMap = {};
  @observable searchTerm = '';
  @observable pageNumber = 0;
  @observable numberPerPage = 20;

  @computed get filteredPageCount() {
    return Math.ceil(this.filteredRestaurants.length / this.numberPerPage);
  }

  @computed get filteredRestaurants() {
    return this.restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().match(`${this.searchTerm.toLowerCase()}`),
    );
  }

  @computed get displayedRestaurants() {
    return this.filteredRestaurants.slice(
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

  @action replaceRestaurants = json => {
    this.restaurantMap = {};
    json.forEach(rst => {
      this.restaurantMap[rst.username] = rst;
    });
  };

  @action updateRestaurant = json => {
    this.restaurantMap[json.username] = {
      ...this.restaurantMap[json.username],
      ...json,
    };
  };
}

export default RestaurantStore;
