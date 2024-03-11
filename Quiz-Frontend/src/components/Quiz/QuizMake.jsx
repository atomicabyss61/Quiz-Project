import React, { Component, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../css/QuizMake.css'

async function quizRecieve(credentials) {
  return fetch('http://localhost:5000/quizRecieve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

async function quizLog(credentials) {
  return fetch('http://localhost:5000/quizLog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

export default function QuizMake(props) {
  const location = useLocation();
  const { quizId } = location.state

  const [mcLength, setMcLength] = useState([]);
  const [extLength, setExtLength] = useState([]);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(0);
  const [name, setName] = useState('');
  const [isLog, setIsLog] = useState(true);
  const [newName, setNewName] = useState('');

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        answers: [
          { answer: '', correct: false },
          { answer: '', correct: false },
          { answer: '', correct: false },
          { answer: '', correct: false }
        ]
      }
    ]);
  }

  const handleChange = (event, index, answerIndex) => {
    const { name, value, type, checked } = event.target;
    if (answerIndex === undefined) {
      // Update the question text
      const updatedQuestions = [...questions];
      updatedQuestions[index].question = value;
      setQuestions(updatedQuestions);
    } else {
      // Update an answer
      const updatedQuestions = [...questions];
      if (type === 'checkbox') {
        updatedQuestions[index].answers[answerIndex].correct = checked;
      } else {
        updatedQuestions[index].answers[answerIndex].answer = value;
      }
      setQuestions(updatedQuestions);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit form data to the server here
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    quizRecieve({
      token,
      quizId,
      questions,
    });

    navigate('/quizzes');
  }

  const handleLog = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    quizLog({
      token, quizId, newName, description
    })
  }

  useEffect(() => {
    // Make server call and store return value in serverData state variable
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    fetch(`http://localhost:5000/quizInfo?token=${token}&quizId=${quizId}`)
      .then(response => response.json())
      .then(data => { setMcLength(data.mcLength); setExtLength(data.extLength); setQuestions(data.questions); setName(data.name); setNewName(data.name); setDescription(data.description) });
  }, []);

  if (questions.length < mcLength) {
    for (let i = 0; i < mcLength; i++) handleAddQuestion();
  }

  return (

    <div className='QuizMake-container'>
      <h1>{name}</h1>

      <div class="card text-center" id='quiz-make-card-text'>
        <div class="card-header" id='quiz-make-card-header'>
          {isLog ?
            <nav class="nav nav-pills flex-column flex-sm-row">
              <a role='button' class="flex-sm text-sm-center nav-link active" aria-current="page">Logistics</a>
              <a role='button' class="flex-sm-outline text-sm-center nav-link" onClick={() => setIsLog(false)}>Questions</a>
            </nav>
            :
            <nav class="nav nav-pills flex-column flex-sm-row">
              <a role='button' class="flex-sm text-sm-center nav-link" onClick={() => setIsLog(true)}>Logistics</a>
              <a role='button' class="flex-sm-outline text-sm-center nav-link active" aria-current="page">Questions</a>
            </nav>
          }
        </div>
        <div class="card-body" id='quiz-make-card-body'>
          {/* <h5 class="card-title">Special title treatment</h5>
          <p class="card-text">With supporting text below as a natural lead-in to additional content.</p> */}

          {isLog ?
            <div className='logistics-form'>
              <form onSubmit={handleLog}>
                <div class="form-group">
                  <label for="exampleFormControlInput1">name</label>
                  <input type="name" class="form-control" id="exampleFormControlInput1" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div class="form-group">
                  <label for="exampleFormControlTextarea1">Description:</label>
                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <button className='btn btn-primary btn'>Submit</button>
              </form>
            </div>
            :
            <form>
              {/* <QuestionList /> */}
              {questions.map((question, index) => (
                <div className='question-card'>

                  {/* <div class="form-row">
                  <div class="col">

                    <label>yo<input type="text" class="form-control" placeholder="Last name" /></label>
                  </div>
                  <div class="col">

                    <label>yo<input type="text" class="form-control" placeholder="Last name" /></label>
                  </div>
                </div>
                <div class="form-row">
                  <div class="col">

                    <label>yo<input type="text" class="form-control" placeholder="Last name" /></label>
                  </div>
                  <div class="col">
                    <label>yo<input type="text" class="form-control" placeholder="Last name" /></label>

                  </div>

                </div> */}
                  <label>
                    Question {index + 1}:
                    <input
                      type='name' name="question"
                      value={question.question}
                      onChange={(event) => handleChange(event, index)}
                    />
                  </label>
                  <hr class="dashed" />
                </div>
              ))
              }

            </form>
          }
        </div>

      </div>
      <div className='make-back-button-div'>
        <Link className="btn btn-primary" role='button' to="/quizMain" state={{ quizId: quizId }}>{'<'} back</Link>
      </div>

      {/* <hr class="dashed"/> */}




      {/*
      <form onSubmit={handleSubmit}>

        <div className='Question-card'>
          {questions.map((question, index) => (
            <ul key={index}>
              {/* Render the question input field 
              <li>
                <label>
                  Question {index + 1}:
                  <input
                    type="text"
                    name="question"
                    value={question.question}
                    onChange={(event) => handleChange(event, index)}
                  />
                </label>
                <br />
                {/* Render the four answer input fields 
                {question.answers.map((answer, answerIndex) => (
                  <label key={answerIndex}>
                    <input
                      type="checkbox"
                      name="correct"
                      checked={answer.correct}
                      onChange={(event) => handleChange(event, index, answerIndex)}
                    /> -
                    Answer {answerIndex + 1}:
                    <input
                      type="text"
                      name="answer"
                      value={answer.answer}
                      onChange={(event) => handleChange(event, index, answerIndex)}
                    />
                  </label>
                ))}
                <br />

              </li>
            </ul>
          ))}

        </div>
        <div className='submit-container'>
          <button type="submit">Submit</button>
        </div>

      </form>
                */}
    </div>
  );
}

function QuestionList({ }) {
  return (
    <div>

    </div>
  )
}