import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import CustomerPage from './components/CustomerPage';
import DeliveryRiderPage from './components/DeliveryRiderPage';
import LogoutPage from './components/LoginPage/LogoutPage';
import RestaurantPage from './components/RestaurantPage';
import RegisterPage from './components/RegisterPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/admin">
          <AdminDashboardPage />
        </Route>
        <Route path="/customer">
          <CustomerPage />
        </Route>
        <Route path="/rider">
          <DeliveryRiderPage />
        </Route>
        <Route path="/restaurant">
          <RestaurantPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/logout">
          <LogoutPage />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
