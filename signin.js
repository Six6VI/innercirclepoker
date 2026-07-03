async function displayLoggedInUserName() {
    try {
        var response = await fetch('/api/me');
        if (!response.ok) {
            window.location.href = 'index.html';
            return;
        }

        var payload = await response.json();
        var userDisplayNameElement = document.getElementById('userDisplayName');
        if (userDisplayNameElement) {
            userDisplayNameElement.textContent = payload.user.name;
        }
    } catch (_error) {
        window.location.href = 'index.html';
    }
}

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
