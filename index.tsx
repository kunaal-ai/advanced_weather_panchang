
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Aether: Initializing Core Systems...");

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aether: Root render command issued.");
  } catch (error) {
    console.error("Aether: Critical failure during React mount.", error);
    // Trigger global error handler to show UI overlay
    window.dispatchEvent(new ErrorEvent('error', { error: error, message: error.message }));
  }
} else {
  console.error("Aether Error: System mount point #root not found in document.");
}
