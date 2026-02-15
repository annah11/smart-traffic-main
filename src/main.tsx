import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  document.body.innerHTML = '<p style="padding:20px;color:red;">Root element not found.</p>';
}
