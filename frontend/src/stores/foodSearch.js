import { observable, action, computed } from 'mobx';

class FoodSearchStore {
  @observable results = [];
  @observable categories = [];
  @observable categoryIdx = -1;
  @observable searchTerm = '';
  @observable pageNumber = 0;
  @observable numberPerPage = 10;

  @computed get pageCount() {
    return Math.ceil(this.results.length / this.numberPerPage);
  }

  @computed get displayedItems() {
    return this.results.slice(
      this.pageNumber * this.numberPerPage,
      (this.pageNumber + 1) * this.numberPerPage,
    );
  }

  @computed get selectedCategory() {
    if (this.categoryIdx >= this.categories.length) {
      return null;
    }
    return this.categories[this.categoryIdx];
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
  };

  reset() {
    this.resetSearch();
  }

  @action replaceResults = json => {
    this.results = json;
  };

  @action replaceCategories = json => {
    this.categories = json.map(x => x.name);
  };

  @action setCategoryIdx = idx => {
    this.categoryIdx = idx;
  };
}

export default FoodSearchStore;
