import { faHome, faSignOut } from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import styled from 'styled-components';
import RiderSidebarItem from './RiderSidebarItem';

const SidebarDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100%;
`;

const items = [
  {
    id: 1,
    icon: faHome,
    label: 'Profile',
    to: '/rider',
  },
  {
    id: 2,
    icon: faSignOut,
    label: 'Signout',
    to: '/logout',
  },
];

const RiderSidebar = () => {
  return (
    <SidebarDiv className="has-background-light">
      {items.map(item => (
        <RiderSidebarItem key={item.id} icon={item.icon} label={item.label} to={item.to} />
      ))}
    </SidebarDiv>
  );
};

export default RiderSidebar;
