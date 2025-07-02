import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Added Link

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, { //cange env
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.token);
        setMessage("Login successful!");
        setTimeout(() => {
          navigate("/problems");
        }, 1000);
      } else {
        setMessage(result.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        {message && (
          <p style={{ ...styles.message, color: message.includes("success") ? "green" : "red" }}>
            {message}
          </p>
        )}
        <p style={styles.switch}>
          New here? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #74ebd5 0%, #9face6 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  container: {
    background: "#fff",
    padding: "40px 50px",
    borderRadius: "16px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.07)",
    maxWidth: "380px",
    width: "100%",
    textAlign: "center",
    transition: "transform 0.3s ease",
  },
  heading: {
    marginBottom: "30px",
    color: "#222",
    fontWeight: "700",
    letterSpacing: "1.2px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "14px 16px",
    marginBottom: "20px",
    border: "1.8px solid #ccc",
    borderRadius: "10px",
    fontSize: "17px",
    fontWeight: "500",
    boxSizing: "border-box",
  },
  button: {
    background: "#007bff",
    color: "#fff",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
    padding: "14px 16px",
    width: "100%",
    borderRadius: "10px",
    fontSize: "17px",
    boxShadow: "0 4px 8px rgba(0,123,255,0.3)",
  },
  message: {
    marginTop: "20px",
    fontWeight: "700",
    minHeight: "24px",
    letterSpacing: "0.6px",
  },
  switch: {
    marginTop: "25px",
    fontSize: "15px",
    color: "#444",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "600",
  },
};
