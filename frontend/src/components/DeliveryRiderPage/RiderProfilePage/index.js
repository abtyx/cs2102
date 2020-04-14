import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import useStore from '../../../stores';
import { useParams, useHistory } from 'react-router-dom';
import RiderBodyView from './RiderBodyView';
import EntityCard from '../../common/EntityCard';
import BackgroundImage from '../../../assets/backgrounds/double-bubble.png';
import { faBiking } from '@fortawesome/pro-regular-svg-icons';
import { deleteRider, updateRider, getAdminRiderSummary, getRider } from '../../../api';
import LabelledField from '../../common/LabelledField';
import moment from 'moment';

const RiderProfilePage = observer(() => {
  const sessionStore = useStore('session');
  const riderStore = useStore('riders');
  const notifStore = useStore('notifications');

  const username = sessionStore.entityId;
  const rider = riderStore.riderMap[username];
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    getAdminRiderSummary(username, month, year).then(result => {
      riderStore.updateRider({ username, ...result });
    });
  }, [username, year, month]);

  const editCallback = () => {
    setIsEditMode(true);
    setName(rider.name);
    setPassword('');
    setBankAccount(rider.bankAccount);
    setContact(rider.contact);
  };

  const saveCallback = () => {
    const updateObj = {
      username,
      name,
      password: password ? password : undefined,
      bankAccount,
      contact,
      salary: rider.salary,
    };
    updateRider(updateObj).then(() => {
      getRider(username).then(result => {
        riderStore.updateRider(result);
        notifStore.pushNotification('Successfully updated rider!');
        setIsEditMode(false);
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
    }
    return <h1 className="title">{rider.name}</h1>;
  };

  return (
    <EntityCard
      bgSrc={BackgroundImage}
      avatarSrc={`https://api.adorable.io/avatars/128/${rider.name}`}
      topIcon={faBiking}
      topText="Rider"
      bottomChild={renderBottomChild()}
      editCallback={editCallback}
      saveCallback={saveCallback}
      isEditMode={isEditMode}
    >
      <RiderBodyView
        rider={rider}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        editProps={{
          isEditMode,
          bankAccount,
          password,
          setPassword,
          contact,
          setBankAccount,
          setContact,
        }}
      />
    </EntityCard>
  );
});

export default RiderProfilePage;
