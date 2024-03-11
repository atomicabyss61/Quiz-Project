import React, { Component, useState, useEffect } from 'react';
import { Route, Link, useLocation, useNavigate } from 'react-router-dom';
// import { useParams } from '@react-navigation/native';
import '../css/QuizEnd.css'

export default function QuizEnd(props) {
  const location = useLocation();
  const { quizId } = location.state
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(null);
  const [userAnswers, setUserAnswers] = useState(null);

  useEffect(() => {
    // Make server call and store return value in serverData state variable
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    fetch(`http://localhost:5000/quizAttempt?token=${token}&quizId=${quizId}`)
      .then(response => response.json())
      .then(data => { setAnswers(data.answers); setUserAnswers(data.userAnswers) });
  }, []);

  // Function to handle when the user moves to the next question
  const handleNext = () => {
    // Update the current question
    if (currentQuestion + 1 === answers.length) {
      return;
    }
    setCurrentQuestion(currentQuestion + 1);
  }

  // Function to handle when the user moves to the previous question
  const handlePrev = () => {
    // Update the current question
    if (currentQuestion === 0) {
      return;
    }
    setCurrentQuestion(currentQuestion - 1);
  }

  if (!answers) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className='main-end-conatiner'>
      <Question
        questions={answers}
        options={userAnswers}
        currentQuestion={currentQuestion}
      />

      <div class="btn-group" id='util-btns' role="group" aria-label="Basic example">
        <button type="button" class="btn btn-secondary" onClick={handlePrev}>Previous</button>
        <button type="button" class="btn btn-secondary" onClick={handleNext}>Next</button>
      </div>
      <div className='end-back-button-div'>
        <Link className="btn btn-primary" role='button' to="/quizMain" state={{ quizId: quizId }}>{'<'} back</Link>
      </div>
    </div>
  )
}

function Question({ questions, options, currentQuestion }) {

  if (!options) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div>
      <div className='review-above'></div>
      <div class="card" id='review-question-card'>
        <h5 class="card-header">{questions[currentQuestion].question}</h5>
        <div class="card-body" id='review-button-body'>
          {questions[currentQuestion].answers.map((question, index) => (
            <>
              {
                question.correct ?
                  <>
                    < button className='btn btn-success'>{question.answer}</button>
                  </>
                  :
                  <>
                    < button className='btn btn-danger'>{question.answer}</button>
                  </>
              }
            </>
          ))}
        </div>
      </div>

    </div>
  )
}