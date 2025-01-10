import React from "react";

// Functional component to render a reusable and responsive table
const Table = ({ headers, rows }) => {
  return (
    // Wrapper for horizontal scrolling on smaller screens
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-400 w-full">
        {/* Table header section */}
        <thead className="bg-purple-100">
          <tr>
            {/* Dynamically generate table headers */}
            {headers.map((header, index) => (
              <th
                key={index} // Unique key for each header element
                className="px-4 py-2 text-left font-medium text-purple-900 text-sm sm:text-base"
              >
                {header} {/* Render header content */}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table body section */}
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Dynamically generate table rows */}
          {rows.map((row, index) => (
            <tr
              key={index} // Unique key for each row
              className="bg-white hover:bg-gray-100 transition-colors" // Hover effect for rows
            >
              {/* Generate cells for each row */}
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex} // Unique key for each cell within a row
                  className="px-6 py-4 text-gray-900 text-sm sm:text-base"
                >
                  {cell} {/* Render cell content */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
