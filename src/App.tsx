import { DarkModeProvider } from "./contexts/DarkModeContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import Header from "./components/global/Header";
import Loader from "./components/global/Loader";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Solutions from "./pages/Solutions";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <DarkModeProvider>
      <SnackbarProvider>
        <LoadingProvider>
          <div className="min-h-screen transition-colors duration-200">
            <Header />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </LoadingProvider>
      </SnackbarProvider>
    </DarkModeProvider>
  );
}

export default App;
