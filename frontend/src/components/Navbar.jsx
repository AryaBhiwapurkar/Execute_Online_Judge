import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/problems");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left} onClick={handleLogoClick}>
        ExecuteOJ
      </div>
      <div style={styles.right}>
        <Link to="/problems" style={styles.link}>Problems</Link>
        <Link to="/profile" style={styles.link}>Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
  },
  left: {
    cursor: "pointer",
    fontSize: "22px",
    color: "#61dafb",
  },
  right: {
    display: "flex",
    gap: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#ffffff",
    transition: "color 0.2s",
  }
};
