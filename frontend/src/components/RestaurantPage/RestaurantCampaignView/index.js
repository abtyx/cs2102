import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { getRestaurantCampaigns } from '../../../api';
import useStore from '../../../stores';
import Searchbar from '../../common/Searchbar';
import RestaurantCampaignPaginationView from './RestaurantCampaignPaginationView';
import FlexCenter from '../../common/FlexCenter';

const RestaurantCampaignView = () => {
  const campaignStore = useStore('campaigns');
  const sessionStore = useStore('session');
  useEffect(() => {
    campaignStore.reset();
    getRestaurantCampaigns(sessionStore.entityId).then(campaignStore.replaceCampaigns);
  }, []);

  return (
    <div>
      <h1 className="title">Promotional Campaigns</h1>
      <FlexCenter>
        <Searchbar
          searchTerm={campaignStore.searchTerm}
          setSearchTerm={campaignStore.setSearchTerm}
        />
      </FlexCenter>
      <RestaurantCampaignPaginationView
        campaigns={campaignStore.displayedCampaigns}
        page={campaignStore.pageNumber}
        setPage={campaignStore.setPage}
        totalPages={campaignStore.filteredPageCount}
      />
    </div>
  );
};

export default observer(RestaurantCampaignView);
