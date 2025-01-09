import React from "react";

const Table = ({ headers, rows }) => {
  return (
    <table className="table-auto border-collapse border border-gray-400 w-full">
      {/* Table Header */}
      <thead className="bg-purple-100">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-4 py-2 text-left font-medium text-purple-900"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="bg-white divide-y divide-gray-200">
        {rows.map((row, index) => (
          <tr
            key={index}
            className="bg-white hover:bg-gray-100 transition-colors"
          >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-6 py-4 text-gray-900">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
