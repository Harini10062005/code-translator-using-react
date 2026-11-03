import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TranslatorPage from "./pages/TranslatorPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/translator" element={<TranslatorPage />} />
        <Route path="/about"      element={<AboutPage />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/signup"     element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;