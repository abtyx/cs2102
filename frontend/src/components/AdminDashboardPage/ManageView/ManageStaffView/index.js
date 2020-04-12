import React, { useEffect } from 'react';
import { getAllStaff } from '../../../../api';
import useStore from '../../../../stores';
import { observer } from 'mobx-react';
import StaffPaginationView from './StaffPaginationView';
import Searchbar from '../../../common/Searchbar';
import { Switch, Route, Link } from 'react-router-dom';
import FlexCenter from '../../../common/FlexCenter';
import NewStaffView from './NewStaffView';

const ManageStaffView = observer(() => {
  const staffStore = useStore('staff');
  useEffect(() => {
    staffStore.resetSearch();
    getAllStaff().then(result => staffStore.replaceStaff(result));
  }, []);

  return (
    <div>
      <Switch>
        <Route path="/admin/manage/staff/new">
          <NewStaffView />
        </Route>
        <Route path="/admin/manage/staff">
          <div className="m-b-md">
            <h1 className="title">Manage Staff</h1>
            <FlexCenter>
              <Link className="button is-primary m-r-md" to="/admin/manage/staff/new">
                New
              </Link>
              <Searchbar
                searchTerm={staffStore.searchTerm}
                setSearchTerm={staffStore.setSearchTerm}
              />
            </FlexCenter>
          </div>
          <StaffPaginationView
            staff={staffStore.displayedStaff}
            page={staffStore.pageNumber}
            setPage={staffStore.setPage}
            totalPages={staffStore.filteredPageCount}
          />
        </Route>
      </Switch>
    </div>
  );
});

export default ManageStaffView;
