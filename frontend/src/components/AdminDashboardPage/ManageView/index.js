import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import ManageCustomersView from './ManageCustomersView';
import ManageRestaurantsView from './ManageRestaurantsView';
import ManageRidersView from './ManageRidersView';
import ManageStaffView from './ManageStaffView';

const ManageView = () => {
  return (
    <Switch>
      <Route path="/admin/manage/staff">
        <ManageStaffView />
      </Route>
      <Route path="/admin/manage/riders">
        <ManageRidersView />
      </Route>
      <Route path="/admin/manage/restaurants">
        <ManageRestaurantsView />
      </Route>
      <Route path="/admin/manage/customers">
        <ManageCustomersView />
      </Route>
    </Switch>
  );
};

export default ManageView;
