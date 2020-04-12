import React, { useEffect } from 'react';
import useStore from '../../stores';
import { Redirect } from 'react-router-dom';

const LogoutPage = () => {
  const sessionStore = useStore('session');
  const loginStore = useStore('login');
  useEffect(() => {
    sessionStore.logout();
    loginStore.reset();
  }, []);

  return <Redirect to="/login" />;
};

export default LogoutPage;
