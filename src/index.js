import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';

import App from './App';
import './index.css';
import './fonts/fonts.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#fff',
        },
        components: {
          Pagination: {
            itemActiveBg: '#1890FF',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
