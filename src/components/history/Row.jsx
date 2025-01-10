import React from 'react';
import Column from './Column'; 

// Define the Row component, which represents a single row in a table
const Row = ({ rowData }) => {
    return (
        <tr>
            {/* Map through the rowData array to create a Column for each data element */}
            {rowData.map((data, index) => (
                // Pass each data item as content to the Column component
                // Use the index as a unique key for each Column
                <Column key={index} content={data} />
            ))}
        </tr>
    );
};

export default Row; 
