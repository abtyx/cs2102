import React from 'react';
import { Link } from 'react-router-dom';
import FAIcon from '../common/FAIcon';
import styled from 'styled-components';

const LinkContainer = styled.div`
  &:hover {
    background-color: hsl(0, 0%, 86%);
  }
  transition: all linear 0.2s;
`;

const SidebarItem = ({ icon, label, to }) =>
  to ? (
    <Link to={to}>
      <LinkContainer className="p-md pointer has-text-black">
        {icon ? <FAIcon icon={icon} /> : null}
        <span className="icon"></span>
        <span>{label}</span>
      </LinkContainer>
    </Link>
  ) : (
    <div>
      {icon ? <FAIcon icon={icon} /> : null}
      <span className="icon"></span>
      <span>{label}</span>
    </div>
  );

export default SidebarItem;
