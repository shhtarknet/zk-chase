import { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PhaserGame } from "@/phaser/PhaserGame";
import { Header } from "./ui/containers/Header";
import { ThemeProvider } from "./ui/elements/theme-provider";
import { Toaster } from "./ui/elements/sonner";
import { useActions } from "./hooks/useActions";
import { Leaderboard } from "./ui/modules/Leaderboard";

function Core() {
  const phaserRef = useRef(null);

  useActions();

  return (
    <div id="app" className="flex flex-col items-center">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Header />
        <PhaserGame ref={phaserRef} currentActiveScene={undefined} />
        <div className="absolute top-1/2 -translate-y-1/2 right-8">
          <Leaderboard />
        </div>
      </ThemeProvider>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Core />} />
      </Routes>
      <Toaster position="top-center" />
    </Router>
  );
}

export default App;
