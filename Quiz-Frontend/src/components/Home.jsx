import React, { Component, useState } from 'react';
import Login from './Login';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import './css/Home.css'

export default function Home({ setToken, ...props }) {


  return (
    <div className='home-container'>
      <h2>Home Page</h2>
      <ExampleComponent />
      Nothing Yet
    </div >
  );
}

const ExampleComponent = () => {
  const [serverData, setServerData] = useState([]);

  useEffect(() => {
    // Make server call and store return value in serverData state variable
    fetch('http://localhost:5000/list')
      .then(response => response.json())
      .then(data => setServerData(data.tokens));
  }, []);

  return (
    <ul>
      tokens In use:
      {serverData.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

