async function submitPasswordChange(event) {
  event.preventDefault();

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;

  try {
    const response = await fetch('/api/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'Could not change password.');
    }

    alert('Password updated successfully.');
    window.location.href = 'homepage.html';
  } catch (error) {
    alert(error.message || 'Could not change password.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('change-password-form');
  if (form) {
    form.addEventListener('submit', submitPasswordChange);
  }
});
