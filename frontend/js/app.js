// Shared Utility & Global API configuration - Simplified (No Login Required)

const API_BASE_URL = 'http://localhost:8080/api';

// Anonymous Guest User Context (No Login Required)
const Auth = {
    getUser: function() {
        return { id: 1, name: 'Farmer', role: 'ROLE_FARMER' };
    },
    isLoggedIn: function() {
        return true;
    },
    isAdmin: function() {
        return false;
    }
};

// Render Simple Navigation Bar (Without Login/Register)
document.addEventListener('DOMContentLoaded', function() {
    renderNavbar();
});

function renderNavbar() {
    const navUserArea = document.getElementById('navUserArea');
    if (!navUserArea) return;

    navUserArea.innerHTML = `
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="index.html"><i class="fas fa-home me-1"></i>Home</a></li>
            <li class="nav-item"><a class="nav-link fw-bold text-success" href="detect.html"><i class="fas fa-camera me-1"></i>Check Plant</a></li>
            <li class="nav-item"><a class="nav-link" href="how-it-works.html"><i class="fas fa-play-circle me-1"></i>How It Works</a></li>
            <li class="nav-item"><a class="nav-link" href="guide.html"><i class="fas fa-book-open me-1"></i>Disease Guide</a></li>
            <li class="nav-item"><a class="nav-link" href="history.html"><i class="fas fa-history me-1"></i>Previous Checks</a></li>
            <li class="nav-item"><a class="nav-link" href="about.html"><i class="fas fa-info-circle me-1"></i>About</a></li>
        </ul>
        <div class="d-flex align-items-center">
            <a href="detect.html" class="btn btn-agri-primary btn-sm px-3 rounded-pill fw-bold">
                <i class="fas fa-leaf me-1"></i>Scan Leaf Now
            </a>
        </div>
    `;
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

    setTimeout(() => {
        alertBox.classList.add('d-none');
    }, 6000);
}
