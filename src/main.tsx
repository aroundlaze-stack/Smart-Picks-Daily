import { initializeAnalytics } from "./lib/analytics";
import { initializeClarity } from "./lib/clarity";
import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';

initializeAnalytics();
initializeClarity();
createRoot(document.getElementById('root')!).render(<App />);
