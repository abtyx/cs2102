import { faFlag, faHome, faSignOut } from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import styled from 'styled-components';
import RestaurantSidebarItem from './RestaurantSidebarItem';

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
    label: 'Home',
    to: '/restaurant',
  },
  {
    id: 2,
    icon: faFlag,
    label: 'Campaigns',
    to: '/restaurant/campaigns',
  },
  {
    id: 3,
    icon: faSignOut,
    label: 'Signout',
    to: '/logout',
  },
];

const RestaurantSidebar = () => {
  return (
    <SidebarDiv className="has-background-light">
      {items.map(item => (
        <RestaurantSidebarItem key={item.id} icon={item.icon} label={item.label} to={item.to} />
      ))}
    </SidebarDiv>
  );
};

export default RestaurantSidebar;
