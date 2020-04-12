import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { getRiders, getRider, getRiderSummary } from '../../api';
import useStore from '../../stores';
import RiderSidebar from './RiderSidebar';
import RiderProfilePage from './RiderProfilePage';

const SidebarLayout = styled.div`
  display: flex;
  height: 100%;
`;

const DeliveryRiderPage = () => {
  const riderStore = useStore('riders');
  const sessionStore = useStore('session');
  const history = useHistory();
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    if (sessionStore.userType !== 'rider') {
      history.push('/logout');
    }
  }, []);
  useEffect(() => {
    getRider(sessionStore.entityId).then(result => {
      riderStore.updateRider(result);
      setReady(true);
    });
  }, []);
  return isReady ? (
    <SidebarLayout>
      <RiderSidebar />
      <section
        className="section is-fullwidth"
        style={{
          height: '100%',
          overflowY: 'scroll',
        }}
      >
        <div className="container">
          <Switch>
            <Route path="/rider">
              <RiderProfilePage />
            </Route>
          </Switch>
        </div>
      </section>
    </SidebarLayout>
  ) : null;
};

export default DeliveryRiderPage;
