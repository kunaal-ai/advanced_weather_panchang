
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Aether Main Entry
 * Responsible for mounting the atmospheric dashboard.
 */
const mountApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aether: Dashboard stabilized and live.");
  } catch (err) {
    console.error("Aether: Failed to mount application", err);
  }
};

// Execute mount once the environment is ready
if (document.readyState === 'complete') {
  mountApp();
} else {
  window.addEventListener('load', mountApp);
}
