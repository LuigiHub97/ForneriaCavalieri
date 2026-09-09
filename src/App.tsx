import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { Ingredients } from "./pages/Ingredients";
import { Login } from "./pages/Login";
import { Pizzas } from "./pages/Pizzas";
import { Register } from "./pages/Register";

function AppLayout() {
  const { token } = useAuth();
  return (
    <>
      {token && <Navbar />}
      <main className="app-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pizzas" element={<Pizzas />} />
            <Route path="/ingredients" element={<Ingredients />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
