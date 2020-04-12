import React from 'react';
import Pagination from './Pagination';
import { motion } from 'framer-motion';

const PaginationView = ({ data, keyMapper, component: Component, page, setPage, totalPages }) => (
  <div>
    <motion.div positionTransition>
      {data.map((entry, i) => (
        <motion.div key={keyMapper(entry)} positionTransition>
          <Component data={entry} index={i} />
        </motion.div>
      ))}
    </motion.div>
    <Pagination
      className="m-t-md is-centered"
      page={page}
      totalPages={totalPages}
      setPage={setPage}
    />
  </div>
);

PaginationView.defaultProps = {
  keyMapper: x => x.username,
};

export default PaginationView;
