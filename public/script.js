document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = '/dashboard'; // Redirect to dashboard or another page on success
    } else {
      document.getElementById('message').textContent = data.error;
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
