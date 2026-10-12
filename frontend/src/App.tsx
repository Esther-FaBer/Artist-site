import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import PaintingsPage from "./pages/PaintingsPage";
import StudiesPage from "./pages/StudiesPage";
import ExhibitionsPage from "./pages/ExhibitionsPage";
import AboutPage from "./pages/AboutPage";
import TextsPage from "./pages/TextsPage";
import PostPage from "./pages/PostPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/paintings" element={<PaintingsPage />} />
        <Route path="/studies" element={<StudiesPage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/texts" element={<TextsPage />} />
        <Route path="/texts/:slug" element={<PostPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
