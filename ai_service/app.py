import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from model_runner import PlantDiseaseCNNModel

app = Flask(__name__)
CORS(app)

# Initialize AI Predictor Engine
model_path = os.path.join(os.path.dirname(__file__), 'models', 'plant_disease_model.h5')
predictor = PlantDiseaseCNNModel(model_path=model_path)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "UP",
        "service": "AI Plant Disease Classification Microservice",
        "version": "1.0.0"
    })

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No leaf image file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Save to temporary file for prediction processing
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
        file.save(temp_file.name)
        temp_path = temp_file.name

    try:
        result = predictor.predict(temp_path)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"AI Prediction failed: {str(e)}"}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    print("=================================================")
    print(" AI Plant Disease Microservice Running on Port 5000")
    print(" Endpoint: http://localhost:5000/predict         ")
    print("=================================================")
    app.run(host='0.0.0.0', port=5000, debug=True)
