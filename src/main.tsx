import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import { App } from './app/App';
import { DashboardProvider } from './app/DashboardContext';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </HashRouter>
  </StrictMode>,
);
