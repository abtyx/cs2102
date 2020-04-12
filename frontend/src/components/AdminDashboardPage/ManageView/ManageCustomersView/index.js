import React, { useEffect } from 'react';
import { getCustomers } from '../../../../api';
import useStore from '../../../../stores';
import { observer } from 'mobx-react';
import CustomersPaginationView from './CustomersPaginationView';
import Searchbar from '../../../common/Searchbar';
import FlexCenter from '../../../common/FlexCenter';

const ManageCustomersView = observer(() => {
  const customerStore = useStore('customers');
  useEffect(() => {
    customerStore.resetSearch();
    getCustomers().then(result => customerStore.replaceCustomers(result));
  }, []);

  return (
    <div>
      <h1 className="title">Manage Customers</h1>
      <div className="m-b-md">
        <FlexCenter>
          <Searchbar
            searchTerm={customerStore.searchTerm}
            setSearchTerm={customerStore.setSearchTerm}
          />
        </FlexCenter>
      </div>
      <CustomersPaginationView
        customers={customerStore.displayedCustomers}
        page={customerStore.pageNumber}
        setPage={customerStore.setPage}
        totalPages={customerStore.filteredPageCount}
      />
    </div>
  );
});

export default ManageCustomersView;
