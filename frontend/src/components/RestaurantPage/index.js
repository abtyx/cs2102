import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import RestaurantSidebar from './RestaurantSidebar';
import RestaurantDashboardView from './RestaurantDashboardView';
import styled from 'styled-components';
import RestaurantCampaignView from './RestaurantCampaignView';
import CampaignDetailedView from './CampaignDetailedView';
import useStore from '../../stores';
import { getRestaurants, getRestaurant } from '../../api';

const SidebarLayout = styled.div`
  display: flex;
  height: 100%;
`;

const RestaurantPage = () => {
  const history = useHistory();
  const sessionStore = useStore('session');
  const restaurantsStore = useStore('restaurants');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (sessionStore.userType !== 'restaurant') {
      history.push('/logout');
    }
  }, []);

  useEffect(() => {
    getRestaurant(sessionStore.entityId).then(rest => {
      restaurantsStore.updateRestaurant(rest);
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SidebarLayout>
      <RestaurantSidebar />
      <section
        className="section is-fullwidth"
        style={{
          height: '100vh',
          overflowY: 'scroll',
        }}
      >
        <div className="container">
          <Switch>
            <Route path="/restaurant/campaigns/:code">
              <CampaignDetailedView />
            </Route>
            <Route path="/restaurant/campaigns">
              <RestaurantCampaignView />
            </Route>
            <Route path="/restaurant">
              <RestaurantDashboardView />
            </Route>
          </Switch>
        </div>
      </section>
    </SidebarLayout>
  );
};

export default RestaurantPage;
