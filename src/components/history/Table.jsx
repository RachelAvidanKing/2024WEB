import React from "react";

// Functional component to render a table with headers and rows
const Table = ({ headers, rows }) => {
  return (
    // Container for horizontal scrolling (useful for small screens)
    <div className="overflow-x-auto">
      {/* Main table element with responsive design and light/dark mode styles */}
      <table className="table-auto border-collapse w-full bg-white dark:bg-gray-800">
        {/* Table header section */}
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            {headers.map((header, index) => (
              // Render each header cell with styling
              <th
                key={index} // Unique key for each header cell
                className="px-4 py-2 text-left font-medium text-gray-800 dark:text-gray-200"
              >
                {header} {/* Display header text */}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table body section */}
        <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
          {rows.map((row, rowIndex) => (
            // Render each row with a hover effect
            <tr
              key={rowIndex} // Unique key for each row
              className="hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {row.map((cell, cellIndex) => (
                // Render each cell within the row
                <td
                  key={cellIndex} // Unique key for each cell
                  className="px-4 py-2 text-gray-800 dark:text-gray-200"
                >
                  {cell} {/* Display cell content */}
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
