document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            document.getElementById('error-message').textContent = 'Invalid credentials';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('error-message').textContent = 'Failed to login';
    }
});
