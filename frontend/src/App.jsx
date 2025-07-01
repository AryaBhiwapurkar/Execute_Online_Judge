import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Problems from "./pages/Problems";
import ProblemStatement from "./pages/ProblemStatement";
import Submit from "./pages/Submit"; // ✅ Import Submit component
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemStatement />} />
        <Route
          path="/submit/:id"
          element={
            <ProtectedRoute>
              <Submit />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
