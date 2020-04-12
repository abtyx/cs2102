import React, { useEffect } from 'react';
import { getRestaurants } from '../../../../api';
import useStore from '../../../../stores';
import { observer } from 'mobx-react';
import RestaurantsPaginationView from './RestaurantsPaginationView';
import Searchbar from '../../../common/Searchbar';
import FlexCenter from '../../../common/FlexCenter';
import { Link, Switch, Route } from 'react-router-dom';
import NewRestaurantView from './NewRestaurantView';

const ManageRestaurantsView = observer(() => {
  const restaurantsStore = useStore('restaurants');
  useEffect(() => {
    restaurantsStore.resetSearch();
    getRestaurants().then(result => restaurantsStore.replaceRestaurants(result));
  }, []);

  return (
    <div>
      <Switch>
        <Route path="/admin/manage/restaurants/new">
          <NewRestaurantView />
        </Route>
        <Route path="/admin/manage/restaurants">
          <div className="m-b-md">
            <h1 className="title">Manage Restaurants</h1>
            <FlexCenter>
              <Link className="button is-primary m-r-md" to="/admin/manage/restaurants/new">
                New
              </Link>
              <Searchbar
                searchTerm={restaurantsStore.searchTerm}
                setSearchTerm={restaurantsStore.setSearchTerm}
              />
            </FlexCenter>
          </div>
          <RestaurantsPaginationView
            restaurants={restaurantsStore.displayedRestaurants}
            page={restaurantsStore.pageNumber}
            setPage={restaurantsStore.setPage}
            totalPages={restaurantsStore.filteredPageCount}
          />
        </Route>
      </Switch>
    </div>
  );
});

export default ManageRestaurantsView;
