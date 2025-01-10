import React from "react";

// Functional component to render a table with headers and rows
const Table = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse w-full bg-white dark:bg-gray-800">
        {/* Table header */}
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left font-medium text-gray-800 dark:text-gray-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100 dark:hover:bg-gray-600">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 text-gray-800 dark:text-gray-200"
                >
                  {cell}
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
