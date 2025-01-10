import React from "react";

// Functional component to create a reusable table
const Table = ({ headers, rows }) => {
  return (
    <table className="table-auto border-collapse border border-gray-400 w-full">
      {/* Table Header */}
      <thead className="bg-purple-100">
        <tr>
          {/* Dynamically map through the headers array to create table header cells */}
          {headers.map((header, index) => (
            <th
              key={index} // Unique key for each header element to ensure React efficiently updates the DOM
              className="px-4 py-2 text-left font-medium text-purple-900" // Styling for table headers
            >
              {header} {/* Render header text */}
            </th>
          ))}
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="bg-white divide-y divide-gray-200">
        {/* Dynamically map through the rows array to create table rows */}
        {rows.map((row, index) => (
          <tr
            key={index} // Unique key for each row to help React identify rows
            className="bg-white hover:bg-gray-100 transition-colors" // Adds hover effect and transitions for rows
          >
            {/* Map through each cell in a row to create table data cells */}
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex} // Unique key for each cell within a row
                className="px-6 py-4 text-gray-900" // Styling for table data cells
              >
                {cell} {/* Render cell content */}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table; 
