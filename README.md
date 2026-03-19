🏥 MediPortal – AI-Assisted Healthcare Management System
📌 Overview
MediPortal is a secure, user-centred healthcare web application designed to improve patient care, accessibility, and communication between patients and healthcare providers.
The system enables patients to submit triage requests, access medical information, and interact with healthcare services, while staff can manage patient data and prioritise care efficiently.
This project is developed as part of a final-year Computer Science dissertation, focusing on secure system design, usability, and healthcare digital transformation.

🚀 Key Features
👤 Patient Features
Secure registration and login (JWT-based authentication)
Submit triage requests with symptoms and urgency levels
View triage status (Pending, In Progress, Completed)
Access personal medical profile
AI-powered symptom checker (interactive chat-based interface)

🩺 Admin/Staff Features
Role-based access control (RBAC)
View and manage all triage requests
Update triage statuses and prioritise patients
Access patient profiles and medical history

🤖 AI Integration

Symptom checker integrated via external API (e.g. Infermedica / EndlessMedical)
Conversational UI for guided diagnosis support

🏗️ System Architecture
The application follows a full-stack architecture:
Frontend: Angular (NG-Zorro UI)
Backend: Java Spring Boot (REST API)
Database: MySQL
Authentication: JWT (HttpOnly cookies)
Security: Spring Security + RBAC

Frontend (Angular)
        ↓
REST API (Spring Boot)
        ↓
Service Layer
        ↓
Repository Layer (JPA)
        ↓
MySQL Database
🛠️ Tech Stack
Layer	Technology
Frontend	Angular, TypeScript, NG-Zorro
Backend	Java, Spring Boot
Database	MySQL
Security	Spring Security, JWT
Tools	IntelliJ IDEA, VS Code, Postman
Version Control	Git & GitHub
🔐 Security Features

JWT Authentication with HttpOnly cookies
Role-Based Access Control (ADMIN / PATIENT)
Password encryption (BCrypt)
Secure REST endpoints
Input validation and error handling

📂 Project Structure
Backend (Spring Boot)
src/main/java/com/consdev/mediportal
│
├── controller        # REST Controllers
├── service           # Business logic
├── repository        # Database access (JPA)
├── model             # Entities (Patient, Staff, TriageRequest)
├── dto               # Data Transfer Objects
├── security          # JWT & Security config
Frontend (Angular)
src/app
│
├── components        # UI components
├── pages             # Main views (login, triage, admin)
├── services          # API communication
├── models            # Interfaces
├── guards            # Route protection
⚙️ Installation & Setup
🔧 Prerequisites
Java 17+
Node.js (v18+ recommended)
Angular CLI
MySQL
Maven

📥 Clone the Repository
git clone https://github.com/your-username/mediportal.git
cd mediportal
▶️ Backend Setup
cd backend
mvn clean install
mvn spring-boot:run
💻 Frontend Setup
cd frontend
npm install
ng serve
🗄️ Database Setup

Create a MySQL database:

CREATE DATABASE mediportal;

Update application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/mediportal
spring.datasource.username=your_username
spring.datasource.password=your_password
📡 API Endpoints (Examples)
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/patient/profile	Get patient profile
POST	/api/patient/triage	Submit triage request
GET	/api/admin/triage-requests	View all triage requests
🧪 Testing

Backend tested using Postman
Unit testing (Spring Boot – optional extension)
Manual UI testing for user workflows

📈 Future Improvements
Real-time notifications (WebSockets)
Appointment booking system
Electronic prescription management
Enhanced AI diagnosis accuracy
Mobile app version (React Native / Flutter)

🎯 Project Goals
Improve healthcare accessibility
Reduce GP workload through triage automation
Enhance patient engagement via digital tools
Ensure secure handling of sensitive medical data

👩🏽‍💻 Author
Constance Izekor
BSc Computer Science – Cardiff Metropolitan University

Full Stack Developer
Project Manager – MediPortal

📄 License
This project is for academic purposes.

⭐ Acknowledgements

Cardiff Metropolitan University
Spring Boot & Angular communities
Healthcare digital transformation research
