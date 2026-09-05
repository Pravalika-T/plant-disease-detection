// Admin Dashboard Handler

document.addEventListener('DOMContentLoaded', async function() {
    const user = Auth.getUser();
    if (!user || user.role !== 'ROLE_ADMIN') {
        alert('Access denied. Admin credentials required.');
        window.location.href = 'login.html';
        return;
    }

    loadAdminStats();
    loadUsersTable();
    loadDiseasesTable();
    loadPredictionsTable();

    // Form Submissions
    const diseaseForm = document.getElementById('diseaseForm');
    if (diseaseForm) {
        diseaseForm.addEventListener('submit', handleDiseaseFormSubmit);
    }
});

// Load Overview Statistics
async function loadAdminStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`);
        if (response.ok) {
            const stats = await response.json();
            document.getElementById('adminTotalUsers').textContent = stats.totalUsers;
            document.getElementById('adminTotalDiseases').textContent = stats.totalDiseases;
            document.getElementById('adminTotalPredictions').textContent = stats.totalPredictions;
            document.getElementById('adminHealthyPredictions').textContent = stats.healthyPredictions;
            document.getElementById('adminDiseasedPredictions').textContent = stats.diseasedPredictions;

            renderReportProgressBars(stats);
        }
    } catch (err) {
        console.error("Failed to load admin stats", err);
    }
}

function renderReportProgressBars(stats) {
    const total = stats.totalPredictions || 1;
    const healthyPct = Math.round((stats.healthyPredictions / total) * 100);
    const diseasedPct = Math.round((stats.diseasedPredictions / total) * 100);

    const healthyBar = document.getElementById('reportHealthyBar');
    const diseasedBar = document.getElementById('reportDiseasedBar');

    if (healthyBar) {
        healthyBar.style.width = `${healthyPct}%`;
        healthyBar.textContent = `${healthyPct}% Healthy (${stats.healthyPredictions})`;
    }
    if (diseasedBar) {
        diseasedBar.style.width = `${diseasedPct}%`;
        diseasedBar.textContent = `${diseasedPct}% Diseased (${stats.diseasedPredictions})`;
    }
}

// User Management
async function loadUsersTable() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        if (response.ok) {
            const users = await response.json();
            const tbody = document.getElementById('adminUsersTableBody');
            if (!tbody) return;

            tbody.innerHTML = users.map(u => `
                <tr>
                    <td class="fw-semibold">#${u.id}</td>
                    <td class="fw-bold text-dark">${u.name}</td>
                    <td>${u.email}</td>
                    <td><span class="badge ${u.role === 'ROLE_ADMIN' ? 'bg-danger' : 'bg-success'}">${u.role}</span></td>
                    <td class="text-end">
                        ${u.role !== 'ROLE_ADMIN' ? `<button class="btn btn-outline-danger btn-sm rounded-pill" onclick="deleteUser(${u.id})"><i class="fas fa-trash-alt me-1"></i>Delete</button>` : '<span class="text-muted small">Protected Admin</span>'}
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error("Failed to load users", err);
    }
}

async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user account?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, { method: 'DELETE' });
        if (response.ok) {
            loadUsersTable();
            loadAdminStats();
        }
    } catch (err) {
        console.error(err);
    }
}

// Disease Management
let currentEditingDiseaseId = null;

