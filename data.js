// checkCorrectData function

async function checkCorrectData(username, password) {
    try {
        // Fetch the JSON file
        const response = await fetch("users.json");
        const data = await response.json();


          // Debug each user and the comparison logic
          const userExists = data.users.some(user => {
            return user.username === username && user.password === password;
        });
        if (userExists) {
            // If login is successful, redirect to the given page
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

function populateDropdown() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => populateDropdownOptions(data))
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
        });
}

// Function to fetch and display questions based on the selected subject
function displayQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => displaySubjectQuestions(data))
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
        });
}

// Call populateDropdown when the page loads
window.onload = populateDropdown;