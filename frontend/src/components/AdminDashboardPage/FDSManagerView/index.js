import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import useStore from '../../../stores';
import { useParams, useHistory } from 'react-router-dom';
import FDSManagerBodyView from './FDSManagerBodyView';
import EntityCard from '../../common/EntityCard';
import BackgroundImage from '../../../assets/backgrounds/email-pattern.png';
import { faBiking, faCrown } from '@fortawesome/pro-regular-svg-icons';
import { deleteStaff, getStaff, updateStaff } from '../../../api';
import LabelledField from '../../common/LabelledField';

const FDSManagerView = observer(() => {
  const { id: username } = useParams();
  const staffStore = useStore('staff');
  const sessionStore = useStore('session');
  const notifStore = useStore('notifications');
  const history = useHistory();
  const staff = staffStore.staffMap[username];
  const [isEditMode, setIsEditMode] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    getStaff(username).then(result => {
      staffStore.updateStaff(result);
    });
  }, [username]);

  const deleteCallback = () => {
    deleteStaff(username)
      .then(() => {
        notifStore.pushNotification('Successfully deleted staff.');
        history.push('/admin/manage/staff');
      })
      .catch(e => {
        notifStore.pushNotification('Could not successfully delete staff.', 'warning');
      });
  };

  const editCallback = () => {
    setIsEditMode(true);
    setPassword('');
  };

  const saveCallback = () => {
    const updateObj = {
      username,
      password: password ? password : undefined,
    };
    updateStaff(updateObj).then(() => {
      notifStore.pushNotification('Successfully updated staff.');
      setIsEditMode(false);
    });
  };

  const renderBottomChild = () => {
    return <h1 className="title">{staff.username}</h1>;
  };

  if (!staff) {
    return null;
  }

  return (
    <div>
      <EntityCard
        bgSrc={BackgroundImage}
        avatarSrc={`https://api.adorable.io/avatars/128/${staff.name}`}
        topIcon={faCrown}
        topText="Manager"
        bottomChild={renderBottomChild()}
        editCallback={editCallback}
        isEditMode={isEditMode}
        saveCallback={saveCallback}
        deleteCallback={sessionStore.entityId === username ? null : deleteCallback}
      >
        <FDSManagerBodyView
          staff={staff}
          editProps={{
            isEditMode,
            password,
            setPassword,
          }}
        />
      </EntityCard>
    </div>
  );
});

export default FDSManagerView;
