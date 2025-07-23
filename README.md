# ⚙️ Execute_Online_Judge

An end-to-end **Online Judge Platform** for solving programming problems, executing multi-language code, and receiving instant test case feedback — with **AI-powered code reviews** built-in.

> 🧠 Built using React, Node.js, MongoDB, Docker, and Google Gemini API.

---

## 🎯 What We Made & Why

`Execute_Online_Judge` replicates the core features of platforms like LeetCode or Codeforces — but as a self-built, extensible, full-stack project.

**🔍 Purpose:**

- Build a modular, real-world online judge system  
- Learn containerization, REST API design, and secure backend practices  
- Integrate AI for automated code feedback and ratings  
- Understand multi-language code execution in isolated environments  

---

## 🛠️ Tech Stack at a Glance

| Layer       | Technologies                             |
|------------|-------------------------------------------|
| 🖥 Frontend | React + Vite + Tailwind CSS + Axios       |
| 🧠 Backend  | Node.js + Express + JWT + Docker          |
| 💾 Database | MongoDB + Mongoose                        |
| ⚙️ Execution | Native compilers via `child_process`      |
| 🤖 AI       | Google Gemini API                         |
| 🔒 Auth     | JWT, bcryptjs, role-based access control  |

---

## 🚀 Features

- 🔐 **Authentication & Role System**
  - JWT-secured login/registration
  - Password hashing, user/admin separation

- 📚 **Problem Management**
  - MongoDB-stored problems with test cases
  - Admin-protected problem creation/edit APIs

- 💻 **In-browser Code Editor**
  - Language selection (C++, Python)
  - Starter templates auto-inserted

- 🧪 **Run & Submit**
  - 🔹 Run: Executes code on user input
  - 🔹 Submit: Runs code on hidden test cases & returns verdicts

- 🤖 **AI Code Review**
  - Gemini API analyzes code for:
    - Logic & structure
    - Suggestions for improvement
    - Rating & readability feedback

- ⚙️ **Dockerized Backend**
  - Containerized execution environment for safe, isolated code execution

- 🧑‍💼 **Admin Panel**
  - Protected routes for managing problems, users

---

## 🧱 Project Architecture

```
Execute_Online_Judge/
├── backend/
│   ├── compiler/         → Code execution logic (C++, Python)
│   ├── database/         → MongoDB connection
│   ├── middleware/       → JWT auth, role checks
│   ├── Models/           → User & Problem schemas
│   ├── aiCodeReview.js   → Google Gemini API integration
│   └── index.js          → Express server entry
│
├── frontend/
│   ├── src/
│   │   ├── components/   → Pages, problem views, editor
│   │   ├── routes/       → Auth & dashboard routes
│   │   └── App.jsx       → App entry point
│
├── Dockerfile            → Backend Docker config
├── .env.example          → Environment variables template
└── README.md             → You’re here!
```

---

## 🧠 How It Works

| Step     | Action                                                                 |
|----------|------------------------------------------------------------------------|
| 🔐 Login  | JWT-based login; role (user/admin) assigned                           |
| 📂 Select | Choose a coding problem from the dashboard                            |
| 💻 Code   | Write code in the browser with selected language                      |
| ▶️ Run    | Sends code + input to backend; backend executes and returns output    |
| ✅ Submit | Backend runs code against all hidden test cases; verdicts shown       |
| 🤖 Review | Gemini AI rates code quality and offers improvement suggestions       |
| 🛠️ Admin  | Admin-only API endpoints for managing problems                        |

---

## 🧪 Code Execution: Under the Hood

- When a user clicks **Run**, their code is:
  - Saved as a temporary file
  - Wrapped in a Docker container with the appropriate compiler/interpreter
  - Executed securely with timeout & memory constraints
  - Output or errors returned back to the frontend

- For **Submit**, the same process runs across all hidden test cases with verdicts like `Passed`, `Failed`, `Runtime Error`, etc.

---

## 🤖 AI-Powered Code Review

- On submission, user code is sent to the **Gemini API**
- The AI returns:
  - A score (quality/readability)
  - Structural issues
  - Suggestions for cleaner logic or optimizations

---

## 📷 UI Overview *(Coming Soon)*

You can add screenshots here showing:

- 📘 Problem page
- 💻 Code editor with language dropdown
- 📊 Verdicts for each test case
- 🤖 Gemini feedback panel

---

## 📈 Future Scope

| Feature                  | Status       |
|--------------------------|--------------|
| 📝 Profile Page           | 🔜 Planned    |
| 🧾 Submission History     | 🔜 Planned    |
| 🏆 Leaderboard            | 🔜 Planned    |
| 👨‍🏫 Admin UI Panel        | 🔜 Planned    |
| 🧠 Smarter AI Feedback     | 🔜 Planned    |
| 📁 PDF Export of Reviews  | 🔜 Planned    |
| 🐍 More Language Support  | 🔜 Planned    |

---


## 💬 Feedback & Contributions

This project is open-source and built for learning. Contributions, issues, forks, and stars are welcome!

> Made with ❤️ to blend competitive programming, AI, and real-world dev skills.