async function loadDiseasesTable() {
    try {
        const response = await fetch(`${API_BASE_URL}/diseases`);
        if (response.ok) {
            const diseases = await response.json();
            const tbody = document.getElementById('adminDiseasesTableBody');
            if (!tbody) return;

            tbody.innerHTML = diseases.map(d => `
                <tr>
                    <td class="fw-semibold">#${d.id}</td>
                    <td class="fw-bold">${d.plantName}</td>
                    <td class="fw-bold text-success">${d.diseaseName}</td>
                    <td><span class="badge ${d.isHealthy ? 'badge-healthy' : 'badge-diseased'}">${d.isHealthy ? 'Healthy' : 'Diseased'}</span></td>
                    <td class="text-end">
                        <button class="btn btn-outline-primary btn-sm rounded-pill me-1" onclick="openEditDiseaseModal(${d.id})"><i class="fas fa-edit me-1"></i>Edit</button>
                        <button class="btn btn-outline-danger btn-sm rounded-pill" onclick="deleteDisease(${d.id})"><i class="fas fa-trash-alt me-1"></i>Delete</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

function openAddDiseaseModal() {
    currentEditingDiseaseId = null;
    document.getElementById('diseaseModalTitle').textContent = "Add New Disease Record";
    document.getElementById('diseaseForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('diseaseModal'));
    modal.show();
}

async function openEditDiseaseModal(id) {
    currentEditingDiseaseId = id;
    document.getElementById('diseaseModalTitle').textContent = "Edit Disease Record";
    
    try {
        const response = await fetch(`${API_BASE_URL}/diseases/${id}`);
        if (response.ok) {
            const d = await response.json();
            const t = d.treatment || {};
            
            document.getElementById('modalPlantName').value = d.plantName;
            document.getElementById('modalDiseaseName').value = d.diseaseName;
            document.getElementById('modalSymptoms').value = d.symptoms || '';
            document.getElementById('modalCauses').value = d.causes || '';
            document.getElementById('modalFungicide').value = t.fungicide || t.pesticide || '';
            document.getElementById('modalBiological').value = t.biologicalControl || '';
            document.getElementById('modalDosage').value = t.dosage || '';
            document.getElementById('modalPrevention').value = t.prevention || '';
            document.getElementById('modalIsHealthy').checked = d.isHealthy;

            const modal = new bootstrap.Modal(document.getElementById('diseaseModal'));
            modal.show();
        }
    } catch (err) {
        console.error(err);
    }
}

async function handleDiseaseFormSubmit(e) {
    e.preventDefault();

    const payload = {
        plantName: document.getElementById('modalPlantName').value.trim(),
        diseaseName: document.getElementById('modalDiseaseName').value.trim(),
        symptoms: document.getElementById('modalSymptoms').value.trim(),
        causes: document.getElementById('modalCauses').value.trim(),
        isHealthy: document.getElementById('modalIsHealthy').checked,
        treatment: {
            fungicide: document.getElementById('modalFungicide').value.trim(),
            biologicalControl: document.getElementById('modalBiological').value.trim(),
            dosage: document.getElementById('modalDosage').value.trim(),
            prevention: document.getElementById('modalPrevention').value.trim()
        }
    };

    const url = currentEditingDiseaseId ? `${API_BASE_URL}/admin/diseases/${currentEditingDiseaseId}` : `${API_BASE_URL}/admin/diseases`;
    const method = currentEditingDiseaseId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('diseaseModal')).hide();
            loadDiseasesTable();
            loadAdminStats();
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteDisease(id) {
    if (!confirm("Delete this disease record?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/admin/diseases/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadDiseasesTable();
            loadAdminStats();
        }
    } catch (err) {
        console.error(err);
    }
}

// Prediction Logs
async function loadPredictionsTable() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/predictions`);
        if (response.ok) {
            const predictions = await response.json();
            const tbody = document.getElementById('adminPredictionsTableBody');
            if (!tbody) return;

            tbody.innerHTML = predictions.map(p => `
                <tr>
                    <td class="fw-semibold">#${p.predictionId}</td>
                    <td class="fw-bold">${p.plantName}</td>
                    <td class="fw-bold text-success">${p.diseaseName}</td>
                    <td><span class="badge ${p.isHealthy ? 'badge-healthy' : 'badge-diseased'}">${p.confidence}%</span></td>
                    <td>${new Date(p.predictionDate).toLocaleDateString()}</td>
                    <td class="text-end">
                        <a href="result.html?id=${p.predictionId}" class="btn btn-outline-success btn-sm rounded-pill" target="_blank"><i class="fas fa-external-link-alt me-1"></i>View</a>
                    </td>
                </tr>
            `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}
