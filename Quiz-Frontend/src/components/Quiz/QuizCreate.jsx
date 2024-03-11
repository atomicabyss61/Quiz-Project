import React, { Component, history } from 'react';
import PropTypes from 'prop-types';
import { Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../css/QuizCreate.css'


async function quizCreate(credentials) {
  return fetch('http://localhost:5000/quizCreate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

export default function QuizCreate({ setToken, ...props }) {

  const navigate = useNavigate();
  const [mcs, setMcs] = useState('');
  const [ext, setExt] = useState('');
  const [name, setName] = useState('');

  ///////////////////////////////

  const handleSubmit = async (e, history) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    if (mcs === '' || ext === '' || name === '') {
      alert('please enter all fields!');
      return;
    }
    const quizId = await quizCreate({
      token,
      mcs,
      ext,
      name
    });

    navigate('/quizzes');
  }

  return (
    <div className='QuizCreate-container'>
      <h1>Create Quiz</h1>

      <div class="card" id='create-card'>
        <h5 class="card-header">Quiz Details</h5>
        <div class="card-body">
          <form onSubmit={(e) => handleSubmit(e, history)}>
            <div class="form-group">
              <label for="formGroupExampleInput">Choose A Name</label>
              <input type="text" class="form-control" id="formGroupExampleInput" placeholder="e.g. Periodic Table Quiz" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2">How many Multiple Choice Questions?</label>
              <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="choose a number" value={mcs} onChange={(e) => setMcs(e.target.value)} />
            </div>
            <div class="form-group">
              <label for="formGroupExampleInput2">How many Extended Response Questions?</label>
              <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="choose a number" value={ext} onChange={(e) => setExt(e.target.value)} />
            </div>
            <div className='create-button-container'>
              <button type="submit" className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
      <div className='back-button-div'>
        <button className='btn btn-primary' id='back-button' onClick={() => { navigate('/quizzes') }}>{'<'} back</button>
      </div>

    </div >
  );
}

QuizCreate.propTypes = {
  setToken: PropTypes.func.isRequired
}