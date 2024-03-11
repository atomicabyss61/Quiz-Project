import React, { Component, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import QuizCreate from './QuizCreate';
import '../css/Quiz.css'

const ListQuizzes = () => {
  const [serverData, setServerData] = useState([]);

  useEffect(() => {
    // Make server call and store return value in serverData state variable
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    fetch(`http://localhost:5000/quizList?token=${token}`)
      .then(response => response.json())
      .then(data => setServerData(data.quizzes));
  }, []);

  if (serverData.length === 0) {
    return (
      <div className='no-quiz'>
        You have no Quizzes!
      </div>
    )
  }

  return (
    <ul>
      {serverData.map(item => (
        // add link to quizzes edit page for teachers or start page for students
        <li key={item}>
          <Link to="/quizMain" state={{ quizId: item.quizId }}>{item.name} </Link>
          (mcs: {item.mcLength}, ext: {item.extLength})
        </li>
      ))
      }
    </ul >

  );
}

export default function Quizzes({ setToken, ...props }) {

  return (
    <div className='Quiz-container'>



      <h1>Quiz Main Page</h1>
      {/* <div className='Quiz-create'>
        <Link to="/quizCreate">
          <button>Create a quiz!!!</button>
        </Link>
      </div> */}

      <div className="card" id='quiz-list-card'>
        <h5 className="card-header" id>Quizzes:
          <div className='add-quiz-div'>
            <Link to='/quizCreate' className='btn btn-primary btn-sm' role='button'>Add Quiz</Link>
          </div>
        </h5>
        <div className="card-body">
          <ListQuizzes />
        </div>
      </div>

      {/* <div className='Quiz-list'>

        <h2>Quizzes: </h2>
        <ListQuizzes />
      </div> */}
    </div >
  );
}


