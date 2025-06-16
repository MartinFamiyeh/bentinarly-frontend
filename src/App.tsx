import { DarkModeProvider } from "./contexts/DarkModeContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import Header from "./components/global/Header";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Solutions from "./pages/Solutions";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

function App() {
  return (
    <DarkModeProvider>
      <SnackbarProvider>
        <LoadingProvider>
          <div className="min-h-screen bg-white dark:bg-[#0B0B0B] transition-colors duration-200">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </LoadingProvider>
      </SnackbarProvider>
    </DarkModeProvider>
  );
}

export default App;
