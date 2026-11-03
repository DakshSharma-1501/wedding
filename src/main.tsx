import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { wedding } from './data/config';
import './styles/fonts';
import './styles/index.css';

/** Favicon drawn from the configured monogram, so it follows config.ts automatically. */
function setMonogramFavicon() {
  const { bride, groom } = wedding.couple.monogram;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#FAF6EE" stroke="#C9A227" stroke-width="3"/><circle cx="32" cy="32" r="25" fill="none" stroke="#C9A227" stroke-width="1" stroke-dasharray="1 3"/><text x="32" y="40" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="22" fill="#0B3C5D">${bride}&amp;${groom}</text></svg>`;
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (link) link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function dismissBootLoader() {
  const boot = document.getElementById('boot');
  if (!boot) return;
  boot.style.opacity = '0';
  setTimeout(() => boot.remove(), 650);
}

const root = document.getElementById('root');
if (!root) throw new Error('#root missing from index.html');

setMonogramFavicon();
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
requestAnimationFrame(dismissBootLoader);
