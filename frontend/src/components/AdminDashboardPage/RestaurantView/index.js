import { faStore } from '@fortawesome/pro-regular-svg-icons';
import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import BackgroundImage from '../../../assets/backgrounds/double-bubble.png';
import useStore from '../../../stores';
import EntityCard from '../../common/EntityCard';
import RestaurantBodyView from './RestaurantBodyView';
import {
  deleteRestaurant,
  getRestaurant,
  updateRestaurant,
  getRestaurantSummary,
} from '../../../api';
import LabelledField from '../../common/LabelledField';
import moment from 'moment';

const RestaurantView = observer(() => {
  const { id: username } = useParams();
  const restaurantStore = useStore('restaurants');
  const notifStore = useStore('notifications');
  const history = useHistory();
  const restaurant = restaurantStore.restaurantMap[username];
  const [month, setMonth] = useState(moment().month() + 1);
  const [year, setYear] = useState(moment().year());
  const [isEditMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [minOrder, setMinOrder] = useState(0);

  useEffect(() => {
    getRestaurant(username).then(result => {
      restaurantStore.updateRestaurant(result);
    });
  }, [username]);

  useEffect(() => {
    getRestaurantSummary(username, month, year).then(result => {
      console.log(result);
      restaurantStore.updateRestaurant({ username, ...result });
    });
  }, [username, month, year]);

  const deleteCallback = () => {
    deleteRestaurant(username)
      .then(() => {
        notifStore.pushNotification('Successfully deleted restaurant.');
        history.push('/admin/manage/restaurants');
      })
      .catch(e => {
        notifStore.pushNotification('Could not successfully delete restaurant.', 'warning');
      });
  };

  const editCallback = () => {
    setEditMode(true);
    setName(restaurant.name);
    setMinOrder(restaurant.minOrder);
    setUsername(restaurant.username);
  };

  const saveCallback = () => {
    updateRestaurant({
      username,
      name,
      minOrder,
    }).then(() => {
      getRestaurant(username).then(result => {
        restaurantStore.updateRestaurant(result);
        notifStore.pushNotification('Successfully updated restaurant.');
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
    }
    return <h1 className="title">{restaurant.name}</h1>;
  };

  if (!restaurant) {
    return null;
  }

  return (
    <EntityCard
      bgSrc={BackgroundImage}
      avatarSrc={`https://api.adorable.io/avatars/128/${restaurant.name}`}
      topIcon={faStore}
      topText="Restaurant"
      bottomChild={renderBottomChild()}
      isEditMode={isEditMode}
      editCallback={editCallback}
      saveCallback={saveCallback}
      deleteCallback={deleteCallback}
    >
      <RestaurantBodyView
        restaurant={restaurant}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        editProps={{
          isEditMode,
          minOrder,
          setMinOrder,
        }}
      />
    </EntityCard>
  );
});

export default RestaurantView;
