🧩 TaskFlow — Task Manager Web App
📋 Overview

TaskFlow is a full-stack task management application built with Node.js, Express, PostgreSQL, Sequelize, and React + TypeScript.
It allows users to create, assign, and manage tasks efficiently with authentication and role-based access.

🚀 Features

✅ User registration & login (JWT Authentication)

👥 Role-based access (Admin/User)

🧾 Create, edit, delete, and view tasks

🗂️ Assign tasks to users

🔄 Toggle completion status

🔍 Filter and search tasks

🧮 Dashboard with task statistics

🧑‍💻 Profile management (update info, change password)

🧱 Responsive frontend UI (React + Tailwind CSS)

⚙️ Tech Stack

Backend:

Node.js + Express

PostgreSQL + Sequelize ORM

JWT + bcrypt for authentication

Frontend:

React 18 + TypeScript

React Router v6

Axios for API calls

Tailwind CSS

🧠 Folder Structure
Todo/
 ├── backend/        # Express + PostgreSQL API
 ├── frontend/       # React + TypeScript client
 ├── .gitignore
 ├── README.md

🖥️ Backend Setup
cd backend
npm install


Create a .env file:

DB_NAME=taskflow
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret


Run the backend:

npm run dev

💻 Frontend Setup
cd frontend
npm install
npm start


The app runs at:
👉 http://localhost:3000

Backend runs at:
👉 http://localhost:5000

🧰 Database

PostgreSQL is used as the main database.
Tables:

Users

Tasks

ORM: Sequelize (auto-syncs tables).

