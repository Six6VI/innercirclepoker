// Function to display the logged-in user's name in the navbar
// Function to display the logged-in user's name in the navbar and redirect non-signed-on users
function displayLoggedInUserName() {
    var loggedInUserName = sessionStorage.getItem('loggedInUserName');
    if (loggedInUserName) {
        var userDisplayNameElement = document.getElementById('userDisplayName');
        userDisplayNameElement.textContent = loggedInUserName;
    } else {
        // If the user is not logged in, redirect to the login page
        window.location.href = 'index.html'; // Replace 'login.html' with the actual login page URL
    }
}

// Call the function to display the user's name when the DOM content is loaded
document.addEventListener('DOMContentLoaded', displayLoggedInUserName);

//function displayLoggedInUserName() {
//    var loggedInUserName = sessionStorage.getItem('loggedInUserName');
//    if (loggedInUserName) {
//        var userDisplayNameElement = document.getElementById('userDisplayName');
//        userDisplayNameElement.textContent = loggedInUserName;
//    }
//}
//
//// Call the function to display the user's name when the DOM content is loaded
//document.addEventListener('DOMContentLoaded', displayLoggedInUserName);
