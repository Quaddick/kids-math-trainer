import { createApp } from './router.js';
import './style.css';

// Точка входа: монтируем приложение в #app.
const root = document.querySelector('#app');
root.innerHTML = '';
root.appendChild(createApp());
