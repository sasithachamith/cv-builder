import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/templates.css';
import './styles/landing.css';
import './styles/editor.css';
import './styles/coach.css';

createRoot(document.getElementById('root')).render(<App />);
