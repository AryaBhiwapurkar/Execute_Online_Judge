# Execute_Online_Judge

An end-to-end online judge platform built for learning, practicing, and evaluating programming skills. With secure authentication, multi-language code execution, and AI-powered review, this project aims to replicate core features of modern online coding platforms while being fully open-source and extensible.

---

## What We Made & Why

**Purpose:**  
Execute_Online_Judge is designed to let users solve programming problems, run code, receive instant test feedback, and get AI-generated code reviews — all in a streamlined, modern web interface.  
This project was created to:

- Deepen understanding of full-stack web engineering concepts
- Practice integrating real-world tools like Docker, JWT, MongoDB, and cloud AI APIs
- Build a scalable system for evaluating and reviewing code, like major online judges
- Explore secure multi-user systems, REST API design, and cloud-ready deployment

---

## Technical Overview

### Architecture & Stack

- **Frontend:**  
  Developed with **React** + **Vite** for a modern SPA experience, with Axios for API calls.
- **Backend:**  
  **Node.js** + **Express** API server. Handles authentication, problem management, code execution, and AI integration.
- **Database:**  
  **MongoDB** (via Mongoose) for user and problem storage.
- **Code Execution:**  
  Supports C++, Python, and Java. The backend generates and runs code in isolated processes using dynamic file creation.
- **AI Code Review:**  
  Google Gemini API integration for automated code scoring and improvement suggestions.
- **Containerization:**  
  Dockerized backend for ease of deployment.
- **Security:**  
  JWT authentication, role-based access, and secure code practices.

---

## Features

- **Authentication:**  
  JWT-based, with password hashing and role support (user/admin)
- **Problem Management:**  
  Problems and test cases stored in MongoDB; admin-only management endpoints
- **Code Editor & Language Support:**  
  In-browser editor with C++, Python, and Java support; language templates
- **Run & Submit:**
  - "Run" executes code on custom input
  - "Submit" checks code against all problem test cases, returns verdicts
- **AI Code Review:**  
  Auto-rates code and gives actionable feedback using Gemini
- **Admin Panel:**  
  Protected routes for administrative actions
- **Modern UI:**  
  Responsive SPA with React and Tailwind CSS

---

## How It Works

1. **Authenticate:**  
   JWT-secured login/registration with roles
2. **Select Problem:**  
   Problems queried from MongoDB
3. **Edit Code:**  
   Editor with language selection and template insertion
4. **Run Code:**  
   Sends code + input to backend, which runs and streams output
5. **Submit:**  
   Checks code against all test cases for verdict
6. **AI Review:**  
   Gemini rates and provides structured feedback
7. **Admin:**  
   Admin role can access protected endpoints for problem/user management

---

## Project Structure

```
├── backend/
│   ├── compiler/        # Code execution logic
│   ├── database/        # Database connection logic
│   ├── middleware/      # Auth middleware
│   ├── Models/          # User & Problem schemas
│   ├── aiCodeReview.js  # AI code review logic
│   └── index.js         # Express server entry
├── frontend/
│   ├── src/             # React source
│   └── README.md        # Frontend-specific info
├── README.md            # Project documentation
```

---

## Technology Stack

- **Frontend:** React, Vite, Axios, Tailwind CSS
- **Backend:** Node.js, Express, JWT, bcryptjs, dotenv, CORS, child_process
- **Database:** MongoDB, Mongoose
- **AI:** Google Gemini API
- **Execution:** C++ (g++), Python3, Java (future)
- **Containerization:** Docker

---

## Future Scope

- **More Problems & Testcases:**  
  Many more problems and curated test cases will be added.
- **Profile Tab:**  
  User profile page to view stats, history, achievements.
- **Submission Storage:**  
  Persist and display user submissions, verdicts, and AI feedback for later review.
- **UI Enhancements:**  
  Dashboard for admins, submission leaderboard, and user progress tracking.
- **Language Support:**  
  Add more languages and richer code editor features.
- **Problem Creation UI:**  
  Admin interface for adding/editing problems from the frontend.
- **Advanced AI Feedback:**  
  More granular code analysis, plagiarism check, and hints.

---

## Author

**Arya Bhiwapurkar**  
[github.com/AryaBhiwapurkar](https://github.com/AryaBhiwapurkar)
