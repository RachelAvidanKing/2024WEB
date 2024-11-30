// Initialize empty arrays for storing table data and summary data
let tableData = [];
let summaryData = [];

// Function to validate username and password
// This function checks the provided username and password against the users in the "users.json" file
async function checkCorrectData(username, password) {
    try {
        // Fetch the JSON file containing user data
        const response = await fetch("users.json");
        const data = await response.json();

        // Check if the provided username and password exist in the fetched user data
        const userExists = data.users.some(user => {
            return user.username === username && user.password === password;
        });

        // Return true if user exists and credentials are correct, otherwise return false
        if (userExists) {
            return true; // Login successful
        } else {
            return false; // Login failed
        }
    } catch (error) {
        // Log an error if there was an issue loading the user data
        console.error("Error loading user data:", error);
    }
}

// Function to populate dropdown options for subjects
function populateDropdown() {
    // Fetch the JSON file containing question data
    fetch('questions.json')
        .then(response => response.json()) // Parse the response as JSON
        .then(data => populateDropdownOptions(data)) // Populate dropdown with fetched data
        .catch(error => {
            // Log an error if there was an issue fetching the JSON file
            console.error('Error fetching the JSON file:', error);
        });
}

// Function to fetch and display questions based on the selected subject
function displayQuestions() {
    // Fetch the JSON file containing question data
    fetch('questions.json')
        .then(response => response.json()) // Parse the response as JSON
        .then(data => displaySubjectQuestions(data)) // Display the questions for the selected subject
        .catch(error => {
            // Log an error if there was an issue fetching the JSON file
            console.error('Error fetching the JSON file:', error);
        });
}

// Function to fetch table data and log it, then call a function to create the table
const getDataforTable = async () => {
    const response = await fetch("tabledata.json"); // Fetch the JSON file containing table data
    const data = await response.json(); // Parse the response as JSON
    console.log(data); // Log the fetched data to the console for debugging
    createTable(data); // Call the function to create a table with the fetched data
};

// Function to fetch both table data and summary data and populate the table
const FetchDataForTable = async () => {
    try {
        // Fetch table data from the "tabledata.json" file
        const tableResponse = await fetch("tabledata.json");
        tableData = await tableResponse.json(); // Store the fetched data in the `tableData` variable

        // Fetch summary data from the "summary.json" file
        const summaryResponse = await fetch("summary.json");
        summaryData = await summaryResponse.json(); // Store the fetched data in the `summaryData` variable

        // Call the function to create a table using the subjects in the fetched table data
        createTable(tableData.subjects);
    } catch (error) {
        // Log an error if there was an issue fetching the data
        console.error("Error fetching data:", error);
    }
};

// Populate the dropdown menu with data when the "question.html" page is loaded
if (window.location.pathname.endsWith('question.html')) {
    window.onload = populateDropdown; // Call `populateDropdown` on page load
}

// Fetch and populate table data when the "history.html" page is loaded
if (window.location.pathname.endsWith('history.html')) {
    window.onload = FetchDataForTable; // Call `FetchDataForTable` on page load
}
