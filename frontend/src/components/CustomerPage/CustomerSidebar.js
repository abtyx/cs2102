import { faBurgerSoda, faHome, faSignOut } from '@fortawesome/pro-regular-svg-icons';
import React from 'react';
import styled from 'styled-components';
import CustomerSidebarItem from './CustomerSidebarItem';

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
    to: '/customer',
  },
  {
    id: 2,
    icon: faBurgerSoda,
    label: 'Food Search',
    to: '/customer/foodsearch',
  },
  {
    id: 3,
    icon: faSignOut,
    label: 'Signout',
    to: '/logout',
  },
];

const CustomerSidebar = () => {
  return (
    <SidebarDiv className="has-background-light">
      {items.map(item => (
        <CustomerSidebarItem key={item.id} icon={item.icon} label={item.label} to={item.to} />
      ))}
    </SidebarDiv>
  );
};

export default CustomerSidebar;
