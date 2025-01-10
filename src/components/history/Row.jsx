import React from "react";
import Column from "./Column";

// Functional component to represent a single row in a table
const Row = ({ rowData }) => {
  return (
    // Use flex layout for responsiveness and fallback to traditional table-row for larger screens
    <tr className="flex flex-wrap md:table-row">
      {/* Map through the rowData array to generate columns for each data item */}
      {rowData.map((data, index) => (
        <Column key={index} content={data} /> // Pass each data item as content to the Column component
      ))}
    </tr>
  );
};

export default Row;
