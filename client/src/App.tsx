import { useRef } from "react";

import { PhaserGame } from "@/phaser/PhaserGame";
import { Header } from "./ui/containers/Header";
import { ThemeProvider } from "./ui/elements/theme-provider";

function App() {
  const phaserRef = useRef(null);

  return (
    <div id="app" className="flex flex-col items-center">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Header />
        <PhaserGame ref={phaserRef} currentActiveScene={undefined} />
      </ThemeProvider>
    </div>
  );
}

export default App;
