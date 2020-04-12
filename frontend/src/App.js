import React from 'react';
import { hot } from 'react-hot-loader';
import Router from './Router';
import NotificationCenter from './NotificationCenter';

const App = () => (
  <>
    <NotificationCenter />
    <Router />
  </>
);

export default hot(module)(App);
