import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/problems");
        const data = await res.json();
        if (res.ok) {
          setProblems(data);
        } else {
          setError(data.message || "Failed to fetch problems.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Server not responding.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleClick = (id) => {
    navigate(`/problems/${id}`);
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={styles.heading}>📘 Problems List</h2>

          {loading && <p style={styles.loadingText}>Loading...</p>}
          {error && <p style={styles.error}>{error}</p>}

          {!loading && !error && (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => (
                    <tr
                      key={problem.problemId}
                      style={styles.row}
                      onClick={() => handleClick(problem.problemId)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = styles.rowHover.backgroundColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td style={styles.td}>{problem.problemId}</td>
                      <td style={{ ...styles.td, ...styles.link }}>{problem.title}</td>
                      <td style={styles.td}>{problem.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;

const styles = {
  wrapper: {
    width: "100vw", // Full viewport width
    minHeight: "100vh", // Full viewport height
    background: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)", // Light peach gradient
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  page: {
    width: "100%",
    minHeight: "calc(100vh - 80px)", // Account for navbar height
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    boxSizing: "border-box",
  },
  container: {
    background: "rgba(255, 255, 255, 0.95)", // Slightly transparent white
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "1200px", // Increased max width for better responsiveness
    backdropFilter: "blur(10px)", // Glass effect
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "40px",
    fontSize: "32px",
    fontWeight: "700",
    color: "#2d3436",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    width: "100%",
    // Add responsive styles
    "@media (max-width: 768px)": {
      fontSize: "14px",
    },
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    margin: "0 auto", // Center the table
    minWidth: "600px", // Ensure minimum width for small screens
  },
  th: {
    background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
    color: "#fff",
    fontWeight: "600",
    padding: "16px 20px",
    fontSize: "16px",
    letterSpacing: "0.5px",
    textAlign: "center",
    border: "none",
    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
  },
  td: {
    padding: "16px 20px",
    fontSize: "15px",
    color: "#2d3436",
    textAlign: "center",
    borderBottom: "1px solid #e9ecef",
    transition: "all 0.3s ease",
  },
  row: {
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "transparent",
  },
  rowHover: {
    backgroundColor: "#f8f9fa",
    transform: "scale(1.01)",
  },
  link: {
    color: "#0984e3",
    fontWeight: "500",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  error: {
    color: "#d63031",
    fontWeight: "600",
    textAlign: "center",
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#ffeaa7",
    borderRadius: "8px",
    border: "1px solid #fab1a0",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "18px",
    color: "#636e72",
    fontWeight: "500",
    marginTop: "40px",
  },
};