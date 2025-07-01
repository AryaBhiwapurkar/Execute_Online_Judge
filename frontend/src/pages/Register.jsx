import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("red");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      setMessage(result.message);
      setColor(res.status === 201 ? "green" : "red");

      if (res.status === 201) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: ""
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.log("Register error:", error);
      setMessage("Something went wrong. Please try again.");
      setColor("red");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container} role="main" aria-labelledby="registerHeading">
        <h2 id="registerHeading">Register</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            autoComplete="given-name"
            style={styles.input}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            autoComplete="family-name"
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            style={styles.input}
          />
          <button type="submit" aria-label="Register Account" style={styles.button}>
            Register
          </button>
        </form>
        <p style={{ ...styles.message, color }} aria-live="polite">
          {message}
        </p>
        <p style={styles.switch}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

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
    transition: "transform 0.3s ease"
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
    boxSizing: "border-box"
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
    boxShadow: "0 4px 8px rgba(0,123,255,0.3)"
  },
  message: {
    marginTop: "20px",
    fontWeight: "700",
    minHeight: "24px",
    letterSpacing: "0.6px"
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
