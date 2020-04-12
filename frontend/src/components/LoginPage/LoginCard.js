import { faIdBadge, faLock } from '@fortawesome/pro-regular-svg-icons';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import FAIcon from '../common/FAIcon';
import FlexCenter from '../common/FlexCenter';
import Logo from '../common/Logo';
import BurgerImage from '../../assets/backgrounds/burger.jpg';
import { Link } from 'react-router-dom';

const Card = styled.div`
  display: flex;
  flex-direction: row;
  height: 400px;
`;

const LeftPart = styled.div`
  width: 300px;
`;

const RightPart = styled.div`
  width: 600px;
  overflow: hidden;
  background: url(${BurgerImage}) no-repeat center center;
  background-size: contain;
`;

@observer
class LoginCard extends React.Component {
  render() {
    const { username, password, setUsername, setPassword, login } = this.props;
    return (
      <Card className="card">
        <LeftPart className="card-content">
          <FlexCenter fullheight>
            <div>
              <FlexCenter horizontal>
                <Logo size="l" />
              </FlexCenter>
              <FlexCenter horizontal className="m-b-md">
                <h1 className="title">Login</h1>
              </FlexCenter>
              <form onSubmit={login}>
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input"
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <FAIcon icon={faIdBadge} />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      className="input"
                      placeholder="Password"
                      password={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <FAIcon icon={faLock} />
                    </span>
                  </div>
                </div>
                <FlexCenter horizontal className="m-b-sm">
                  <button className="button" type="submit">
                    Login
                  </button>
                </FlexCenter>
                <FlexCenter>
                  <div className="has-text-centered">
                    <small className="block m-b-none-i">Don't have an account yet?</small>
                    <small>
                      <Link to="/register">Register here.</Link>
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

export default LoginCard;
