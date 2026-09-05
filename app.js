// Shared Utility & Global API configuration

const API_BASE_URL = 'http://localhost:8080/api';

// Auth Session Helpers
const Auth = {
    getUser: function() {
        const userStr = localStorage.getItem('plant_user');
        return userStr ? JSON.parse(userStr) : null;
    },
    setUser: function(user) {
        localStorage.setItem('plant_user', JSON.stringify(user));
    },
    logout: function() {
        localStorage.removeItem('plant_user');
        window.location.href = 'login.html';
    },
    isLoggedIn: function() {
        return this.getUser() !== null;
    },
    isAdmin: function() {
        const user = this.getUser();
        return user && user.role === 'ROLE_ADMIN';
    }
};

// Update Navbar Links Dynamically
document.addEventListener('DOMContentLoaded', function() {
    renderNavbar();
});

function renderNavbar() {
    const navUserArea = document.getElementById('navUserArea');
    if (!navUserArea) return;

    const user = Auth.getUser();

    if (user) {
        let adminBtn = '';
        if (user.role === 'ROLE_ADMIN') {
            adminBtn = `<li class="nav-item"><a class="nav-link text-danger fw-bold" href="admin.html"><i class="fas fa-user-shield me-1"></i>Admin Dashboard</a></li>`;
        }

        navUserArea.innerHTML = `
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link" href="dashboard.html"><i class="fas fa-home me-1"></i>Dashboard</a></li>
                <li class="nav-item"><a class="nav-link fw-bold text-success" href="detect.html"><i class="fas fa-camera me-1"></i>Check Plant</a></li>
                <li class="nav-item"><a class="nav-link" href="history.html"><i class="fas fa-history me-1"></i>History</a></li>
                <li class="nav-item"><a class="nav-link" href="guide.html"><i class="fas fa-book-open me-1"></i>Disease Guide</a></li>
                ${adminBtn}
            </ul>
            <div class="d-flex align-items-center gap-3">
                <span class="fw-semibold text-dark"><i class="fas fa-user-circle me-1 text-success"></i>${user.name}</span>
                <button class="btn btn-outline-danger btn-sm rounded-pill px-3" onclick="Auth.logout()"><i class="fas fa-sign-out-alt me-1"></i>Logout</button>
            </div>
        `;
    } else {
        navUserArea.innerHTML = `
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="how-it-works.html">How It Works</a></li>
                <li class="nav-item"><a class="nav-link" href="guide.html">Disease Guide</a></li>
                <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
            </ul>
            <div class="d-flex gap-2">
                <a href="login.html" class="btn btn-agri-secondary px-3 py-2 btn-sm">Login</a>
                <a href="register.html" class="btn btn-agri-primary px-3 py-2 btn-sm">Register</a>
            </div>
        `;
    }
}

// Show Alert Toasts/Banners
function showAlert(message, type = 'danger') {
    const alertBox = document.getElementById('alertMessage');
    if (!alertBox) return;

    alertBox.className = `alert alert-${type} alert-dismissible fade show rounded-3 shadow-sm`;
    alertBox.innerHTML = `
        <span><i class="${type === 'danger' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'} me-2"></i>${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertBox.classList.remove('d-none');

    // Auto dismiss after 6s
    setTimeout(() => {
        alertBox.classList.add('d-none');
    }, 6000);
}
