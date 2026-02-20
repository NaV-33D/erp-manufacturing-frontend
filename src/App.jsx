import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import NewRoutes from "./routes/NewRoutes";
import Login from "./pages/onboarding/Login";
import { ToastProvider } from "./components/toast/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Layout */}
          <Route element={<Sidebar />}>
            {NewRoutes.map(({ path, element, children }) => (
              <Route key={path} path={path} element={element}>
                {children?.map((c, idx) => (
                  <Route
                    key={idx}
                    index={c.index}
                    path={c.path}
                    element={c.element}
                  />
                ))}
              </Route>
            ))}
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
