# AI-Based Plant Disease Detection System

A complete, modern, and responsive web application designed for a college final project to help farmers detect plant leaf diseases early using Convolutional Neural Networks (CNN) AI image classification.

---

## 🌟 Key Features

1. **Farmer-Centric UX/UI**: Clean, simple agricultural design using non-technical wording ("Check Your Plant", "AI Confidence", "Recommended Treatment").
2. **AI Leaf Disease Prediction**: Upload or drag-and-drop a leaf photo (JPG/PNG) to receive immediate diagnosis, confidence percentage, symptoms, cause, treatment, and prevention advice.
3. **Searchable Disease Guide**: Interactive library allowing farmers to look up crop diseases, fungicides, biological remedies, and dosage instructions.
4. **Prediction History**: View past leaf scans with color-coded health badges and detail modal popups (responsive desktop table & mobile card layout).
5. **Admin Control Panel**: Comprehensive dashboard for managing user accounts, editing disease records & treatment guidelines, monitoring prediction logs, and viewing analytics reports.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, FontAwesome Icons.
* **Backend**: Java 17+, Spring Boot 3.x, Spring Data JPA, Hibernate, REST APIs.
* **Database**: MySQL (`plant_disease_db`) with optional automatic H2 in-memory profile.
* **AI Module**: Python 3.9+, Flask, OpenCV, TensorFlow/Keras CNN classifier (with fallback feature analyzer engine).

---

## 📁 Project Structure

```
plant disease/
├── frontend/                     # Web Application Frontend
│   ├── css/
│   │   └── style.css            # Custom agricultural green theme
│   ├── js/
│   │   ├── app.js               # Global API setup & authentication state
│   │   ├── auth.js              # Login & Registration handlers
│   │   ├── dashboard.js         # Farmer dashboard metrics & recent checks
│   │   ├── predict.js           # Drag & drop upload & prediction requester
│   │   ├── guide.js             # Searchable disease library
│   │   ├── history.js           # User prediction history renderer
│   │   └── admin.js             # Admin management & CRUD operations
│   ├── index.html               # Landing page
│   ├── how-it-works.html        # 3-Step user guide
│   ├── about.html              # Project background
│   ├── login.html              # Auth login page
│   ├── register.html           # Auth registration page
│   ├── dashboard.html          # Farmer dashboard
│   ├── detect.html             # Leaf scan page
│   ├── result.html             # Detailed prediction result view
│   ├── history.html            # Prediction logs page
│   ├── guide.html              # Disease guide library
│   └── admin.html              # Admin Control Panel
│
├── backend/                      # Spring Boot Java REST Application
│   ├── pom.xml                  # Maven configuration
│   └── src/main/
│       ├── java/com/plantdisease/
│       │   ├── PlantDiseaseApplication.java
│       │   ├── config/          # Web MVC, CORS, and Upload resource mapping
│       │   ├── controller/      # REST API Controllers (Auth, Disease, Prediction, Admin)
│       │   ├── dto/             # Request & Response Data Transfer Objects
│       │   ├── entity/          # JPA Entities (User, PlantCategory, Disease, Treatment, ImageRecord, Prediction)
│       │   ├── repository/      # Spring Data JPA Repositories
│       │   └── service/         # Business logic services & AI HTTP Client
│       └── resources/
│           ├── application.properties # Server & DB properties
│           ├── schema.sql       # MySQL table creation DDL
│           └── data.sql         # Seed dataset (Tomato, Potato, Apple, Corn, Rice, Cotton)
│
├── ai_service/                   # Python AI Microservice
│   ├── app.py                   # Flask server with REST API endpoint (/predict)
│   ├── model_runner.py          # TensorFlow / OpenCV feature engine
│   ├── requirements.txt         # Python dependencies
│   └── models/                  # Storage folder for plant_disease_model.h5
│
└── README.md                     # Documentation
```

---

## 🚀 How to Run the Application

### 1. Database Setup (MySQL)
1. Ensure MySQL Server is running on `localhost:3006`.
2. Open your MySQL client (e.g. MySQL Workbench / phpMyAdmin) and create the database:
   ```sql
   CREATE DATABASE plant_disease_db;
   ```
3. Update database credentials in `backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

*(Note: Spring Boot will automatically execute `schema.sql` and `data.sql` to populate default crop diseases, treatment recommendations, and seed user accounts).*

---

### 2. Run Spring Boot Backend
From the `backend/` directory, execute:
```bash
# Windows Maven Wrapper
mvnw spring-boot:run

# Or standard Maven
mvn clean package
java -jar target/plant-disease-backend-1.0.0.jar
```
The REST API backend will start at `http://localhost:8080`.

---

### 3. Run Python AI Service (Optional / Microservice)
From the `ai_service/` directory:
```bash
# Create virtual environment (optional)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```
The AI microservice will start listening at `http://localhost:5000/predict`.

*(Note: If the Python service is not running during demonstration, Spring Boot's internal `AIServiceClient` automatically uses a smart feature-scoring predictor so all upload features work seamlessly).*

---

### 4. Run Frontend Web Application
You can serve the `frontend/` directory using any HTTP static file server or simple browser opener:
* **Option A**: Double click `frontend/index.html` to open directly in Google Chrome / Edge.
* **Option B**: Run Python simple server inside `frontend/`:
  ```bash
  cd frontend
  python -m http.server 3000
  ```
  Then open `http://localhost:3000` in your web browser.

---

## 🔑 Demo Login Accounts

* **Farmer User**:
  - Email: `farmer@plantdisease.com`
  - Password: `farmer123`
* **Admin User**:
  - Email: `admin@plantdisease.com`
  - Password: `admin123`

---

## 📡 REST API Endpoint Documentation

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Authenticate user credentials.

### Disease Catalog (`/api/diseases`)
* `GET /api/diseases` - Retrieve all crop diseases & treatment remedies.
* `GET /api/diseases/{id}` - Fetch single disease by ID.
* `GET /api/diseases/search?query={term}` - Search diseases by crop or name.

### Predictions (`/api/predictions`)
* `POST /api/predictions` - Upload leaf photo (`file` multipart) and receive AI prediction.
* `GET /api/predictions/history?userId={id}` - Retrieve user's previous check records.
* `GET /api/predictions/{id}` - Fetch prediction details by ID.

### Admin Operations (`/api/admin`)
* `GET /api/admin/stats` - Get system counter metrics & healthy vs diseased ratios.
* `GET /api/admin/users` - List all registered user accounts.
* `DELETE /api/admin/users/{id}` - Delete user account.
* `GET /api/admin/predictions` - View complete system prediction log.
* `POST /api/admin/diseases` - Create new disease record & treatment.
* `PUT /api/admin/diseases/{id}` - Update disease record & treatment.
* `DELETE /api/admin/diseases/{id}` - Delete disease record.
