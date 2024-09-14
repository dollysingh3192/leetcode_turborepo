import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Problems, Landing, ProblemDetail } from "./pages";
import { Navigate } from "react-router-dom";
import { Navbar, SignIn, SignUp } from "./components";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, redirect to the landing page (sign-in)
    return <Navigate to="/" />;
  }

  // If token exists, render the children (protected component)
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Render Navbar on all pages */}
      <Routes>
        {/* Landing page (SignIn page) accessible to everyone */}
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        {/* Protected Routes */}
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
