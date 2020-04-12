import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { getCustomers, getCustomer } from '../../api';
import useStore from '../../stores';
import CustomerSidebar from './CustomerSidebar';
import ProfilePage from './ProfilePage';
import FoodSearchPage from './FoodSearchPage';

const SidebarLayout = styled.div`
  display: flex;
  height: 100%;
`;

const CustomerPage = () => {
  const customerStore = useStore('customers');
  const sessionStore = useStore('session');
  const history = useHistory();
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    if (sessionStore.userType !== 'customer') {
      history.push('/logout');
    }
  }, []);
  useEffect(() => {
    getCustomer(sessionStore.entityId).then(result => {
      customerStore.updateCustomer(result);
      setReady(true);
    });
  }, []);

  return isReady ? (
    <SidebarLayout>
      <CustomerSidebar />
      <section
        className="section is-fullwidth"
        style={{
          height: '100%',
          overflowY: 'scroll',
        }}
      >
        <div className="container">
          <Switch>
            <Route path="/customer/foodsearch">
              <FoodSearchPage />
            </Route>
            <Route path="/customer">
              <ProfilePage />
            </Route>
          </Switch>
        </div>
      </section>
    </SidebarLayout>
  ) : null;
};

export default CustomerPage;
