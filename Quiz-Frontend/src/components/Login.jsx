import React, { useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import './css/Login.css'
import axios from 'axios'
import PropTypes from 'prop-types';

async function loginUser(credentials) {
  return fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

function Login({ token, setToken, ...props }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      email,
      pass
    });
    setToken(token);
  }

  return (
    <body className='body-main'>
      <div className='card' id='login-card'>
        <div class="card-header" id='login-card-header'>
          <h1>Login</h1>
        </div>
        <div class="card-body" id='login-card-body'>
          <form onSubmit={handleSubmit}>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" onChange={(e) => setPass(e.target.value)} />
            </div>
            <button type="submit" class="btn btn-primary btn-lg btn-block">Submit</button>
          </form>
          <div className='reg-btn'>
            <button className="btn btn-outline-primary" onClick={() => props.onFormSwitch('register')}>Register Now?</button>
            </div>
        </div>
      </div>
      {/* 
      <div className="login-wrapper">

        <h1>Please Log In</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div class="form-group">
            <label>Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" onChange={(e) => setPass(e.target.value)} />
          </div>
          <div>
            <button className='login-btn' type="submit">Submit</button>
          </div>
        </form>

        <button className="reg-button" onClick={() => props.onFormSwitch('register')}>Register Now?</button>

      </div > */}
    </ body>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}


export default Login;