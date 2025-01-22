import React from 'react';

import { Provider } from 'react-redux';

import { AppRoutes } from './AppRoutes';
import { ToasterComponent } from './Components';

import store from './Store/store';

import './App.css';
import './Assets/Css/Common.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <AppRoutes />
        <ToasterComponent />
      </Provider>
    </div>
  );
}

export default App;
