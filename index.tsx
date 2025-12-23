
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Aether: Executing entry module...");

const start = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error("Aether: Root container not found.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aether: Render sequence dispatched.");
  } catch (error) {
    console.error("Aether: Initial render failed.", error);
    if (window.onerror) {
       window.onerror(error.message, 'index.tsx', 0, 0, error);
    }
  }
};

// Ensure DOM is ready, though module scripts usually run after parsing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
