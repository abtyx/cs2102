import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import useStore from '../../../stores';
import { useParams, useHistory } from 'react-router-dom';
import EntityCard from '../../common/EntityCard';
import BackgroundImage from '../../../assets/backgrounds/trees.png';
import { faMale } from '@fortawesome/pro-regular-svg-icons';
import CustomerBodyView from './CustomerBodyView';
import { deleteCustomer, getCustomer, updateCustomer, getAdminCustomerSummary } from '../../../api';
import LabelledField from '../../common/LabelledField';

const CustomerView = observer(() => {
  const { id: username } = useParams();
  const customerStore = useStore('customers');
  const notifStore = useStore('notifications');
  const history = useHistory();
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [isEditMode, setEditMode] = useState(false);
  const [name, setName] = useState('');

  const customer = customerStore.customerMap[username];

  useEffect(() => {
    getCustomer(username).then(customer => {
      customerStore.updateCustomer(customer);
    });
  }, [username]);

  useEffect(() => {
    getAdminCustomerSummary(username, month, year).then(details => {
      console.log(details);
      customerStore.updateCustomer({
        username,
        ...details,
      });
    });
  }, [month, year]);

  const deleteCallback = () => {
    deleteCustomer({ username })
      .then(() => {
        notifStore.pushNotification('Deleted customer successfully.');
        history.push('/admin/manage/customers');
      })
      .catch(e => {
        notifStore.pushNotification('Could not delete customer successfully.', 'warning');
      });
  };

  const editCallback = () => {
    setEditMode(true);
    setName(customer.name);
  };

  const saveCallback = () => {
    setEditMode(false);
    updateCustomer({
      username,
      name,
    }).then(() => {
      getCustomer(username).then(customer => {
        customerStore.updateCustomer(customer);
        notifStore.pushNotification('Successfully updated customer!');
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
      deleteCallback={deleteCallback}
    >
      <CustomerBodyView
        customer={customer}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
      />
    </EntityCard>
  );
});

export default CustomerView;
