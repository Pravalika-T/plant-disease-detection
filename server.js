// Zero-Dependency Node.js REST API Server for Plant Disease Detection
// Serves all Spring Boot REST API endpoints on http://localhost:8080

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// In-Memory Database initialized with seed dataset
let users = [
    { id: 1, name: 'System Administrator', email: 'admin@plantdisease.com', password: 'admin123', role: 'ROLE_ADMIN', created_at: new Date() },
    { id: 2, name: 'Ramesh Kumar (Farmer)', email: 'farmer@plantdisease.com', password: 'farmer123', role: 'ROLE_FARMER', created_at: new Date() }
];

let diseases = [
    {
        id: 1,
        plantName: 'Tomato',
        diseaseName: 'Tomato Early Blight',
        symptoms: '• Small brown-black spots with concentric rings appearing on older leaves first.\n• Leaves turn yellow and fall off prematurely.',
        causes: 'Caused by the fungus Alternaria solani. Spreads rapidly in warm, humid weather and heavy moisture.',
        isHealthy: false,
        treatment: {
            id: 1,
            pesticide: 'Not required for fungal blight',
            fungicide: 'Mancozeb 75% WP or Copper Oxychloride 50% WP',
            fertilizer: 'Potassium-rich fertilizer to boost plant immunity',
            biologicalControl: 'Trichoderma viride bio-fungicide soil application',
            dosage: 'Mix 2.5g Mancozeb per liter of water. Spray every 7-10 days.',
            prevention: '• Remove and destroy infected leaves immediately.\n• Avoid overhead watering and keep foliage dry.\n• Practice 3-year crop rotation.\n• Ensure proper space between plants for airflow.'
        }
    },
    {
        id: 2,
        plantName: 'Tomato',
        diseaseName: 'Tomato Late Blight',
        symptoms: '• Large dark water-soaked spots on leaves and stems.\n• White mold growth on undersides during wet weather.',
        causes: 'Caused by Phytophthora infestans during cool wet seasons.',
        isHealthy: false,
        treatment: {
            id: 2,
            fungicide: 'Metalaxyl + Mancozeb formulation',
            biologicalControl: 'Bacillus subtilis spray for leaf protection',
            dosage: 'Mix 2g per liter water. Apply at first sign of disease.',
            prevention: '• Use disease-free certified seeds.\n• Destroy infected plant debris after harvest.\n• Maintain adequate field drainage.'
        }
    },
    {
        id: 3,
        plantName: 'Tomato',
        diseaseName: 'Tomato Healthy Leaf',
        symptoms: '• Vibrant green leaf with smooth texture, no discoloration, spots, or wilting.',
        causes: 'Proper crop care, balanced irrigation, and good soil health.',
        isHealthy: true,
        treatment: {
            id: 3,
            fertilizer: 'Balanced organic compost',
            biologicalControl: 'Beneficial garden microbes',
            dosage: 'Apply standard organic compost as needed',
            prevention: '• Continue current good farming practices.\n• Monitor leaves weekly for early signs.'
        }
    },
    {
        id: 4,
        plantName: 'Potato',
        diseaseName: 'Potato Late Blight',
        symptoms: '• Dark brown lesions on leaf tips and margins, rapidly spreading across foliage.',
        causes: 'Phytophthora infestans favored by cool temperatures and high humidity.',
        isHealthy: false,
        treatment: {
            id: 4,
            fungicide: 'Cymoxanil + Mancozeb or Copper Hydroxide',
            biologicalControl: 'Trichoderma harzianum soil treatment',
            dosage: 'Spray 2g per liter water at 7-day intervals during wet weather',
            prevention: '• Plant certified seed tubers.\n• Hill soil around plants to protect tubers.'
        }
    },
    {
        id: 5,
        plantName: 'Apple',
        diseaseName: 'Apple Scab',
        symptoms: '• Olive-green to dark brown velvety lesions on leaves and young fruit surface.',
        causes: 'Venturia inaequalis during rainy spring periods.',
        isHealthy: false,
        treatment: {
            id: 5,
            fungicide: 'Captan 50% WP or Difenoconazole 25% EC',
            biologicalControl: 'Bacillus amyloliquefaciens spray',
            dosage: 'Mix 2g Captan per liter water. Spray during pre-bloom stage.',
            prevention: '• Rake and burn fallen autumn leaves.\n• Prune tree canopy to maximize sunlight penetration.'
        }
    },
    {
        id: 6,
        plantName: 'Corn (Maize)',
        diseaseName: 'Corn Common Rust',
        symptoms: '• Small brownish red elongated pustules scattered on leaf surfaces.',
        causes: 'Puccinia sorghi fungus carried by wind currents under humid conditions.',
        isHealthy: false,
        treatment: {
            id: 6,
            fungicide: 'Propiconazole 25% EC or Mancozeb',
            biologicalControl: 'Trichoderma viride foliar spray',
            dosage: 'Mix 1ml Propiconazole per liter of water',
            prevention: '• Plant rust-resistant corn hybrids.\n• Avoid late planting season.'
        }
    }
];

let predictions = [
    {
        predictionId: 1,
        plantName: 'Tomato',
        diseaseName: 'Tomato Early Blight',
        confidence: 97.4,
        isHealthy: false,
        symptoms: diseases[0].symptoms,
        causes: diseases[0].causes,
        treatment: diseases[0].treatment,
        imagePath: 'uploads/sample_leaf.jpg',
        predictionDate: new Date(),
        userId: 2
    }
];

// Helper Functions
function sendJSON(res, data, statusCode = 200) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
}

function parseJSONBody(req, callback) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            callback(JSON.parse(body || '{}'));
        } catch (e) {
            callback({});
        }
    });
}

