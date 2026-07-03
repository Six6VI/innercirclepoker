async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
    } catch (_error) {
        // Continue redirect even if request fails.
    }
    window.location.href = 'index.html';
}

// Function to handle change password
function changePassword() {
    // Redirect to change password page
    window.location.href = 'chgpass.html'; // Change 'change_password.html' to your change password page
}

document.getElementById('logout').addEventListener('click', logout);
document.getElementById('changePassword').addEventListener('click', changePassword);
