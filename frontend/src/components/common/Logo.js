import React from 'react';
import LogoTransPng from '../../assets/logo/logo_transparent.png';
import SquareImage from './Image';

const Logo = ({ size }) => <SquareImage size={size} src={LogoTransPng} />;

Logo.defaultProps = {
  size: 'l',
};

export default Logo;
