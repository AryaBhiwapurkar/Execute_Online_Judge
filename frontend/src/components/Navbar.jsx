import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hasToken = Boolean(localStorage.getItem("token"));

  const handleLogoClick = () => {
    navigate("/problems");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleProfile = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.left} onClick={handleLogoClick}>
        ExecuteOJ
      </div>
      <div style={styles.right}>
        <Link to="/problems" style={styles.link}>Problems</Link>

        {hasToken ? (
          <div style={styles.menuWrapper}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              style={styles.menuButton}
            >
              Profile ▾
            </button>

            {isMenuOpen ? (
              <div style={styles.menu}>
                <button type="button" onClick={handleProfile} style={styles.menuItem}>
                  Profile
                </button>
                <button type="button" onClick={handleLogout} style={styles.menuItem}>
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
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
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#ffffff",
    transition: "color 0.2s",
  },
  menuWrapper: {
    position: "relative",
  },
  menuButton: {
    background: "transparent",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    padding: 0,
  },
  menu: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 10px)",
    background: "#1e1e2f",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    minWidth: "160px",
    overflow: "hidden",
    zIndex: 50,
  },
  menuItem: {
    width: "100%",
    textAlign: "left",
    padding: "10px 12px",
    border: "none",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
};
