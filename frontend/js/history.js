// Prediction History Handler (No Login Required)

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch(`${API_BASE_URL}/predictions/history?userId=1`);
        if (response.ok) {
            const predictions = await response.json();
            renderHistory(predictions);
        } else {
            showAlert('Could not load prediction history.');
        }
    } catch (err) {
        console.error(err);
        showAlert('Could not connect to server.');
    }
});

function renderHistory(predictions) {
    const tableBody = document.getElementById('historyTableBody');
    const mobileCards = document.getElementById('mobileHistoryCards');
    const emptyState = document.getElementById('emptyHistoryState');

    if (!predictions || predictions.length === 0) {
        if (emptyState) emptyState.classList.remove('d-none');
        if (document.getElementById('historyTableContainer')) document.getElementById('historyTableContainer').classList.add('d-none');
        if (mobileCards) mobileCards.classList.add('d-none');
        return;
    }

    let tableHtml = '';
    let cardsHtml = '';

    predictions.forEach(p => {
        const dateFormatted = new Date(p.predictionDate).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const badgeClass = p.isHealthy ? 'badge-healthy' : 'badge-diseased';

        tableHtml += `
            <tr>
                <td class="align-middle fw-semibold">${dateFormatted}</td>
                <td class="align-middle fw-bold text-dark">${p.plantName}</td>
                <td class="align-middle fw-bold text-success">${p.diseaseName}</td>
                <td class="align-middle">
                    <span class="badge ${badgeClass}">${p.confidence}% AI Confidence</span>
                </td>
                <td class="align-middle text-end">
                    <a href="result.html?id=${p.predictionId}" class="btn btn-agri-primary btn-sm px-3 rounded-pill">
                        <i class="fas fa-eye me-1"></i>View Result
                    </a>
                </td>
            </tr>
        `;

        cardsHtml += `
            <div class="col-12 d-block d-md-none mb-3">
                <div class="agri-card p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge ${badgeClass}">${p.confidence}% Confidence</span>
                        <small class="text-muted"><i class="far fa-clock me-1"></i>${dateFormatted}</small>
                    </div>
                    <h5 class="fw-bold text-dark mb-1">${p.plantName}</h5>
                    <h6 class="fw-bold text-success mb-3">${p.diseaseName}</h6>
                    <div class="d-grid">
                        <a href="result.html?id=${p.predictionId}" class="btn btn-agri-primary btn-sm rounded-pill">
                            <i class="fas fa-eye me-1"></i>View Result Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    if (tableBody) tableBody.innerHTML = tableHtml;
    if (mobileCards) mobileCards.innerHTML = cardsHtml;
}
