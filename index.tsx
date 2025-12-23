
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Aether: Starting system mount sequence...");

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    console.log("Aether: React root created. Dispatching App...");
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aether: Initial render complete.");
  } catch (error) {
    console.error("Aether: Fatal crash during system initialization.", error);
    // Trigger the global error handler defined in index.html
    if (window.onerror) {
      window.onerror(error.message, 'index.tsx', 0, 0, error);
    }
  }
} else {
  console.error("Aether: Hardware failure. Primary display buffer #root not found.");
}
