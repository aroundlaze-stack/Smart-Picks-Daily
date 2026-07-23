import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';


// Analytics are now consent-gated inside App.tsx via ConsentContext.
// Do NOT call initializeAnalytics() unconditionally here.

createRoot(document.getElementById('root')!).render(<App />);
