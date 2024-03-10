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
