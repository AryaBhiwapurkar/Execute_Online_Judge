# ⚙️ Execute_Online_Judge

An end-to-end **Online Judge Platform** for solving programming problems, executing multi-language code, and receiving instant test case feedback — with **AI-powered code reviews** built-in.

> 🧠 Built using React, Node.js, MongoDB, Docker, AWS EC2, and Google Gemini API.  
> 📽️ [Demo Video](https://www.loom.com/share/7419466d504d467d8eb8e26adc8c500a?sid=2bead891-e1e5-41a9-8096-822d3454e293) | 🌐 [Live Site](https://execute-online-judge.vercel.app)

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

| Layer       | Technologies                                      |
|------------|----------------------------------------------------|
| 🖥 Frontend | React + Vite + Tailwind CSS + Axios                |
| 🧠 Backend  | Node.js + Express + JWT + Docker                   |
| 💾 Database | MongoDB + Mongoose                                 |
| ⚙️ Execution | Docker containers + `child_process` (gcc/python)  |
| 🤖 AI       | Google Gemini API                                  |
| 🔒 Auth     | JWT, bcryptjs, role-based access control           |
| ☁️ Infra    | AWS EC2/ECR, Vercel (frontend), Hostinger (DNS)    |

---

## 🚀 Features

- 🔐 **Authentication & Role System**
  - Secure JWT login/signup
  - Bcrypt password hashing
  - Admin/user role separation

- 📚 **Problem Management**
  - Admin-only creation/edit API with MongoDB storage
  - Test cases stored with problems

- 💻 **In-browser Code Editor**
  - Supports C++ and Python
  - Starter template insertion
  - Custom input/output support

- 🧪 **Run & Submit**
  - 🔹 `Run`: Executes code with user input in real-time
  - 🔹 `Submit`: Evaluates on hidden test cases & returns verdicts

- 🤖 **AI Code Review**
  - Gemini API rates user code:
    - Logic & structure analysis
    - Pros, cons, readability
    - Score out of 10

- ⚙️ **Dockerized Execution**
  - Backend container spawns isolated runtime
  - Memory cap: 256MB | Timeout: 1s

- 🧑‍💼 **Admin Panel**
  - Protected routes to manage users/problems

---

## 🧱 Project Structure

```
Execute_Online_Judge/
├── backend/
│   ├── compiler/         # Code execution logic (C++, Python)
│   ├── database/         # MongoDB connection setup
│   ├── middleware/       # JWT auth & role-based access checks
│   ├── Models/           # Mongoose schemas for User & Problem
│   ├── aiCodeReview.js   # Gemini API integration
│   └── index.js          # Express server entry point
│
├── frontend/
│   └── src/
│       ├── components/   # UI components for problems, editor, admin panel
│       ├── routes/       # Authenticated & public route configs
│       └── App.jsx       # Main app entry and layout
│
├── Dockerfile            # Docker setup for backend
├── .env.example          # Sample environment variable file
└── README.md             # You're reading it!
```
---

## 🧠 How It Works

| Step     | Action                                                                 |
|----------|------------------------------------------------------------------------|
| 🔐 Login  | JWT login; user/admin role fetched                                     |
| 📂 Select | Choose a problem from the dashboard                                    |
| 💻 Code   | Code in-browser (C++ or Python)                                        |
| ▶️ Run    | Sends code + input to backend → runs inside Docker                    |
| ✅ Submit | Evaluated on hidden test cases → verdicts shown                        |
| 🤖 Review | Code sent to Gemini API → feedback and score returned                  |
| 🛠️ Admin  | Admin-only APIs for adding/editing problems                           |

---

## 🧪 Code Execution Flow

- Code is saved as a temp file on backend
- Backend spins up a Docker container with memory and time limits
- Compiles/executes the code using native compilers
- Captures output/errors and returns response

---

## 🤖 AI-Powered Code Review

- After a successful submission, user's code is sent to the **Gemini API**
- AI returns:
  - Score (0–10) on readability and structure
  - Suggestions for improvement
  - Identified logic or performance issues
- Displayed in a friendly popup on the frontend

---

## 📈 Results & Testing

- 🔄 Live-tested with 35+ users
- ✅ Verified execution safety and feedback accuracy
- 🧩 Gathered feedback for future enhancements

---

## 🚧 Upcoming Features

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

> 🚀 This project is built for learning and experimentation.  
> PRs, forks, and issues are welcome. Star the repo if you found it helpful!

---

**Made with ❤️ to blend competitive programming, AI, and real-world dev skills.**
