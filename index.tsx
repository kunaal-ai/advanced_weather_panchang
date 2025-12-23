
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Aether: System boot sequence initiated.");

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Aether: Core systems mounted and rendering.");
  } catch (error) {
    console.error("Aether: Mount failed.", error);
    if (window.onerror) {
      window.onerror(error.message, 'index.tsx', 0, 0, error);
    }
  }
} else {
  console.error("Aether: Primary display buffer #root not found.");
}
