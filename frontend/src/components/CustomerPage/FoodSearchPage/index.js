import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Searchbar from '../../common/Searchbar';
import PaginationView from '../../common/PaginationView';
import useStore from '../../../stores';
import { getCategories, searchFood } from '../../../api';
import FlexCenter from '../../common/FlexCenter';

const FoodSearchPage = () => {
  const foodSearchStore = useStore('foodSearch');

  useEffect(() => {
    getCategories().then(result => {
      foodSearchStore.replaceCategories(result);
      foodSearchStore.setCategoryIdx(0);
      foodSearchStore.setPage(0);
    });
  }, []);
  useEffect(() => {
    foodSearchStore.reset();
  }, []);

  useEffect(() => {
    searchFood(foodSearchStore.searchTerm, foodSearchStore.selectedCategory).then(result => {
      foodSearchStore.replaceResults(result);
    });
  }, [foodSearchStore.categoryIdx, foodSearchStore.categories, foodSearchStore.searchTerm]);

  return (
    <div>
      <FlexCenter>
        <Searchbar
          searchTerm={foodSearchStore.searchTerm}
          setSearchTerm={foodSearchStore.setSearchTerm}
        />
        <div className="select m-l-md">
          <select
            value={foodSearchStore.categoryIdx}
            onChange={e => foodSearchStore.setCategoryIdx(e.target.value)}
          >
            {foodSearchStore.categories.map((cat, i) => (
              <option value={i} key={i}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </FlexCenter>
      <div className="m-t-md m-b-md">
        Showing results{' '}
        {foodSearchStore.displayedItems.length === 0
          ? 0
          : foodSearchStore.pageNumber * foodSearchStore.numberPerPage + 1}{' '}
        -{' '}
        {foodSearchStore.pageNumber * foodSearchStore.numberPerPage +
          foodSearchStore.displayedItems.length}
        {foodSearchStore.searchTerm ? ` for '${foodSearchStore.searchTerm}'` : null} in the{' '}
        {foodSearchStore.categories[foodSearchStore.categoryIdx]} category
      </div>
      <PaginationView
        data={foodSearchStore.displayedItems}
        component={FoodSearchEntry}
        page={foodSearchStore.pageNumber}
        setPage={foodSearchStore.setPage}
        keyMapper={item => item.id}
        totalPages={foodSearchStore.pageCount}
      />
    </div>
  );
};

const FoodSearchEntry = ({ data: foodItem }) => (
  <div className="card m-b-sm">
    <div className="card-content">
      <p className="is-size-4">{foodItem.name}</p>
      <p>${foodItem.price}</p>
      <p>
        Sold by <b>{foodItem.restName}</b>
      </p>
    </div>
  </div>
);

export default observer(FoodSearchPage);
