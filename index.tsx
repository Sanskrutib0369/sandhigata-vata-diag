import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Tailwind is loaded via CDN in index.html, but we import basic styles if we had any
// For this structure, we rely on the Tailwind script.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
