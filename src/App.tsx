import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './design/fonts';
import './design/themes.css';
import './design/tokens.css';
import { AppRoutes } from './shell/routes';

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
