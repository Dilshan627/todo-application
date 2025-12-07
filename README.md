# 📝 Todo Application - Full Stack Project

A full-stack Todo application built using **React**, **Spring Boot**, and **MySQL**, fully containerized using **Docker** and **Docker Compose**.

---

## 📸 Application Preview

![App UI](image/Screenshot%20from%202025-12-07%2015-42-37.png)

---

## 🏗️ Three-Tier Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │ ───> │   Backend   │ ───> │  Database   │
│   (React)   │ HTTP │(Spring Boot)│JDBC  │   (MySQL)   │
│   Port 3000 │ <─── │  Port 5000  │ <─── │  Port 3306  │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## 🧩 Components

### **Frontend**

* React 18 SPA
* Modern UI
* Served via **Nginx**

### **Backend**

* Spring Boot 3.2
* REST API
* Layered architecture

### **Database**

* MySQL 8.0
* Auto table creation (via `application.properties`)

---

## 🚀 Quick Start

Make sure you have installed:

* **Docker Desktop 20.10+**
* **Docker Compose 2.0+**
* **Git**
* Linux/macOS or **WSL2** for Windows

---

## ⚙️ Installation Steps

### **1. Clone the Repository**

```bash
git clone https://github.com/Dilshan627/todo-application.git
cd todo-application
```

### **2. Start All Services**

```bash
docker-compose up --build
```

This command will:

* Build the **Spring Boot backend**
* Build the **React frontend**
* Start **MySQL** database
* Auto-create tables (backend runs first)
* Start all containers together

---

## 📌 After Services Are Running

![Containers Running](image/Screenshot%20from%202025-12-07%2015-45-49.png)

### **Access the Application**

* **Frontend UI:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:5000/api/tasks](http://localhost:5000/api/tasks)

---

## 🛑 Stopping the Application

### Stop containers only:

```bash
docker-compose down
```

### Stop and remove database data:

```bash
docker-compose down -v
```

---

## 📘 API Documentation (Swagger)

Access Swagger UI:

```
http://localhost:8080/swagger-ui/index.html#
```

![Swagger](image/swaggerimage.png)

