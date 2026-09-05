// Leaf Upload and Prediction Handler

document.addEventListener('DOMContentLoaded', function() {
    const user = Auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const dropZone = document.getElementById('uploadDropzone');
    const fileInput = document.getElementById('leafFileInput');
    const uploadPrompt = document.getElementById('uploadPrompt');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const detectBtn = document.getElementById('detectBtn');
    const loadingContainer = document.getElementById('loadingContainer');

    let selectedFile = null;

    // Trigger File Picker
    dropZone.addEventListener('click', (e) => {
        if (e.target !== removeImageBtn && !removeImageBtn.contains(e.target)) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            handleFileSelected(this.files[0]);
        }
    });

    // Drag and Drop Events
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files[0]) {
            handleFileSelected(files[0]);
        }
    });

    function handleFileSelected(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showAlert('Please upload a valid leaf image in JPG, JPEG, or PNG format.');
            return;
        }

        selectedFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            uploadPrompt.classList.add('d-none');
            imagePreviewContainer.classList.remove('d-none');
            detectBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    // Remove Image
    removeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedFile = null;
        fileInput.value = '';
        previewImage.src = '';
        imagePreviewContainer.classList.add('d-none');
        uploadPrompt.classList.remove('d-none');
        detectBtn.disabled = true;
    });

    // Submit Prediction
    detectBtn.addEventListener('click', async function() {
        if (!selectedFile) {
            showAlert('Please upload a clear photo of a plant leaf.');
            return;
        }

        dropZone.classList.add('d-none');
        detectBtn.classList.add('d-none');
        loadingContainer.classList.remove('d-none');

        const formData = new FormData();
        formData.append('userId', user.id);
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${API_BASE_URL}/predictions`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Store result in session storage and redirect to result view
                sessionStorage.setItem('current_result', JSON.stringify(data));
                window.location.href = `result.html?id=${data.predictionId}`;
            } else {
                showAlert(data.message || 'Something went wrong. Please try again.');
                resetUploadView();
            }
        } catch (err) {
            console.error(err);
            showAlert('Something went wrong during plant check. Please ensure backend is running.');
            resetUploadView();
        }
    });

    function resetUploadView() {
        dropZone.classList.remove('d-none');
        detectBtn.classList.remove('d-none');
        loadingContainer.classList.add('d-none');
    }
});
