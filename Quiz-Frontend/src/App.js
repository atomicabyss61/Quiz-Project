import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Quizzes from './components/Quiz/Quiz';
import './App.css';
import QuizCreate from './components/Quiz/QuizCreate';
import QuizMake from './components/Quiz/QuizMake';
import QuizStart from './components/Quiz/QuizStart';
import QuizEnd from './components/Quiz/QuizEnd';
import QuizMain from './components/Quiz/QuizMain';
import QuizAssign from './components/Quiz/QuizAssign'

function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}

async function logoutUser(credentials) {
  return fetch('http://localhost:5000/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

function App() {
  const { token, setToken } = useToken();

  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (forname) => {
    setCurrentForm(forname);
  }

  if (!token) {
    return currentForm === 'login' ? <Login token={token} setToken={setToken} onFormSwitch={toggleForm} /> :
      <Register token={token} setToken={setToken} onFormSwitch={toggleForm} />;
  }

  const handleSubmit = async e => {
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    await logoutUser({
      token,
    });
    sessionStorage.removeItem('token');
    refreshPage();
  }

  return (
    <div className='wrapper'>

      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-light">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <a className="navbar-brand" href="/">Quiz App!</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item active">
                {/* <a className="nav-link" href="/quizzes">Quiz Page</a> */}
                <Link className="nav-link" to="/quizzes">Quiz Page</Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/">User</Link>
              </li>
            </ul>
          </div>
          <form className="form-inline">
            <button className="btn btn-danger" type="button" onClick={() => { handleSubmit(); toggleForm('login'); }}>Logout?</button>
          </form>
        </nav>

        <Routes>
          <Route exact path='/' element={<Home token={token} setToken={setToken} onFormSwitch={toggleForm} />} />
          <Route exact path='/quizzes' element={<Quizzes setToken={setToken} />} />
          <Route exact path='/quizCreate' element={<QuizCreate setToken={setToken} />} />
          <Route exact path='/quizMake' element={<QuizMake />} />
          <Route exact path='/quizStart' element={<QuizStart />} />
          <Route exact path='/quizEnd' element={<QuizEnd />} />
          <Route exact path='/quizMain' element={<QuizMain />} />
          <Route exact path='/quizAssign' element={<QuizAssign />} />
        </Routes>

      </BrowserRouter>
    </ div >
  );
}

function refreshPage() {
  window.location.reload();
}

export default App;
