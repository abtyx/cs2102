import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStore from '../../stores';
import styled from 'styled-components';
import { useHistory, Switch, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardView from './DashboardView';
import ManageView from './ManageView';
import CustomerView from './CustomerView';
import RiderView from './RiderView';
import FDSManagerView from './FDSManagerView';
import RestaurantView from './RestaurantView';

const SidebarLayout = styled.div`
  display: flex;
  height: 100%;
`;

const AdminDashboardPage = observer(() => {
  const sessionStore = useStore('session');
  const history = useHistory();

  useEffect(() => {
    if (sessionStore.userType !== 'manager') {
      history.push('/logout');
    }
  }, [sessionStore.userType]);

  return (
    <SidebarLayout>
      <Sidebar />
      <section
        className="section is-fullwidth"
        style={{
          height: '100vh',
          overflowY: 'scroll',
        }}
      >
        <div className="container">
          <Switch>
            <Route path="/admin/customers/:id">
              <CustomerView />
            </Route>
            <Route path="/admin/riders/:id">
              <RiderView />
            </Route>
            <Route path="/admin/managers/:id">
              <FDSManagerView />
            </Route>
            <Route path="/admin/restaurants/:id">
              <RestaurantView />
            </Route>
            <Route path="/admin/manage">
              <ManageView />
            </Route>
            <Route path="/admin">
              <DashboardView />
            </Route>
          </Switch>
        </div>
      </section>
    </SidebarLayout>
  );
});

export default AdminDashboardPage;
