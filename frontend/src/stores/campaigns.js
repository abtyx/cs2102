import { observable, action, computed } from 'mobx';

class CampaignStore {
  @computed get campaigns() {
    return Object.values(this.campaignMap);
  }
  @observable searchTerm = '';
  @observable pageNumber = 0;
  @observable numberPerPage = 20;
  @observable campaignMap = {};

  @computed get filteredPageCount() {
    return Math.ceil(this.filteredCampaigns.length / this.numberPerPage);
  }

  @computed get filteredCampaigns() {
    return this.campaigns.filter(campaign =>
      campaign.name.toLowerCase().match(`${this.searchTerm.toLowerCase()}`),
    );
  }

  @computed get displayedCampaigns() {
    return this.filteredCampaigns.slice(
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

  reset() {
    this.resetSearch();
    this.replaceCampaigns([]);
  }

  @action replaceCampaigns = json => {
    json.forEach(obj => {
      this.campaignMap[obj.code] = obj;
    });
  };

  @action updateCampaign = json => {
    this.campaignMap[json.code] = {
      ...this.campaignMap[json.code],
      ...json,
    };
  };
}

export default CampaignStore;
