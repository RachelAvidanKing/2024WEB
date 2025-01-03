import React from 'react';
import Line from './Row'; // Import the Row component (referred to as Line) to render individual rows in the table

// Define the Table component, which creates a complete table structure with headers and rows
const Table = ({ headers, rows }) => {
    return (
        // Table element with styling for responsive and consistent appearance
        <table className="table-auto border-collapse border border-gray-400 w-full">
            {/* Table header section */}
            <thead>
                <tr className="bg-gray-100">
                    {/* Map through the headers array to create a header cell (<th>) for each item */}
                    {headers.map((header, index) => (
                        <th 
                            key={index} // Use index as a unique key for each header cell
                            className="border px-4 py-2" // Apply styling for table headers
                        >
                            {header} {/* Display the header text */}
                        </th>
                    ))}
                </tr>
            </thead>
            {/* Table body section */}
            <tbody>
                {/* Map through the rows array to create a Line (Row) component for each row */}
                {rows.map((row, index) => (
                    <Line 
                        key={index} // Use index as a unique key for each row
                        rowData={row} // Pass the row data as a prop to the Line component
                    />
                ))}
            </tbody>
        </table>
    );
};

export default Table; 
