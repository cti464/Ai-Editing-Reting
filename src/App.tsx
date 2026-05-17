import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProPlan from "./pages/ProPlan";
import AiTools from "./pages/AiTools";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aitools" element={<AiTools />} />
        <Route path="/pro" element={<ProPlan />} />
      </Route>
    </Routes>
  );
}

export default App;
