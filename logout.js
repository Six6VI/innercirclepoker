// Function to handle logout
function logout() {
    // Clear session storage
    sessionStorage.removeItem('loggedInUserName');
    // Redirect to login page
    window.location.href = 'index.html'; // Change 'login.html' to your login page
}

// Function to handle change password
function changePassword() {
    // Redirect to change password page
    window.location.href = 'chgpass.html'; // Change 'change_password.html' to your change password page
}

// Event listeners for dropdown menu items
document.getElementById('logout').addEventListener('click', logout);
document.getElementById('changePassword').addEventListener('click', changePassword);

// Function to display the logged-in user's name in the navbar
function displayLoggedInUserName() {
    var loggedInUserName = sessionStorage.getItem('loggedInUserName');
    if (loggedInUserName) {
        var userDisplayNameElement = document.getElementById('userDisplayName');
        userDisplayNameElement.textContent = loggedInUserName;
    }
}

// Call the function to display the user's name when the DOM content is loaded
document.addEventListener('DOMContentLoaded', displayLoggedInUserName);
