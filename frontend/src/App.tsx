import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import EtchingsPage from "./pages/EtchingsPage";
import StudiesPage from "./pages/StudiesPage";
import AboutPage from "./pages/AboutPage";
import NewsPage from "./pages/NewsPage";
import PostPage from "./pages/PostPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/etchings" element={<EtchingsPage />} />
            <Route path="/studies" element={<StudiesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<PostPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
