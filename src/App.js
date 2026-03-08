import './App.css';

import Login from './components/Login';

import Main from './components/Main';
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from './context/AuthProvider';

function App() {
  const { auth } = useContext(AuthContext)
  return (
    <div className="App">
      { auth && auth.id ? <Main/> : <Login/> }
    </div>
  );
}

export default App;
