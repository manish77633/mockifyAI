import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log("DEBUG: Entry point main.jsx reached.");

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("DEBUG CRITICAL: #root element not found!");
  } else {
    console.log("DEBUG: Mounting App component...");
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    console.log("DEBUG: Render call complete.");
  }
} catch (error) {
  console.error("DEBUG ERR:", error);
}
