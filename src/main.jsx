import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const mount = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
  }

  try {
    const root = ReactDOM.createRoot(rootElement || document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:#f9fafb;';
    errorDiv.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <h1 style="color:#1e40af;font-size:24px;margin-bottom:16px;">Failed to load application</h1>
        <p style="color:#4b5563;margin-bottom:16px;">Please try refreshing the page</p>
        <button onclick="window.location.reload()" style="background:#2563eb;color:white;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;">
          Refresh Page
        </button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}

// Handle errors that occur during initialization
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  if (!document.getElementById('root')) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:#f9fafb;';
    errorDiv.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <h1 style="color:#dc2626;font-size:24px;margin-bottom:16px;">An error occurred</h1>
        <p style="color:#4b5563;margin-bottom:16px;">${event.error?.message || 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="background:#2563eb;color:white;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;">
          Refresh Page
        </button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }
});