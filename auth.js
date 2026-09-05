// Authentication handlers for Login and Registration forms

document.addEventListener('DOMContentLoaded', function() {

    // Register Form Listener
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!name || !email || !password) {
                showAlert('Please fill in all required fields.');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('Passwords do not match. Please re-enter passwords.');
                return;
            }

            if (password.length < 6) {
                showAlert('Password must be at least 6 characters long.');
                return;
            }

            const submitBtn = document.getElementById('registerBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...`;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    Auth.setUser(data);
                    window.location.href = data.role === 'ROLE_ADMIN' ? 'admin.html' : 'dashboard.html';
                } else {
                    showAlert(data.message || data.error || 'Registration failed. Please try again.');
                }
            } catch (err) {
                console.error(err);
                showAlert('Could not connect to server. Please check your internet connection.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fas fa-user-plus me-2"></i>Create Account`;
            }
        });
    }

    // Login Form Listener
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showAlert('Please enter your email and password.');
                return;
            }

            const submitBtn = document.getElementById('loginBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Logging in...`;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    Auth.setUser(data);
                    window.location.href = data.role === 'ROLE_ADMIN' ? 'admin.html' : 'dashboard.html';
                } else {
                    showAlert(data.message || 'Invalid email address or password.');
                }
            } catch (err) {
                console.error(err);
                showAlert('Could not connect to server. Please ensure backend is running.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fas fa-sign-in-alt me-2"></i>Login`;
            }
        });
    }
});
