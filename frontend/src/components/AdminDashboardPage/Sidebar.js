import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { faHome, faUserFriends, faSignOut } from '@fortawesome/pro-regular-svg-icons';
import SidebarItem from './SidebarItem';

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
    to: '/admin',
  },
  {
    id: 2,
    icon: faUserFriends,
    label: 'Manage',
    items: [
      {
        id: 1,
        label: 'Staff',
        to: '/admin/manage/staff',
      },
      {
        id: 2,
        label: 'Riders',
        to: '/admin/manage/riders',
      },
      {
        id: 3,
        label: 'Customers',
        to: '/admin/manage/customers',
      },
      {
        id: 4,
        label: 'Restaurants',
        to: '/admin/manage/restaurants',
      },
    ],
  },
  {
    id: 3,
    icon: faSignOut,
    label: 'Signout',
    to: '/logout',
  },
];

const Sidebar = () => {
  return (
    <SidebarDiv className="has-background-light">
      {items.map(item =>
        item.to ? (
          <SidebarItem key={item.id} icon={item.icon} label={item.label} to={item.to} />
        ) : item.items ? (
          <div className="p-md has-text-black" key={item.id}>
            <SidebarItem icon={item.icon} label={item.label} to={item.to} />
            {item.items.map(subitem => (
              <SidebarItem key={subitem.id} label={subitem.label} to={subitem.to} />
            ))}
          </div>
        ) : null,
      )}
    </SidebarDiv>
  );
};

export default Sidebar;
