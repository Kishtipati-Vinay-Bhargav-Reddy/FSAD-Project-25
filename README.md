# 📚 Assignment Grading System (Full Stack Project)

## 🚀 Overview

The **Assignment Grading System** is a full-stack web application designed to streamline assignment submission, grading, and performance tracking for students and teachers.

This project is built using **React (Frontend)** and **Spring Boot (Backend)** with a **MySQL database**.

---

## 🛠️ Tech Stack

### 🎨 Frontend

* React.js
* Axios
* HTML5, CSS3, JavaScript

### 🔙 Backend

* Java
* Spring Boot
* Spring Data JPA
* REST APIs

### 🗄️ Database

* MySQL

---

## ✨ Features

### 👨‍🎓 Student

* View assignments
* Upload submissions
* Track submission status
* View grades and feedback

### 👨‍🏫 Teacher

* Create assignments
* View student submissions
* Grade assignments
* Provide feedback

### 🔐 System Features

* File upload support
* Assignment tracking
* Grading system
* REST API integration

---

## 📁 Project Structure

```
project-root/
│
├── backend/ (Spring Boot)
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   └── resources/
│
├── frontend/ (React)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── uploads/ (Stored files)
```

---

## ⚙️ Installation & Setup

### 🔙 Backend Setup

1. Navigate to backend folder:

```
cd grading-system
```

2. Install dependencies:

```
mvn clean install
```

3. Run the server:

```
mvn spring-boot:run
```

---

### 🎨 Frontend Setup

1. Navigate to frontend folder:

```
cd vinay3/client
```

2. Install dependencies:

```
npm install
```

3. Start the application:

```
npm start
```

---

## 🗄️ Database Configuration

Update `application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/grading
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
```

---

## 📡 API Endpoints (Sample)

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | /api/assignments | Get all assignments |
| POST   | /api/assignments | Create assignment   |
| POST   | /api/upload      | Upload file         |
| POST   | /api/grade       | Submit grade        |

---

## 📸 Screenshots

<img width="1919" height="924" alt="image" src="https://github.com/user-attachments/assets/68958dc3-54e7-433a-98a8-52e1d29ca0be" />


---

## 🚀 Future Enhancements

* JWT Authentication
* Role-based access (Admin/Teacher/Student)
* Real-time notifications
* Dashboard analytics
* Leaderboard system

---

## 🧪 Testing

* Test APIs using Postman
* Frontend tested in browser

---

## 👨‍💻 Author

**Vinay Bhargav Reddy**

* B.Tech CSE Student
* Full Stack Developer

---

## 📌 Notes

* Ensure MySQL is running before starting backend
* Uploads are stored in `/uploads` folder
* Backend runs on `http://localhost:8080`
* Frontend runs on `http://localhost:3000`

---

## ⭐ Contribution

Feel free to fork and improve the project!

---

## 📜 License

This project is for educational purposes.
