# 🎓 AI-Powered Student Result Management System

An **AI-powered Student Result Management System (SRMS)** built using **React.js, Spring Boot, MySQL, Spring Security, JWT, and Google Gemini AI**.

The system provides separate dashboards for **Admin, Teacher, and Student** users. It simplifies student management, marks entry, result generation, and provides **AI-powered academic performance analysis** to help students understand their strengths and areas for improvement.

---

## 🚀 Features

### 👨‍💼 Admin Module

* Secure admin login
* Admin dashboard
* Manage students
* Manage teachers
* Manage subjects
* Manage courses
* Manage users
* Assign subjects to teachers
* Manage academic information
* View overall system data
* Role-based access control

### 👨‍🏫 Teacher Module

* Secure teacher login
* Teacher dashboard
* View assigned subjects
* View assigned students
* Enter internal marks
* Enter external marks
* Update student marks
* Generate student results
* View student performance
* Manage academic results

### 👨‍🎓 Student Module

* Secure student login
* Student dashboard
* View profile information
* View enrolled course
* View subjects
* View subject-wise marks
* View internal and external marks
* View grades
* View SGPA / academic performance
* View generated results
* View AI-powered performance analysis
* Get personalized academic recommendations

### 🤖 AI-Powered Performance Analysis

The system integrates **Google Gemini AI** to analyze student academic performance.

The AI analyzes student result data and provides:

* Performance summary
* Strong subjects
* Weak subjects
* Areas for improvement
* Personalized recommendations
* Academic improvement suggestions

---

# 🛠️ Technology Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap
* Axios
* React Router
* React Icons

## Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* REST APIs
* JWT Authentication
* Maven

## Database

* MySQL

## AI Integration

* Google Gemini AI

## Development Tools

* Visual Studio Code
* IntelliJ IDEA / Eclipse
* MySQL Workbench
* Postman
* Git
* GitHub

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      React.js       │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │     Spring Boot     │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │   Spring    │  │   Spring    │  │  Gemini AI  │
       │   Security  │  │ Data JPA    │  │             │
       │    + JWT    │  │ + Hibernate │  │ Performance │
       └─────────────┘  └──────┬──────┘  │  Analysis   │
                               │           └─────────────┘
                               ▼
                        ┌─────────────┐
                        │    MySQL    │
                        │   Database  │
                        └─────────────┘
```

---

# 📂 Project Structure

## Frontend

```text
student-result-management-system/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Admin/
│   │   ├── Teacher/
│   │   ├── Student/
│   │   ├── Navbar/
│   │   └── Sidebar/
│   │
│   ├── pages/
│   │   ├── Login/
│   │   ├── Admin/
│   │   ├── Teacher/
│   │   └── Student/
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── context/
│   │
│   ├── routes/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

## Backend

```text
backend/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── srms/
│       │           │
│       │           ├── controller/
│       │           ├── service/
│       │           ├── repository/
│       │           ├── entity/
│       │           ├── dto/
│       │           ├── security/
│       │           ├── config/
│       │           ├── exception/
│       │           └── util/
│       │
│       └── resources/
│           └── application.properties
│
└── pom.xml
```

---

# 🔐 Authentication & Authorization

The system uses **Spring Security and JWT** for secure authentication and role-based authorization.

## Authentication Flow

```text
User Login
    ↓
Spring Security
    ↓
Validate Credentials
    ↓
Generate JWT Token
    ↓
Send Token to Frontend
    ↓
Frontend Stores Token
    ↓
Token Sent With API Requests
    ↓
Backend Validates JWT
    ↓
Allow / Deny Request
```

## Role-Based Access

```text
ADMIN
  │
  ├── Manage Students
  ├── Manage Teachers
  ├── Manage Subjects
  ├── Manage Courses
  └── Manage Users


TEACHER
  │
  ├── View Assigned Subjects
  ├── View Students
  ├── Manage Marks
  └── Generate Results


STUDENT
  │
  ├── View Profile
  ├── View Subjects
  ├── View Marks
  ├── View Results
  └── View AI Performance Analysis
```

---

# 📊 Result Management

The system supports student result generation based on subject-wise marks.

## Subject Types

```text
THEORY
├── Internal Marks
└── External Marks


PRACTICAL
├── Internal Marks
└── External Marks


PROJECT
├── Internal Marks
└── External Marks
```

The system validates marks according to the configured maximum marks for each subject type and generates the corresponding student result.

---

# 🤖 Gemini AI Integration

