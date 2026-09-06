-- Initial Seed Data for AI-Based Plant Disease Detection System

-- Plant Categories
INSERT IGNORE INTO plant_categories (id, plant_name) VALUES
(1, 'Tomato'),
(2, 'Potato'),
(3, 'Apple'),
(4, 'Corn (Maize)'),
(5, 'Rice'),
(6, 'Cotton');

-- Diseases & Healthy States
INSERT IGNORE INTO diseases (id, plant_id, disease_name, symptoms, causes, is_healthy) VALUES
(1, 1, 'Tomato Early Blight', 'Small brown-black spots with concentric rings appearing on older leaves first. Leaves turn yellow and fall off.', 'Caused by the fungus Alternaria solani. Spreads rapidly in warm, humid weather and heavy moisture.', FALSE),
(2, 1, 'Tomato Late Blight', 'Large dark water-soaked spots on leaves and stems. White mold growth on undersides during wet weather.', 'Caused by the fungus-like pathogen Phytophthora infestans during cool wet seasons.', FALSE),
(3, 1, 'Tomato Healthy Leaf', 'Vibrant green leaf with smooth texture, no discoloration, spots, or wilting.', 'Proper crop care, balanced irrigation, and good soil health.', TRUE),
(4, 2, 'Potato Late Blight', 'Dark brown lesions on leaf tips and margins, rapidly spreading across the foliage.', 'Phytophthora infestans favored by cool temperatures and continuous leaf wetness.', FALSE),
(5, 2, 'Potato Early Blight', 'Target-shaped dark brown spots with chlorotic yellow halo surrounding affected areas.', 'Fungal pathogen Alternaria solani growing in high humidity and moisture.', FALSE),
(6, 3, 'Apple Scab', 'Olive-green to dark brown velvety lesions on leaves and young fruit surface.', 'Caused by the fungus Venturia inaequalis during rainy spring periods.', FALSE),
(7, 4, 'Corn Common Rust', 'Small brownish red elongated pustules scattered on upper and lower leaf surfaces.', 'Fungus Puccinia sorghi carried by wind currents under humid conditions.', FALSE),
(8, 5, 'Rice Blast', 'Diamond-shaped spots with gray/white centers and reddish brown borders on leaves.', 'Fungus Magnaporthe oryzae triggered by high nitrogen fertilizer and damp conditions.', FALSE),
(9, 6, 'Cotton Bacterial Blight', 'Angular water-soaked leaf lesions turning dark brown to black along leaf veins.', 'Bacterium Xanthomonas citri pv. malvacearum transmitted through seeds and rain splashes.', FALSE);

-- Treatments & Recommendations
INSERT IGNORE INTO treatments (id, disease_id, pesticide, fungicide, fertilizer, biological_control, dosage, prevention) VALUES
(1, 1, 'Not required for fungal blight', 'Mancozeb 75% WP or Copper Oxychloride 50% WP', 'Potassium-rich fertilizer to boost plant immunity', 'Trichoderma viride bio-fungicide soil application', 'Mix 2.5g Mancozeb per liter of water. Spray every 7-10 days.', '• Remove and destroy infected leaves immediately.\n• Avoid overhead watering and keep foliage dry.\n• Practice 3-year crop rotation.\n• Ensure proper space between plants for airflow.'),

(2, 2, 'Avoid systemic insecticides', 'Chlorothalonil or Metalaxyl + Mancozeb formulation', 'Balanced N-P-K fertilizer with micronutrients', 'Bacillus subtilis spray for leaf protection', 'Mix 2g Metalaxyl-Mancozeb per liter. Apply at first sign of disease.', '• Use disease-free certified seeds.\n• Destroy infected plant debris after harvest.\n• Maintain adequate drainage in field.\n• Spray protective fungicide before monsoon rains.'),

(3, 3, 'None required', 'None required', 'Balanced compost or standard organic fertilizer', 'Beneficial garden microbes', 'Apply standard organic compost as needed', '• Continue current good farming practices.\n• Monitor leaves weekly for early signs.\n• Maintain clean garden tools and water regularly.'),

(4, 4, 'None required', 'Cymoxanil + Mancozeb or Copper Hydroxide', 'Potash application', 'Trichoderma harzianum soil treatment', 'Spray 2g per liter water at 7-day intervals during wet weather', '• Plant certified seed tubers.\n• Hill soil around plants to protect tubers.\n• Destroy volunteer potato plants in surrounding area.'),

(5, 5, 'None required', 'Azoxystrobin 23% SC or Dithane M-45', 'Potassium sulphate spray', 'Pseudomonas fluorescens leaf spray', 'Mix 1.5ml Azoxystrobin per liter of clean water', '• Maintain soil fertility with organic manure.\n• Mulch around base to reduce soil splash.\n• Rotate crops with non-solanaceous plants.'),

(6, 6, 'None required', 'Captan 50% WP or Difenoconazole 25% EC', 'Balanced tree fruit fertilizer', 'Bio-control spray with Bacillus amyloliquefaciens', 'Mix 2g Captan per liter. Spray during pre-bloom stage.', '• Rake and burn fallen leaves in autumn.\n• Prune tree canopy to maximize sunlight penetration.\n• Plant scab-resistant apple cultivars.'),

(7, 7, 'None required', 'Propiconazole 25% EC or Mancozeb', 'Nitrogen and Zinc booster', 'Trichoderma viride foliar spray', 'Mix 1ml Propiconazole per liter of water', '• Plant rust-resistant corn hybrids.\n• Avoid late planting season.\n• Keep field free from weed hosts.'),

(8, 8, 'None required', 'Tricyclazole 75% WP or Isoprothiolane 40% EC', 'Avoid excess nitrogen; apply Silica fertilizer', 'Pseudomonas fluorescens bio-agent', 'Mix 0.6g Tricyclazole per liter of water', '• Avoid excessive nitrogenous fertilizer application.\n• Maintain optimum water level in paddy field.\n• Treat seeds with bio-agent before sowing.'),

(9, 9, 'Streptocycline 90% + Tetracycline 10%', 'Copper Oxychloride combination spray', 'Zinc & Boron foliar spray', 'Neem seed kernel extract (NSKE 5%)', 'Mix 1g Streptocycline + 3g Copper Oxychloride in 10 liters water', '• Use acid-delinted certified seeds.\n• Avoid field operations when foliage is wet.\n• Remove and burn crop stubble after harvest.');

-- Seed Users (Password is 'password123' plain text for mock demo auth)
INSERT IGNORE INTO users (id, name, email, password, role) VALUES
(1, 'System Administrator', 'admin@plantdisease.com', 'admin123', 'ROLE_ADMIN'),
(2, 'Ramesh Kumar (Farmer)', 'farmer@plantdisease.com', 'farmer123', 'ROLE_FARMER');

-- Sample Initial Prediction History
INSERT IGNORE INTO images (id, user_id, image_path, uploaded_at) VALUES
(1, 2, 'uploads/sample_leaf_tomato_early_blight.jpg', NOW());

INSERT IGNORE INTO predictions (id, user_id, image_id, disease_id, confidence, prediction_date) VALUES
(1, 2, 1, 1, 97.4, NOW());
