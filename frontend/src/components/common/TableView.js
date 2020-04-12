import React from 'react';

const TableView = ({ headers, data, height }) => (
  <div style={{ height, width: '100%', overflow: 'scroll' }}>
    <table className="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          {headers.map((label, i) => (
            <th key={i}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((v, i) => (
          <tr key={i}>
            {v.map((col, j) => (
              <td key={j}>{col}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

TableView.defaultProps = {
  height: '100%',
  data: [],
  headers: [],
};

export default TableView;
