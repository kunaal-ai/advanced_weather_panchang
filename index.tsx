
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Aether Entry Point
 * Orchestrates the mounting of the React tree.
 */
const mount = () => {
  console.log("Aether: System components identified. Mounting...");
  const container = document.getElementById('root');
  
  if (!container) {
    console.error("Aether: Critical failure. Root display buffer not found.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aether: Dashboard live.");
  } catch (err) {
    console.error("Aether: Dashboard failed to stabilize.", err);
    if (window.onerror) {
      window.onerror(err.message, 'index.tsx', 0, 0, err);
    }
  }
};

// Initiate mount sequence
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
