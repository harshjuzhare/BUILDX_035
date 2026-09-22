# THE_ANVESHAK
BUILDX_035
# CivicAI – Smart Civic Problem Reporting & Management

CivicAI is a full-stack MERN application that helps citizens report local civic problems such as potholes, garbage, damaged streetlights, drainage issues, water leakage, and sanitation problems.

The platform connects **Citizens, Officers, Workers, and Administrators** through a single workflow. Citizens can submit complaints with photos and location details, while AI helps classify the issue and determine its priority. Officers can review and assign complaints, workers can update the work status, and administrators can monitor the overall system.

---

## Key Features

### Citizen Portal

* Citizen registration and login
* Report civic issues using:

  * Camera capture
  * Image upload
  * GPS location
  * Editable map location
* AI-based complaint classification
* Complaint priority detection
* Complaint tracking with status timeline
* Notifications for complaint updates
* Verification after work completion
* Option to reopen a complaint with a reason
* Rating and feedback after resolution
* Multi-language interface using `react-i18next`
* Currently available languages include English, Hindi and Marathi

### Officer Portal

* Department-specific dashboard
* View complaints in table and map format
* Search and filter complaints
* Review incoming complaints
* Take ownership of complaints
* Assign complaints to workers
* Review uploaded work evidence
* Track complaint progress
* Generate department-level reports

### Worker Portal

* View assigned tasks
* Check complaint details and location
* View priority and deadline
* Follow work instructions
* Upload completion photos
* Update work progress

### Central Administration

* System-wide complaint dashboard
* View complaints on an interactive map
* Monitor departments and staff
* Create and manage Officer, Worker and Admin accounts
* Department performance monitoring
* Complaint analytics using charts
* Category-wise and priority-wise analysis
* Track complaint trends and department workload

---

## AI-Based Complaint Analysis

When a citizen submits a complaint image, CivicAI analyzes the uploaded image and identifies the possible civic issue.

The system can provide:

* Complaint category
* Confidence level
* Priority
* Short explanation
* Suggested department

The application uses **Google Gemini Vision** for image analysis.

For demonstrations where an API key is not available, CivicAI also includes a basic keyword-based fallback so that the complaint workflow can still be tested.

---

## Complaint Management Workflow

CivicAI follows a controlled complaint workflow:

```text
Submitted
    ↓
Under Review
    ↓
Assigned to Officer
    ↓
Worker Assigned
    ↓
Work in Progress
    ↓
Work Completed
    ↓
Verification Pending
    ↓
Resolved / Reopened
    ↓
Closed
```

Each status change is recorded with the responsible user, role, timestamp and comment.

The backend validates status transitions so users cannot directly skip important stages of the complaint process.

---

## Technology Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* Tailwind CSS
* Leaflet + OpenStreetMap
* Chart.js
* React-i18next
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* Multer
* Helmet
* CORS
* Morgan

### AI & Services

* Google Gemini Vision
* Cloudinary
* OpenStreetMap
* Leaflet

---

## Project Structure

```text
civicai/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── scripts/
│       └── seed.js
│
└── client/
    └── src/
        ├── pages/
        ├── components/
        ├── context/
        ├── api/
        └── i18n/
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd civicai
```

### 2. Start the Backend

```bash
cd server
npm install
```

Create a `.env` file and add the required configuration:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

### 3. Start the Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## Demo Accounts

For local testing, demo accounts can be created using the project seed script.

| Role          | Example Account                                                     |
| ------------- | ------------------------------------------------------------------- |
| Admin         | [admin@civicai.gov.in](mailto:admin@civicai.gov.in)                 |
| Road Officer  | [officer.road@civicai.gov.in](mailto:officer.road@civicai.gov.in)   |
| Waste Officer | [officer.waste@civicai.gov.in](mailto:officer.waste@civicai.gov.in) |
| Road Worker   | [worker.road@civicai.gov.in](mailto:worker.road@civicai.gov.in)     |
| Waste Worker  | [worker.waste@civicai.gov.in](mailto:worker.waste@civicai.gov.in)   |
| Citizen       | [citizen1@example.com](mailto:citizen1@example.com)                 |

> Demo credentials are intended only for local testing.

---

## External Services

CivicAI uses the following services:

**MongoDB Atlas**
Used for storing users, complaints, departments, status history and other application data.

**Google Gemini**
Used for AI-based image analysis and complaint classification.

**Cloudinary**
Used for storing complaint and work-completion images.

**Leaflet + OpenStreetMap**
Used for displaying complaint locations and selecting locations on the map.

---

## Complaint Tracking

Every complaint maintains its own history.

The system records:

* Complaint status
* Assigned officer
* Assigned worker
* Status change time
* Comments
* Work completion evidence
* Citizen verification
* Reopening reason
* Final feedback and rating

This provides a clear record of the complaint from reporting to closure.

---

## Future Improvements

Some features that can be added in future versions include:

* Automatic overdue complaint alerts
* Advanced duplicate complaint detection
* PDF and CSV report export
* More Indian language translations
* Automated escalation for delayed complaints
* Improved analytics and department performance reports
* Additional security and automated testing

---

## Project Objective

The main objective of CivicAI is to make civic complaint management **simpler, faster and more transparent** by connecting citizens with the concerned department through a single digital platform.

Instead of following different processes for different civic issues, citizens can report a problem, track its progress and verify the resolution from one place.

---

## Team Project

**CivicAI** was developed as a hackathon project to explore how AI, location services and web technologies can be used to improve civic service management.

**Built with:** MERN Stack + Gemini AI + Leaflet
