// Disease Guide Library Search & Filter Handler

let allDiseases = [];

document.addEventListener('DOMContentLoaded', async function() {
    fetchDiseases();

    const searchInput = document.getElementById('searchInput');
    const plantFilter = document.getElementById('plantFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterDiseases);
    }
    if (plantFilter) {
        plantFilter.addEventListener('change', filterDiseases);
    }
});

async function fetchDiseases() {
    const container = document.getElementById('guideContainer');
    try {
        const response = await fetch(`${API_BASE_URL}/diseases`);
        if (response.ok) {
            allDiseases = await response.json();
            populatePlantFilter(allDiseases);
            renderDiseaseCards(allDiseases);
        } else {
            container.innerHTML = `<div class="col-12 text-center text-muted">Failed to load disease library.</div>`;
        }
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="col-12 text-center text-muted">Could not connect to server.</div>`;
    }
}

function populatePlantFilter(diseases) {
    const plantFilter = document.getElementById('plantFilter');
    if (!plantFilter) return;

    const plants = [...new Set(diseases.map(d => d.plantName))];
    let options = `<option value="ALL">All Crops / Plants</option>`;
    plants.forEach(p => {
        options += `<option value="${p}">${p}</option>`;
    });
    plantFilter.innerHTML = options;
}

function filterDiseases() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const selectedPlant = document.getElementById('plantFilter').value;

    const filtered = allDiseases.filter(d => {
        const matchesQuery = d.diseaseName.toLowerCase().includes(query) ||
                             d.plantName.toLowerCase().includes(query) ||
                             (d.symptoms && d.symptoms.toLowerCase().includes(query));

        const matchesPlant = (selectedPlant === 'ALL') || (d.plantName === selectedPlant);

        return matchesQuery && matchesPlant;
    });

    renderDiseaseCards(filtered);
}

function renderDiseaseCards(diseases) {
    const container = document.getElementById('guideContainer');
    if (!container) return;

    if (diseases.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search text-muted display-4 mb-3"></i>
                <h4 class="fw-bold text-dark">No Diseases Found</h4>
                <p class="text-muted">Try searching with a different keyword or crop name.</p>
            </div>
        `;
        return;
    }

    let html = '';
    diseases.forEach(d => {
        const t = d.treatment || {};
        const isHealthy = d.isHealthy;

        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="agri-card p-4 h-100 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge ${isHealthy ? 'badge-healthy' : 'badge-diseased'}">${d.plantName}</span>
                        ${isHealthy ? '<span class="text-success fw-bold small"><i class="fas fa-check-circle me-1"></i>Healthy State</span>' : '<span class="text-danger fw-bold small"><i class="fas fa-bug me-1"></i>Infectious Disease</span>'}
                    </div>

                    <h4 class="fw-bold text-dark mb-2">${d.diseaseName}</h4>

                    <div class="mb-3">
                        <small class="text-muted fw-bold text-uppercase d-block mb-1">Symptoms:</small>
                        <p class="text-dark small mb-0 line-clamp-3">${d.symptoms ? d.symptoms.replace(/•/g, '').substring(0, 140) + '...' : 'Healthy plant leaf structure.'}</p>
                    </div>

                    <div class="mb-3">
                        <small class="text-muted fw-bold text-uppercase d-block mb-1">Recommended Remedy:</small>
                        <span class="badge bg-success bg-opacity-10 text-success fw-semibold p-2 w-100 text-truncate d-block text-start">
                            <i class="fas fa-prescription-bottle-medical me-1"></i>${t.fungicide || t.pesticide || t.biologicalControl || 'Standard crop care'}
                        </span>
                    </div>

                    <div class="mt-auto pt-2">
                        <button class="btn btn-outline-success btn-sm w-100 rounded-pill fw-bold" onclick="openGuideModal(${d.id})">
                            <i class="fas fa-info-circle me-1"></i>View Full Guide & Remedies
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function openGuideModal(diseaseId) {
    const disease = allDiseases.find(d => d.id === diseaseId);
    if (!disease) return;

    const t = disease.treatment || {};

    document.getElementById('modalDiseaseTitle').textContent = `${disease.plantName}: ${disease.diseaseName}`;
    document.getElementById('modalSymptoms').textContent = disease.symptoms || 'None';
    document.getElementById('modalCauses').textContent = disease.causes || 'Standard growth conditions.';
    document.getElementById('modalFungicide').textContent = t.fungicide || t.pesticide || 'None required';
    document.getElementById('modalBio').textContent = t.biologicalControl || 'Organic compost';
    document.getElementById('modalDosage').textContent = t.dosage || 'Follow label instructions.';
    document.getElementById('modalPrevention').textContent = t.prevention || 'Maintain clean tools and adequate spacing.';

    const modal = new bootstrap.Modal(document.getElementById('diseaseDetailModal'));
    modal.show();
}
