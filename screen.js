tailwind.config = {
    darkMode: 'class', // Use 'class' strategy for dark mode
};

let questionCount = 2; // Initialize counter for questions and answers

function redirectPage(str) {
    // Redirect the user to the specified page (home, question, etc.)
    window.location.href = str;
}

async function loginCheck(str) {
    // Get username and password from input fields
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Check if either field is empty
    if (username == "" || password == "") {
        alert("Both username and password must be provided!");
        return; // Stop further execution if fields are empty
    }

    // Validate username and password using `checkCorrectData` function
    let res = await (checkCorrectData(username, password));

    // Redirect if credentials are correct, otherwise show an alert
    if (res == true) {
        redirectPage(str);
    } else {
        alert("Username or password does not match!");
    }
}

// Function to populate dropdown options with subjects from JSON data
function populateDropdownOptions(data) {
    const dropdown = document.getElementById('subjectDropdown');

    // Iterate through subjects and create dropdown options
    data.subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.name;
        option.textContent = subject.name;
        dropdown.appendChild(option); // Add the option to the dropdown
    });
}

// Function to display questions for the selected subject
function displaySubjectQuestions(data) {
    const subject = document.getElementById('subjectDropdown').value; // Get selected subject
    const questionsContainer = document.getElementById('questionsContainer');

    // Clear existing questions
    questionsContainer.innerHTML = '';

    // Find the selected subject and display its questions
    const selectedSubject = data.subjects.find(s => s.name === subject);

    if (selectedSubject) {
        selectedSubject.questions.forEach(question => {
            const questionElement = document.createElement('p');
            questionElement.textContent = `• ${question}`; // Add question text
            questionElement.className = 'text-gray-800 bg-gray-100 rounded-md p-2 mb-2'; // Style the question
            questionsContainer.appendChild(questionElement);
        });
    }
}

function addInputBoxes() {
    // Validate the current question and answer inputs
    let currentQuestion = document.getElementById(`question${questionCount - 1}`).value;
    let currentAnswer = document.getElementById(`answer${questionCount - 1}`).value;

    if (currentQuestion === "" || currentAnswer === "") {
        alert('Please fill in the current question and answer before adding more.');
        return; // Prevent adding new inputs if the last pair is incomplete
    }

    const container = document.getElementById('inputContainer');

    // Create a new container for the next question and answer
    const inputGroup = document.createElement('div');
    inputGroup.className = 'bg-gray-50 shadow-lg rounded-lg p-4 mb-4';

    // Create and configure the question label and input
    const questionLabel = document.createElement('label');
    questionLabel.textContent = `Question ${questionCount}`;
    questionLabel.className = 'block text-gray-800 font-bold mb-2';

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.placeholder = `Enter Question ${questionCount}`;
    questionInput.id = `question${questionCount}`;
    questionInput.className = 'border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 mb-4';

    // Create and configure the answer label and input
    const answerLabel = document.createElement('label');
    answerLabel.textContent = `Answer ${questionCount}`;
    answerLabel.className = 'block text-gray-800 font-bold mb-2';

    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = `Enter Answer ${questionCount}`;
    answerInput.id = `answer${questionCount}`;
    answerInput.className = 'border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-green-400';

    // Append elements to the input group and then to the container
    inputGroup.appendChild(questionLabel);
    inputGroup.appendChild(questionInput);
    inputGroup.appendChild(answerLabel);
    inputGroup.appendChild(answerInput);
    container.appendChild(inputGroup);

    questionCount++; // Increment the question counter
}

function AlertApi() {
    // Alert to indicate API transfer
    alert("Transferring to external API");
}

function saveForm() {
    const successMessage = document.getElementById('successMessage');
    let Name = document.getElementById("interviewerName").value;
    let Date = document.getElementById("interviewDate").value;

    // Check if name and date are provided
    if (Name == "" || Date == "") {
        alert('Invalid name or date');
        return; // Stop further execution
    }

    // Display success message
    successMessage.textContent = 'Form saved successfully!';
    successMessage.classList.remove('hidden');
}

// Function to limit date input to today or earlier
window.onload = function() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    document.getElementById('interviewDate').setAttribute('max', today); // Set the max date
};

const createTable = (data) => {
    const app = document.getElementById("app");

    // Clear any existing table and set title
    app.innerHTML = `
        <h1 class="text-2xl font-bold text-gray-800 text-center mb-6">History Table</h1>
    `;

    // Map data to table rows
    const rows = data
        .map(
            (item) => `
            <tr class="border-b hover:bg-gray-50 cursor-pointer" onclick="showPopup('${item.name}')">
                <td class="p-4 text-gray-700">${item.name}</td>
                <td class="p-4 text-gray-700">${item.subject}</td>
                <td class="p-4 text-gray-700">${item.date}</td>
            </tr>
        `
        )
        .join("");

    // Add the table structure and rows
    const table = `
        <table class="min-w-full border-collapse border border-gray-200 rounded-lg shadow-sm">
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-4 text-left text-gray-600">Name</th>
                    <th class="p-4 text-left text-gray-600">Subject</th>
                    <th class="p-4 text-left text-gray-600">Date</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;

    app.insertAdjacentHTML("beforeend", table);
};

const showPopup = (name) => {
    // Display popup with details of the selected interview
    const summaryItem = summaryData.subjects.find((item) => item.name === name);
    const popupTitle = document.getElementById("popup-title");
    const popupContent = document.getElementById("popup-content");
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");

    // Set popup content
    popupTitle.textContent = summaryItem
        ? `${summaryItem.name} - ${summaryItem.subject}`
        : "No Data Available";

    if (summaryItem && summaryItem.questions_and_answers) {
        popupContent.innerHTML = summaryItem.questions_and_answers
            .map(
                (qa) =>
                    `<li><strong>${qa.question}</strong><br><span>${qa.answer}</span></li>`
            )
            .join("");
    } else {
        popupContent.innerHTML = "<li>No summary data available</li>";
    }

    // Show popup
    overlay.classList.remove("hidden");
    popup.classList.remove("hidden");
};

// Function to close the popup
const closePopup = () => {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("popup").classList.add("hidden");
};

// Add event listeners for closing popup and initializing table
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("close-popup").addEventListener("click", closePopup);
    document.getElementById("overlay").addEventListener("click", closePopup);

    // Fetch data and populate table
    FetchDataForTable();
});

// Function to toggle the dark mode class on the <html> element
function toggleTheme() {
    const htmlElement = document.documentElement;

    // Toggle the 'dark' class
    htmlElement.classList.toggle('dark');
}
