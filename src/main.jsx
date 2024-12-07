import React from 'react';
import { createRoot } from 'react-dom/client';
import MainRouter from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // 使用 createRoot 替代 ReactDOM.render

root.render(
    <React.StrictMode>
        <MainRouter />
    </React.StrictMode>
);
