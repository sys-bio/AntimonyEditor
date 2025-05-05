import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './testing/reportWebVitals';
// index.ts

import { customLanguageWorker } from './language-handler/antlr/CustomLanguageWorker';

// Define the getWorker function
// Dummy web worker function for now, will build more upon when parser and syntax highlighting is created
const getWorker = (_moduleId: string, label: string): Worker => {
  return new Worker(
    URL.createObjectURL(
      new Blob([`self.onmessage = ${customLanguageWorker}`], {
        type: 'application/javascript',
      })
    )
  );
};

// Set the getWorker function in MonacoEnvironment
(window as any).MonacoEnvironment = {
  getWorker: getWorker,
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);