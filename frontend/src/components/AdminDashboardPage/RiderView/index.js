import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import useStore from '../../../stores';
import { useParams, useHistory } from 'react-router-dom';
import RiderBodyView from './RiderBodyView';
import EntityCard from '../../common/EntityCard';
import BackgroundImage from '../../../assets/backgrounds/double-bubble.png';
import { faBiking } from '@fortawesome/pro-regular-svg-icons';
import { deleteRider, getRider, updateRider, getAdminRiderSummary } from '../../../api';
import LabelledField from '../../common/LabelledField';
import moment from 'moment';

const RiderView = observer(() => {
  const { id: username } = useParams();
  const riderStore = useStore('riders');
  const notifStore = useStore('notifications');
  const history = useHistory();
  const rider = riderStore.riderMap[username];
  const [month, setMonth] = useState(moment().month());
  const [year, setYear] = useState(moment().year());
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [salary, setSalary] = useState(0);
  const [contact, setContact] = useState('');

  useEffect(() => {
    getRider(username).then(result => {
      riderStore.updateRider(result);
    });
  }, [username]);

  useEffect(() => {
    getAdminRiderSummary(username, month, year).then(result => {
      riderStore.updateRider({ username, ...result });
    });
  }, [username, year, month]);

  const deleteCallback = () => {
    deleteRider({ id: username })
      .then(() => {
        notifStore.pushNotification('Deleted rider successfully.');
        history.push('/admin/manage/riders');
      })
      .catch(e => {
        notifStore.pushNotification('Could not delete rider successfully.', 'warning');
      });
  };

  const editCallback = () => {
    setIsEditMode(true);
    setName(rider.name);
    setBankAccount(rider.bankAccount);
    setContact(rider.contact);
    setSalary(rider.salary);
  };

  const saveCallback = () => {
    updateRider({
      username,
      name,
      bankAccount,
      contact,
      salary,
    }).then(() => {
      getRider(username).then(result => {
        riderStore.updateRider(result);
        notifStore.pushNotification('Updated rider successfully!');
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

  if (!rider) {
    return null;
  }

  return (
    <EntityCard
      bgSrc={BackgroundImage}
      avatarSrc={`https://api.adorable.io/avatars/128/${rider.name}`}
      topIcon={faBiking}
      topText={rider.type === 'fulltime' ? 'Full Time Rider' : 'Part Time Rider'}
      bottomChild={renderBottomChild()}
      editCallback={editCallback}
      saveCallback={saveCallback}
      deleteCallback={deleteCallback}
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
          contact,
          salary,
          setSalary,
          setBankAccount,
          setContact,
        }}
      />
    </EntityCard>
  );
});

export const PureRiderView = ({ rider, month, setMonth }) => (
  <EntityCard
    bgSrc={BackgroundImage}
    avatarSrc={`https://api.adorable.io/avatars/128/${rider.name}`}
    topIcon={faBiking}
    topText="Rider"
    bottomChild={<h1 className="title">{rider.name}</h1>}
  >
    <RiderBodyView rider={rider} month={month} setMonth={setMonth} />
  </EntityCard>
);

export default RiderView;
