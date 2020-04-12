import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import BurgerImage from '../../assets/backgrounds/burger.jpg';
import FlexCenter from '../common/FlexCenter';
import Logo from '../common/Logo';

const Card = styled.div`
  display: flex;
  flex-direction: row;
  height: 800px;
`;

const LeftPart = styled.div`
  width: 300px;
`;

const RightPart = styled.div`
  width: 600px;
  overflow: hidden;
  background: url(${BurgerImage}) no-repeat center center;
  background-size: cover;
`;

@observer
class RegisterCard extends React.Component {
  render() {
    const { username, password, name, setUsername, setPassword, setName, onRegister } = this.props;
    return (
      <Card className="card">
        <LeftPart className="card-content">
          <FlexCenter fullheight>
            <div>
              <FlexCenter horizontal>
                <Logo size="l" />
              </FlexCenter>
              <FlexCenter horizontal className="m-b-md">
                <h1 className="title">Register</h1>
              </FlexCenter>
              <form onSubmit={onRegister}>
                <div className="field">
                  <label className="label">Username</label>
                  <input
                    type="text"
                    className="input"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <input
                    type="password"
                    className="input"
                    password={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="label">Name</label>
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <FlexCenter horizontal className="m-b-sm">
                  <button className="button" type="submit">
                    Register
                  </button>
                </FlexCenter>
                <FlexCenter>
                  <div className="has-text-centered">
                    <small className="block m-b-none-i">Already have an account?</small>
                    <small>
                      <Link to="/login">Login here.</Link>
                    </small>
                  </div>
                </FlexCenter>
              </form>
            </div>
          </FlexCenter>
        </LeftPart>
        <RightPart />
      </Card>
    );
  }
}

export default RegisterCard;
