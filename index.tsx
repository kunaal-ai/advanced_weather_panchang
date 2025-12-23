
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  try {
    const container = document.getElementById('root');
    if (!container) {
      console.error("Root container not found");
      return;
    }
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aether: React mounted successfully");
  } catch (err) {
    console.error("Aether: Failed to mount React app", err);
    // Explicitly throw to trigger window.onerror if necessary
    throw err;
  }
};

// Handle mounting based on document state
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp();
} else {
  window.addEventListener('DOMContentLoaded', mountApp);
}
