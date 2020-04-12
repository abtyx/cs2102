import React, { useEffect } from 'react';
import RidersPaginationView from './RidersPaginationView';
import Searchbar from '../../../common/Searchbar';
import { getRiders } from '../../../../api';
import useStore from '../../../../stores';
import { observer } from 'mobx-react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import FlexCenter from '../../../common/FlexCenter';
import NewRiderView from './NewRiderView';

const ManageRidersView = observer(() => {
  const riderStore = useStore('riders');
  useEffect(() => {
    riderStore.resetSearch();
    getRiders().then(result => riderStore.replaceRiders(result));
  }, []);

  return (
    <div>
      <Switch>
        <Route path="/admin/manage/riders/new">
          <NewRiderView />
        </Route>
        <Route path="/admin/manage/riders">
          <div className="m-b-md">
            <h1 className="title">Manage Riders</h1>
            <FlexCenter>
              <Link className="button is-primary m-r-md" to="/admin/manage/riders/new">
                New
              </Link>
              <Searchbar
                searchTerm={riderStore.searchTerm}
                setSearchTerm={riderStore.setSearchTerm}
              />
            </FlexCenter>
          </div>
          <RidersPaginationView
            riders={riderStore.displayedRiders}
            page={riderStore.pageNumber}
            setPage={riderStore.setPage}
            totalPages={riderStore.filteredPageCount}
          />
        </Route>
      </Switch>
    </div>
  );
});

export default ManageRidersView;
