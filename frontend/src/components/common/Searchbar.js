import React from 'react';
import FAIcon from './FAIcon';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';

const Searchbar = ({ searchTerm, setSearchTerm }) => (
  <div className="control has-icons-left">
    <input
      className="input"
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
    <span className="icon is-left">
      <FAIcon icon={faSearch} />
    </span>
  </div>
);

export default Searchbar;
