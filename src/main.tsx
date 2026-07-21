import { initializeAnalytics } from "./lib/analytics";
import { Analytics } from "@vercel/analytics/react";
import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';

initializeAnalytics();
createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Analytics />
  </>
);
