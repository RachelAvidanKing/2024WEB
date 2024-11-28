let questionCount = 2; // Initialize counter for questions and answers


function redirectToHome(str) {
    // Redirect the user to the home page
    window.location.href = str;
  }

  async function loginCheck(str) {
    // Get username and password from the form (you may adjust this part based on your input fields)
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    // Check if username or password is empty
    if (username == "" || password == "") {
      alert("Both username and password must be provided!");
      return;
    }
  
    // Check if username and password are correct using checkCorrectData function
    let res = await (checkCorrectData(username, password));
  
    if (res == true) {
      redirectToHome(str);
    } else {
      alert("Username or password does not match!");
    }
  }
    // Function to populate the dropdown options with subjects from the JSON data
function populateDropdownOptions(data) {
  const dropdown = document.getElementById('subjectDropdown');

  // Populate the dropdown with options from the JSON file
  data.subjects.forEach(subject => {
      const option = document.createElement('option');
      option.value = subject.name;
      option.textContent = subject.name;
      dropdown.appendChild(option);
  });
}

// Function to find and display questions for the selected subject
function displaySubjectQuestions(data) {
  const subject = document.getElementById('subjectDropdown').value;
  const questionsContainer = document.getElementById('questionsContainer');

  // Clear existing questions
  questionsContainer.innerHTML = '';

  // Find the selected subject and display its questions
  const selectedSubject = data.subjects.find(s => s.name === subject);

  if (selectedSubject) {
      selectedSubject.questions.forEach(question => {
          const questionElement = document.createElement('p');
          questionElement.textContent = `• ${question}`;
          questionElement.className = 'text-gray-800 bg-gray-100 rounded-md p-2 mb-2';
          questionsContainer.appendChild(questionElement);
      });
  }
}

 function addInputBoxes() {
            const container = document.getElementById('inputContainer');

            // Create a shadowed box for the question and answer pair
            const inputGroup = document.createElement('div');
            inputGroup.className = 'bg-gray-50 shadow-lg rounded-lg p-4 mb-4';

            // Create Question Label
            const questionLabel = document.createElement('label');
            questionLabel.textContent = `Question ${questionCount}`;
            questionLabel.className = 'block text-gray-800 font-bold mb-2';

            // Create Question Input
            const questionInput = document.createElement('input');
            questionInput.type = 'text';
            questionInput.placeholder = `Enter Question ${questionCount}`;
            questionInput.className = 'border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 mb-4';

            // Create Answer Label
            const answerLabel = document.createElement('label');
            answerLabel.textContent = `Answer ${questionCount}`;
            answerLabel.className = 'block text-gray-800 font-bold mb-2';

            // Create Answer Input
            const answerInput = document.createElement('input');
            answerInput.type = 'text';
            answerInput.placeholder = `Enter Answer ${questionCount}`;
            answerInput.className = 'border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-green-400';

            // Append all elements to the group
            inputGroup.appendChild(questionLabel);
            inputGroup.appendChild(questionInput);
            inputGroup.appendChild(answerLabel);
            inputGroup.appendChild(answerInput);

            // Add the group to the container
            container.appendChild(inputGroup);

            // Increment the counter for the next pair
            questionCount++;
        }

        function saveForm() {
            const successMessage = document.getElementById('successMessage');
            const Name= document.getElementById('interviewerName').value;
            const Date= document.getElementById('interviewerDate').value;

            if (Name=="" || Date==""){
              alert('Invalid name or date')
              return;
            }

            successMessage.textContent = 'Form saved successfully!';
            successMessage.classList.remove('hidden');
        }


