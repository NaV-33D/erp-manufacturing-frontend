import { Routes, Route } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";

// import your pages
// import Dashboard from "./pages/Dashboard";
// import UserManagement from "./pages/UserManagement";
// import ProductList from "./pages/ProductList";
// import Payments from "./pages/Payments";

function App() {
  return (
    <Routes>
      {/* Layout Route */}
      <Route path="/" element={<Sidebar />}>
        <Route path="dashboard" element={<Dashboard />} />
        {/*<Route path="usermanagement" element={<UserManagement />} />
        <Route path="allproductlist" element={<ProductList />} />
        <Route path="payments" element={<Payments />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
