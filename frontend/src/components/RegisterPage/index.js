import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import BackgroundImage from '../../assets/backgrounds/y-so-serious-white.png';
import FlexCenter from '../common/FlexCenter';
import RegisterCard from './RegisterCard';
import { register } from '../../api';
import { withRouter } from 'react-router-dom';
import useStore from '../../stores';

const Section = styled.section`
  height: 100vh;
  background: url(${BackgroundImage}) center center fixed;
  background-repeat: repeat;
`;

@observer
class RegisterPage extends React.Component {
  @observable username = '';
  @observable password = '';
  @observable name = '';

  @action setUsername = username => (this.username = username);
  @action setPassword = password => (this.password = password);
  @action setName = name => (this.name = name);

  reset = () => {
    this.setUsername('');
    this.setPassword('');
    this.setName('');
  };

  onRegister = e => {
    e.preventDefault();

    const notifications = useStore('notifications');

    register({
      username: this.username,
      password: this.password,
      name: this.name,
    }).then(result => {
      notifications.pushNotification('Registered successfully!');
      this.props.history.push('/login');
    });
  };

  componentDidMount = () => {
    this.reset();
  };

  render() {
    return (
      <Section className="section">
        <FlexCenter fullheight>
          <RegisterCard
            username={this.username}
            password={this.password}
            name={this.name}
            setUsername={this.setUsername}
            setPassword={this.setPassword}
            setName={this.setName}
            onRegister={this.onRegister}
          />
        </FlexCenter>
      </Section>
    );
  }
}

export default withRouter(RegisterPage);
