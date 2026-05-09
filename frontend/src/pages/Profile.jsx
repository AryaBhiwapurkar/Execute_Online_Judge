import React, { useEffect, useState } from "react";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load profile");
          return;
        }

        setUser(data);
      } catch (e) {
        console.error(e);
        setError("Server not responding.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>👤 Profile</h2>

          {loading && <p style={styles.text}>Loading...</p>}
          {error && <p style={styles.error}>{error}</p>}

          {!loading && !error && user && (
            <div style={styles.grid}>
              <div style={styles.row}>
                <div style={styles.label}>Name</div>
                <div style={styles.value}>
                  {user.firstName} {user.lastName}
                </div>
              </div>
              <div style={styles.row}>
                <div style={styles.label}>Email</div>
                <div style={styles.value}>{user.email}</div>
              </div>
              <div style={styles.row}>
                <div style={styles.label}>Role</div>
                <div style={styles.value}>{user.role}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

const styles = {
  wrapper: {
    width: "100vw",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
  },
  page: {
    padding: "30px 20px",
    boxSizing: "border-box",
  },
  card: {
    maxWidth: "720px",
    margin: "0 auto",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
  title: {
    margin: "0 0 18px 0",
    color: "#222",
    fontWeight: 700,
    fontSize: "24px",
  },
  text: {
    margin: 0,
    color: "#444",
  },
  error: {
    margin: 0,
    color: "#b00020",
    fontWeight: 600,
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 14px",
    background: "#f7f7f9",
    borderRadius: "12px",
  },
  label: {
    color: "#666",
    fontWeight: 700,
  },
  value: {
    color: "#222",
    fontWeight: 600,
  },
};