const server = http.createServer((req, res) => {
    // Enable CORS Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        return res.end();
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // Serve Static Uploaded Images
    if (pathname.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, pathname);
        if (fs.existsSync(filePath)) {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            return fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(404);
            return res.end('Image Not Found');
        }
    }

    // 1. Auth REST APIs
    if (pathname === '/api/auth/register' && req.method === 'POST') {
        parseJSONBody(req, body => {
            if (!body.email || !body.name || !body.password) {
                return sendJSON(res, { message: 'All fields are required' }, 400);
            }
            if (users.find(u => u.email.toLowerCase() === body.email.toLowerCase())) {
                return sendJSON(res, { message: 'Email address already exists' }, 400);
            }

            const newUser = {
                id: users.length + 1,
                name: body.name,
                email: body.email.toLowerCase().trim(),
                password: body.password,
                role: 'ROLE_FARMER',
                created_at: new Date()
            };
            users.push(newUser);

            sendJSON(res, {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                message: 'Registration successful!'
            });
        });
    }

    else if (pathname === '/api/auth/login' && req.method === 'POST') {
        parseJSONBody(req, body => {
            const user = users.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase());
            if (!user || user.password !== body.password) {
                return sendJSON(res, { message: 'Invalid email address or password' }, 401);
            }
            sendJSON(res, {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: 'Login successful!'
            });
        });
    }

    // 2. Disease Catalog REST APIs
    else if (pathname === '/api/diseases' && req.method === 'GET') {
        sendJSON(res, diseases);
    }
    else if (pathname.startsWith('/api/diseases/') && req.method === 'GET') {
        const id = parseInt(pathname.split('/')[3]);
        const disease = diseases.find(d => d.id === id);
        if (disease) {
            sendJSON(res, disease);
        } else {
            sendJSON(res, { message: 'Disease record not found' }, 404);
        }
    }

    // 3. Predictions REST APIs
    else if (pathname === '/api/predictions' && req.method === 'POST') {
        // Multi-part file upload mock processor
        const userId = parseInt(parsedUrl.searchParams.get('userId') || '2');
        const randomConf = (92.0 + Math.random() * 6.5).toFixed(1);
        const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];

        const newPrediction = {
            predictionId: predictions.length + 1,
            plantName: selectedDisease.plantName,
            diseaseName: selectedDisease.diseaseName,
            confidence: parseFloat(randomConf),
            isHealthy: selectedDisease.isHealthy,
            symptoms: selectedDisease.symptoms,
            causes: selectedDisease.causes,
            treatment: selectedDisease.treatment,
            imagePath: 'uploads/uploaded_leaf.jpg',
            predictionDate: new Date(),
            userId: userId
        };

        predictions.unshift(newPrediction);
        sendJSON(res, newPrediction, 200);
    }
    else if (pathname === '/api/predictions/history' && req.method === 'GET') {
        const userId = parseInt(parsedUrl.searchParams.get('userId') || '2');
        const userPredictions = predictions.filter(p => p.userId === userId || userId === 1);
        sendJSON(res, userPredictions);
    }
    else if (pathname.startsWith('/api/predictions/') && req.method === 'GET') {
        const id = parseInt(pathname.split('/')[3]);
        const pred = predictions.find(p => p.predictionId === id);
        if (pred) {
            sendJSON(res, pred);
        } else {
            sendJSON(res, { message: 'Prediction not found' }, 404);
        }
    }

    // 4. Admin REST APIs
    else if (pathname === '/api/admin/stats' && req.method === 'GET') {
        const healthyCount = predictions.filter(p => p.isHealthy).length;
        const diseasedCount = predictions.length - healthyCount;

        sendJSON(res, {
            totalUsers: users.length,
            totalDiseases: diseases.length,
            totalPredictions: predictions.length,
            healthyPredictions: healthyCount,
            diseasedPredictions: diseasedCount
        });
    }
    else if (pathname === '/api/admin/users' && req.method === 'GET') {
        sendJSON(res, users.map(u => ({ ...u, password: '***' })));
    }
    else if (pathname.startsWith('/api/admin/users/') && req.method === 'DELETE') {
        const id = parseInt(pathname.split('/')[4]);
        users = users.filter(u => u.id !== id);
        sendJSON(res, { message: 'User deleted successfully' });
    }
    else if (pathname === '/api/admin/predictions' && req.method === 'GET') {
        sendJSON(res, predictions);
    }
    else if (pathname === '/api/admin/diseases' && req.method === 'POST') {
        parseJSONBody(req, body => {
            const newId = diseases.length + 1;
            const newRecord = {
                id: newId,
                plantName: body.plantName || 'General Crop',
                diseaseName: body.diseaseName || 'New Condition',
                symptoms: body.symptoms || '',
                causes: body.causes || '',
                isHealthy: !!body.isHealthy,
                treatment: {
                    id: newId,
                    fungicide: body.treatment?.fungicide || '',
                    biologicalControl: body.treatment?.biologicalControl || '',
                    dosage: body.treatment?.dosage || '',
                    prevention: body.treatment?.prevention || ''
                }
            };
            diseases.push(newRecord);
            sendJSON(res, newRecord, 200);
        });
    }
    else if (pathname.startsWith('/api/admin/diseases/') && req.method === 'DELETE') {
        const id = parseInt(pathname.split('/')[4]);
        diseases = diseases.filter(d => d.id !== id);
        sendJSON(res, { message: 'Disease record deleted successfully' });
    }
    else {
        sendJSON(res, { message: 'API Endpoint Not Found' }, 404);
    }
});

server.listen(PORT, () => {
    console.log("=================================================");
    console.log(` Plant Disease Detection Backend REST Service Running`);
    console.log(` Server URL: http://localhost:${PORT}/api        `);
    console.log("=================================================");
});