The application uses **Google Gemini AI** to generate personalized student performance analysis.

## AI Analysis Flow

```text
Student Result
      ↓
Spring Boot Backend
      ↓
Student Performance Data
      ↓
Gemini AI API
      ↓
AI Analysis
      ↓
Performance Insights
      ↓
Student Dashboard
```

## Example AI Analysis

```text
Performance Summary
-------------------
The student has performed well in Java and Database Management.

Strong Areas
------------
- Java
- Database Management

Areas for Improvement
---------------------
- Operating Systems
- Computer Networks

Recommendations
---------------
- Practice programming problems regularly.
- Revise important Operating System concepts.
- Work on additional practical exercises.
```

---

# 🗄️ Database

The project uses **MySQL** as the relational database.

## Database

```text
srms_db
```

## Main Entities

```text
users
students
teachers
courses
subjects
marks
results
```

The application uses **Spring Data JPA and Hibernate** for database interaction.

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/student-result-management-system.git
```

Navigate to the project:

```bash
cd student-result-management-system
```

---

# 🔧 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

## Configure MySQL

Create a database in MySQL:

```sql
CREATE DATABASE srms_db;
```

Open:

```text
src/main/resources/application.properties
```

Configure your database:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/srms_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

## Configure Environment Variables

Do not commit sensitive information such as API keys, JWT secrets, or database passwords to GitHub.

Example:

```properties
JWT_SECRET=${JWT_SECRET}
GEMINI_API_KEY=${GEMINI_API_KEY}
```

Set the required environment variables in your local environment.

## Run Backend

Using Maven:

```bash
mvn spring-boot:run
```

The backend will start at:

```text
http://localhost:8080
```

---

# 💻 Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🔗 API Communication

The React frontend communicates with the Spring Boot backend using REST APIs.

```text
React Frontend
      ↓
     Axios
      ↓
   REST API
      ↓
Spring Boot Controller
      ↓
 Service Layer
      ↓
 Repository Layer
      ↓
    MySQL
```

---

# 📱 Application Modules

## 🔑 Authentication Module

* User login
* JWT authentication
* Role-based authorization
* Protected React routes
* Protected REST APIs
* Secure API access

## 👨‍💼 Admin Module

* Admin dashboard
* Student management
* Teacher management
* Subject management
* Course management
* User management
* Academic management

## 👨‍🏫 Teacher Module

* Teacher dashboard
* Assigned subjects
* Student list
* Marks management
* Internal marks
* External marks
* Result generation

## 👨‍🎓 Student Module

* Student dashboard
* Student profile
* Course information
* Subjects
* Marks
* Results
* Grades
* Academic performance
* AI performance analysis
* AI recommendations

---

# 🔒 Security

The project implements several security mechanisms:

* JWT-based authentication
* Password encryption
* Role-based authorization
* Protected REST APIs
* Protected React routes
* CORS configuration
* Environment variables for sensitive credentials

> **Important:** Never commit your Gemini API key, JWT secret, database password, or other sensitive credentials to GitHub.

---


# 🚀 Future Enhancements

* Email notifications
* PDF result generation
* Result download functionality
* Attendance management
* Advanced analytics dashboard
* Student performance charts
* Parent portal
* Notification system
* Docker containerization
* Cloud deployment
* Cloud database integration
* AI-based academic prediction
* Automated report generation

---

# 📌 Project Highlights

* Full-stack web application
* React + Spring Boot architecture
* RESTful API development
* Spring Security integration
* JWT authentication
* Role-based authorization
* MySQL database integration
* Spring Data JPA and Hibernate
* DBATU-oriented result and grade management
* AI-powered student performance analysis
* Google Gemini AI integration
* Responsive user interface
* Admin, Teacher, and Student dashboards
* Secure API communication

---

# 👨‍💻 Developer

## Harshad Shinde

**Computer Science & Engineering**
**Java Full Stack Developer**

### Technical Skills

```text
Java
Spring Boot
Spring Security
Spring Data JPA
Hibernate
React.js
JavaScript
MySQL
MongoDB
REST APIs
JWT
Git
GitHub
Google Gemini AI
```

---

# 📫 Connect With Me

* **GitHub:** https://github.com/Harshu3115
* **LinkedIn:** https://www.linkedin.com/in/harshad-shinde3115b2ab/
* **Email:** harshadshinde3131@gmail.com

---

# 📄 License

This project is developed for **educational and portfolio purposes**.

---

## ⭐ If you find this project useful

Feel free to **star ⭐ the repository** and explore the project.
