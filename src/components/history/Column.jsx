import React from "react";

// Functional component to render a single table column (cell)
const Column = ({ content }) => {
  return (
    // Render a table cell (td) with responsive styling
    <td className="border px-4 py-2 text-gray-800 text-sm sm:text-base w-full md:w-auto">
      {content} {/* Display the content passed as a prop */}
    </td>
  );
};

export default Column;
