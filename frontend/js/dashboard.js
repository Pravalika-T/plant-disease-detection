// Farmer Dashboard Logic

document.addEventListener('DOMContentLoaded', async function() {
    const user = Auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userNameEl = document.getElementById('dashboardUserName');
    if (userNameEl) {
        userNameEl.textContent = user.name;
    }

    // Fetch user prediction history metrics
    try {
        const response = await fetch(`${API_BASE_URL}/predictions/history?userId=${user.id}`);
        if (response.ok) {
            const predictions = await response.json();
            renderDashboardMetrics(predictions);
        }
    } catch (err) {
        console.error("Could not fetch user history for dashboard", err);
    }
});

function renderDashboardMetrics(predictions) {
    const totalChecks = predictions.length;
    const healthyCount = predictions.filter(p => p.isHealthy).length;
    const diseasedCount = totalChecks - healthyCount;

    document.getElementById('statTotalChecks').textContent = totalChecks;
    document.getElementById('statHealthy').textContent = healthyCount;
    document.getElementById('statDiseased').textContent = diseasedCount;

    const recentContainer = document.getElementById('recentCheckContainer');
    if (!recentContainer) return;

    if (predictions.length > 0) {
        const recent = predictions[0];
        const formattedDate = new Date(recent.predictionDate).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        recentContainer.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <div class="flex-shrink-0">
                    <span class="badge ${recent.isHealthy ? 'badge-healthy' : 'badge-diseased'} fs-6">
                        ${recent.isHealthy ? '<i class="fas fa-check-circle me-1"></i>Healthy' : '<i class="fas fa-exclamation-triangle me-1"></i>Diseased'}
                    </span>
                </div>
                <div class="flex-grow-1">
                    <h5 class="fw-bold text-dark mb-1">${recent.plantName}: ${recent.diseaseName}</h5>
                    <p class="text-muted small mb-0"><i class="far fa-clock me-1"></i>Checked on ${formattedDate} | AI Confidence: <strong>${recent.confidence}%</strong></p>
                </div>
                <div>
                    <a href="result.html?id=${recent.predictionId}" class="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold">View Result</a>
                </div>
            </div>
        `;
    } else {
        recentContainer.innerHTML = `
            <p class="text-muted mb-0"><i class="fas fa-info-circle me-2 text-primary"></i>You haven't checked any plants yet. Click <strong>"Check a Plant"</strong> to start!</p>
        `;
    }
}
