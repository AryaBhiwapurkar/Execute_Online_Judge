import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProblemStatement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProblem(data);
        } else {
          setError(data.message || "Failed to fetch problem.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Server not responding.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmitClick = () => {
    navigate(`/submit/${id}`);
  };

  const formatText = (text) => {
    if (!text) return "";
    return text.replace(/\\n/g, '\n');
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.page}>
        {loading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <div style={styles.card}>
            <h2 style={styles.title}>{problem.title}</h2>



            <div style={styles.section}>
              <h3 style={styles.subheading}>📝 Description</h3>
              <pre style={styles.codeBlock}>{formatText(problem.problemStatement)}</pre>
            </div>
            <div style={styles.section}>
              <h3 style={styles.subheading}>📥 Input Format</h3>
              <pre style={styles.codeBlock}>{formatText(problem.inputFormat)}</pre>
            </div>
            <div style={styles.section}>
              <h3 style={styles.subheading}>📤 Output Format</h3>
              <pre style={styles.codeBlock}>{formatText(problem.outputFormat)}</pre>
            </div>
            <div style={styles.section}>
              <h3 style={styles.subheading}>📌 Constraints</h3>
              <pre style={styles.codeBlock}>{formatText(problem.constraints)}</pre>
            </div>
            <div style={styles.section}>
              <h3 style={styles.subheading}>🕒 Time & Memory Limits</h3>
              <pre style={styles.codeBlock}>
                Time Limit: {problem.timeLimit/1000}s{"\n"}
                Memory Limit: {problem.memoryLimit} MB
              </pre>
            </div>
            <div style={styles.section}>
              <h3 style={styles.subheading}>📎 Sample Input</h3>
              <pre style={styles.codeBlock}>{formatText(problem.sampleInput)}</pre>
            </div>
            <div style={styles.section}>
              <h3 style={styles.subheading}>📎 Sample Output</h3>
              <pre style={styles.codeBlock}>{formatText(problem.sampleOutput)}</pre>
            </div>

            <button onClick={handleSubmitClick} style={styles.button}>
              🚀 Submit Solution
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemStatement;

// 🧠 same styles as before...
const styles = {
  wrapper: {
    width: "100vw",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  page: {
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "calc(100vh - 80px)",
    overflowY: "auto",
    scrollBehavior: "smooth",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    maxWidth: "900px",
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#2d3436",
    textAlign: "center",
    textShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  subheading: {
    marginBottom: "10px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#0984e3",
  },
  section: {
    marginBottom: "24px",
  },
  loadingText: {
    color: "#2d3436",
    fontSize: "18px",
    textAlign: "center",
    fontWeight: "500",
  },
  codeBlock: {
    background: "#f7f7f7",
    borderLeft: "5px solid #0984e3",
    padding: "12px 16px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "15px",
    whiteSpace: "pre-wrap",
    color: "#2d3436",
    overflowX: "auto",
  },
  button: {
    background: "#0984e3",
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "block",
    margin: "0 auto",
    marginTop: "30px",
    transition: "background 0.3s ease",
  },
  error: {
    color: "#d63031",
    fontWeight: "bold",
    background: "#ffeaa7",
    padding: "16px",
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "800px",
    margin: "40px auto",
  },
};
