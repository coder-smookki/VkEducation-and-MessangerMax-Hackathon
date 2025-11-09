import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // <-- поменяли
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-cover bg-center bg-no-repeat">
      <div className="mx-auto w-full max-w-[480px] bg-white min-h-screen text-white">
        <HashRouter> {/* <-- заменили BrowserRouter */}
          <App />
        </HashRouter>
      </div>
    </div>
  </React.StrictMode>
);
