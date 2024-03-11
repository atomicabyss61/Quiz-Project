import React, { useState, useCallback } from 'react';
import './css/Register.css'
import axios from 'axios'
import PropTypes from 'prop-types';

async function registerUser(credentials) {
  return fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

function Register({ token, setToken, ...props }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pass, setPass] = useState('');
  const [userType, setuserType] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await registerUser({
      userType,
      email,
      firstName,
      lastName,
      pass,
    });
    setToken(token);
  }

  return (
    <div className='auth-form-container'>
      {/* <h2>Login</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlfor="userType">userType:</label>
        <input value={userType} onChange={(e) => setuserType(e.target.value)} type="userType" placeholder="student or teacher" id="userType" name="userType" />
        <p>{'\n'}</p>
        <label htmlfor="email">email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="example@email.com" id="email" name="email" />
        <p>{'\n'}</p>
        <label htmlfor="firstName">firstName:</label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="firstName" placeholder="firstName" id="firstName" name="firstName" />
        <p>{'\n'}</p>
        <label htmlfor="lastName">lastName:</label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="lastName" placeholder="lastName" id="lastName" name="lastName" />
        <p>{'\n'}</p>
        <label htmlfor="password">password:</label>
        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="password" id="password" name="password" />
        <p>{'\n'}</p>
        <button>Register</button>
      </form>

      <button className="link-btn" onClick={() => props.onFormSwitch('login')}>go to Login?</button> */}
      <div className='card' id='register-card'>
        <div class="card-header" id='register-card-header'>
          <h1>Register</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="firstName">First Name</label>
              <input type="name" class="form-control" id="firstName" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div class="form-group col-md-6">
              <label for="lastName">Last Name</label>
              <input type="name" class="form-control" id="lastName" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" id="email" placeholder="JohnDoe1@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>

          <div class="form-group">
            <label for="type">Type</label>
            <input type="name" class="form-control" id="type" placeholder="Teacher or Student" value={userType} onChange={(e) => setuserType(e.target.value)} />
          </div>
          <button type="submit" class="btn btn-primary btn-lg btn-block">Register</button>
        </form>
        <div className='reg-btn'>
          <button className="btn btn-outline-primary" onClick={() => props.onFormSwitch('login')}>Sign In?</button>
        </div>
      </div>
    </div>
  );

}

Register.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Register;