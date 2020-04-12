import React from 'react';
import { Link } from 'react-router-dom';
import BackgroundImage from '../../assets/backgrounds/landing2.jpg';
import styled from 'styled-components';

const LandingDiv = styled.div`
  background: url(${BackgroundImage}) no-repeat center center fixed;
  background-size: cover;
`;

const LandingPage = () => {
  return (
    <LandingDiv className="hero is-fullheight has-text-centered">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">FastFood</h1>
          <h2 className="subtitle">Food comes fast</h2>
          <Link to="/login" className="button is-primary">
            Login
          </Link>
        </div>
      </div>
    </LandingDiv>
  );
};

export default LandingPage;
