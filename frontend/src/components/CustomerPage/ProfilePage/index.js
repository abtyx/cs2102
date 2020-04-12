import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import useStore from '../../../stores';
import EntityCard from '../../common/EntityCard';
import BackgroundImage from '../../../assets/backgrounds/trees.png';
import { faMale } from '@fortawesome/pro-regular-svg-icons';
import CustomerBodyView from './CustomerBodyView';
import { deleteCustomer, updateCustomer, getCustomer, getAdminCustomerSummary } from '../../../api';
import LabelledField from '../../common/LabelledField';
import moment from 'moment';

const CustomerView = observer(() => {
  const sessionStore = useStore('session');
  const customerStore = useStore('customers');
  const notifStore = useStore('notifications');
  const username = sessionStore.entityId;
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [isEditMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const customer = customerStore.customerMap[username];

  useEffect(() => {
    getAdminCustomerSummary(username, month, year).then(details => {
      customerStore.updateCustomer({
        username,
        ...details,
      });
    });
  }, [month, year]);

  const editCallback = () => {
    setEditMode(true);
    setName(customer.name);
    setPassword('');
  };

  const saveCallback = () => {
    updateCustomer({
      username,
      password,
      name,
    }).then(() => {
      getCustomer(username).then(result => {
        customerStore.updateCustomer(result);
        setEditMode(false);
      });
    });
  };

  const renderBottomChild = () => {
    if (isEditMode) {
      return (
        <div style={{ marginBottom: '-2em' }}>
          <LabelledField label="Name" value={name} onChange={setName} />
        </div>
      );
    } else {
      return <h1 className="title">{customer.name}</h1>;
    }
  };

  if (!customer) {
    return null;
  }

  return (
    <EntityCard
      bgSrc={BackgroundImage}
      avatarSrc={`https://api.adorable.io/avatars/128/${customer.name}`}
      topIcon={faMale}
      topText="Customer"
      bottomChild={renderBottomChild()}
      editCallback={editCallback}
      isEditMode={isEditMode}
      saveCallback={saveCallback}
    >
      <CustomerBodyView
        customer={customer}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        editProps={{
          isEditMode,
          name,
          setName,
          password,
          setPassword,
        }}
      />
    </EntityCard>
  );
});

export default CustomerView;
