
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Aether: Initializing React mount...");

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aether: Mount successful.");
  } catch (error) {
    console.error("Aether: Render error:", error);
    if (window.onerror) {
       window.onerror(error.message, 'index.tsx', 0, 0, error);
    }
  }
} else {
  console.error("Aether: Critical failure - #root container not found.");
}
