import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../../api';
import BackgroundImage from '../../assets/backgrounds/y-so-serious-white.png';
import useStore from '../../stores';
import FlexCenter from '../common/FlexCenter';
import LoginCard from './LoginCard';

const Section = styled.section`
  height: 100vh;
  background: url(${BackgroundImage}) center center fixed;
  background-repeat: repeat;
`;

const LoginPage = observer(() => {
  const sessionStore = useStore('session');
  const notifStore = useStore('notifications');
  const loginStore = useStore('login');
  const history = useHistory();

  useEffect(() => {
    switch (sessionStore.userType) {
      case 'manager':
        history.push('/admin');
        return;
      case 'customer':
        history.push('/customer');
        return;
      case 'restaurant':
        history.push('/restaurant');
        return;
      case 'rider':
        history.push('/rider');
        return;
      default:
        return;
    }
  }, [sessionStore.userType]);

  const attemptLogin = async e => {
    e.preventDefault();
    const username = loginStore.username;
    const password = loginStore.password;
    try {
      const response = await login({ username, password });
      sessionStore.changeEntityId(response.username);
      sessionStore.changeUserType(response.usertype);
      notifStore.pushNotification('Logged in successfully!');
    } catch {
      notifStore.pushNotification('Wrong username or password.', 'warning');
    }
  };

  return (
    <Section className="section">
      <FlexCenter fullheight>
        <LoginCard
          username={loginStore.username}
          password={loginStore.password}
          setUsername={loginStore.setUsername}
          setPassword={loginStore.setPassword}
          login={attemptLogin}
        />
      </FlexCenter>
    </Section>
  );
});

export default LoginPage;
