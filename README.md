# Student Record Management System

A full-stack web application designed for college staff and trainers to effortlessly maintain and manage basic student details, branches, and marks in one centralized platform.

Built with **Java Spring Boot REST API** (Backend), **H2 In-Memory Database** (Data Storage), and **React.js + Vite + Axios** (Frontend).

---

## 🌟 Required Features Implemented

1. **Add a Student**:
   - Save students with **Name**, **Roll Number**, **Branch**, and **Marks**.
   - Live visual score bar & dynamic grade calculator ($A+$, $A$, $B$, $C$, $D$, $E$, $F$).
   
2. **Duplicate Roll Number Prevention**:
   - Unique roll number constraint enforced across the database, entity, and service layers.
   - User-friendly validation message returned when an existing roll number is submitted (HTTP 409 Conflict).

3. **Marks Range Validation (0 to 100)**:
   - Validated through Bean Validation annotations (`@Min(0)`, `@Max(100)`) and service checks.
   - Helpful inline validation messages and modal alerts appear when out-of-range marks are entered.

4. **Display All Saved Students in a Table**:
   - Displays student initials avatar, unique roll number badge, branch, marks with an animated gradient progress bar, grade badge, and pass/fail status pill.

5. **Edit & Delete Student Records**:
   - **Edit**: Modal dialog allowing real-time modification of name, roll number, branch, and marks.
   - **Delete**: Confirmation modal dialog displaying the student's name and roll number before permanently deleting the record.

6. **Search by Roll Number**:
   - Real-time search filter by **Roll Number** or **Name**.
   - Dedicated "Find" button querying the backend search endpoint directly (`/api/students/search/roll?rollNumber=...`).

7. **Show Total Number of Students Registered**:
   - Real-time **Total Registered Students** counter card.
   - Additional insightful analytics: **Class Average Marks**, **Highest Score**, **Lowest Score**, and **Pass Rate %**.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + Vite | Fast, responsive UI with modern Vanilla CSS design system |
| **HTTP Client** | Axios | REST API integration with error handling interceptors |
| **Icons** | Lucide React | Modern, clean iconography |
| **Backend** | Java 21 + Spring Boot 4.x | RESTful API with Bean Validation and Global Exception Handler |
| **Database** | H2 Database | Embedded in-memory SQL database (`jdbc:h2:mem:studentdb`) |
| **ORM** | Spring Data JPA / Hibernate | Repository pattern with custom queries |

---

## 🚀 Running the Application Locally

### Method 1: Using the Startup Script (Recommended)
From the project root directory:
```bash
./run.sh
```
This automatically starts both the Spring Boot backend and the React frontend and opens `http://localhost:5173` in your browser.

---

### Method 2: Running Individually

#### 1. Backend (Spring Boot):
```bash
cd backend
./mvnw spring-boot:run
```
- API Base URL: `http://localhost:8080/api/students`
- H2 Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:studentdb`, Username: `sa`, Password: *empty*)

#### 2. Frontend (React):
```bash
cd frontend
npm install
npm run dev
```
- Web Application URL: `http://localhost:5173`

---

## 📡 REST API Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all students (supports optional `?search=` and `?branch=`) |
| `GET` | `/api/students/{id}` | Get student by ID |
| `GET` | `/api/students/search/roll?rollNumber={roll}` | Find student specifically by Roll Number |
| `GET` | `/api/students/stats` | Get dashboard statistics (Total, Average, Max, Min, Pass %) |
| `POST` | `/api/students` | Add new student (Validates unique roll & marks 0-100) |
| `PUT` | `/api/students/{id}` | Update student record (Validates unique roll & marks 0-100) |
| `DELETE` | `/api/students/{id}` | Delete student record |
