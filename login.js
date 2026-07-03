async function handleLogin(event) {
    event.preventDefault();

    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value;

    try {
        var response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        var payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.message || 'Login failed.');
        }

        window.location.href = 'homepage.html';
    } catch (error) {
        alert(error.message || 'Invalid username or password.');
    }
}

document.getElementById('login-form').addEventListener('submit', handleLogin);

//function loadCSV(callback) {
//    var xhr = new XMLHttpRequest();
//    xhr.onreadystatechange = function() {
//        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//            callback(xhr.responseText);
//        }
//    };
//    xhr.open('GET', 'users.csv', true);
//    xhr.send();
//}
//
//// Function to check credentials
//function checkCredentials(username, password, csvData) {
//    var users = csvData.split(/\r?\n/).slice(1); // Skip header and split by lines
//    for (var i = 0; i < users.length; i++) {
//        var userData = users[i].split(','); // Split each line by comma
//        // Check if username and password match
//        if (userData[1] === username && userData[2] === password) {
//            return true; // Match found
//        }
//    }
//    return false; // No match found
//}
//
//
//// Event listener for form submission
//document.getElementById('login-form').addEventListener('submit', function(event) {
//    event.preventDefault(); // Prevent default form submission
//
//    // Get input values
//    var username = document.getElementById('username').value;
//    var password = document.getElementById('password').value;
//
//    // Load CSV file and check credentials
//    loadCSV(function(csvData) {
//        if (checkCredentials(username, password, csvData)) {
//            // Redirect to another page
//            window.location.href = 'homepage.html'; // Change 'dashboard.html' to the desired page
//        } else {
//            alert('Invalid username or password. Please try again.');
//        }
//    });
//});
