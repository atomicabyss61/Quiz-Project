import React, { Component, useState, useEffect } from 'react';
import { Route, Link, useLocation, useNavigate } from 'react-router-dom';
import QuizEnd from './QuizEnd';
import '../css/QuizStart.css'
import Button from 'react-bootstrap/Button'

function quizEnd(credentials) {
  return fetch('http://localhost:5000/quizEnd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

export default function QuizStart(props) {
  const location = useLocation();
  const { quizId } = location.state
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(null);
  const [mcLength, setMcLength] = useState([]);
  const [extLength, setExtLength] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const [isOverview, setIsOverview] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Make server call and store return value in serverData state variable
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    fetch(`http://localhost:5000/quizInfo?token=${token}&quizId=${quizId}`)
      .then(response => response.json())
      .then(data => { setMcLength(data.mcLength); setQuestions(data.questions); setExtLength(data.extLength); });
  }, []);

  const addAnswer = (answer) => {
    setAnswers([...answers, { answer: '', correct: null }])
  }

  if (answers.length < mcLength) {
    for (let i = 0; i < mcLength; i++) {
      addAnswer(answers);
    }
  }

  const handleAnswerSelect = (answer) => {
    // Add the answer to the list of answers
    let newAnswer = answers.slice();
    newAnswer[currentQuestion] = answer;
    setAnswers(newAnswer);
  }

  // Function to handle when the user moves to the next question
  const handleNext = () => {
    // Update the current question
    if (currentQuestion === -1) {
      setCurrentQuestion(0);
      setIsOverview(false)
    } else if (currentQuestion === questions.length - 1) {
      setCurrentQuestion(-1);
      setIsOverview(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  // Function to handle when the user moves to the previous question
  const handlePrev = () => {
    // Update the current question
    if (currentQuestion === 0) {
      setCurrentQuestion(-1);
      setIsOverview(true);
    } else if (currentQuestion === -1) {
      setCurrentQuestion(questions.length - 1);
      setIsOverview(false)
    } else {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit form data to the server here
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    quizEnd({
      token,
      quizId,
      answers,
    });
    navigate('/quizzes');
  }

  const handleDropdown = () => {
    setShowMenu(!showMenu);
  }

  const answerQuestions = () => {
    let count = 0;
    for (const answer of answers) {
      if (answer.answer !== '') count++;
    }
    return count;
  }

  const handleDropDownSubmit = (index) => {
    setCurrentQuestion(index);
    setIsOverview(false);
  }

  if (!questions) {
    return (
      <div>
        Loading...
      </div>
    )
  }



  return (
    <div className='main'>

      {isOverview ?
        <div className='above-overview'>
          <div className='above-div'></div>
          <div class="card" id='overview-card'>
            <h5 class="card-header">Quiz Overview
              <Button classname='btn btn-secondary dropdown-toggle' type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => setShowMenu(!showMenu)}>
                Questions
              </Button>
              {showMenu && (
                <DropdownMenu
                  questions={questions}
                  length={questions.length}
                  handleSubmit={handleDropDownSubmit}
                />
              )}
            </h5>
            <div class="card-body" id='overview-card-body'>
              <p>You have attempted {answerQuestions()} out of {questions.length} questions</p>
              <p>Insert description/time/etc here</p>
            </div>
          </div>

        </div>
        :
        <div>
          <Question
            questions={questions[currentQuestion].question}
            options={questions[currentQuestion].answers}
            onAnswerSelect={handleAnswerSelect}
            length={questions.length}
            current={currentQuestion + 1}
            answers={answers}
          />
        </div>
      }
      <div class="btn-group" id='util-btns' role="group" aria-label="Basic example">
        <button type="button" class="btn btn-secondary" onClick={handlePrev}>Previous</button>
        <button type="button" class="btn btn-secondary" onClick={handleNext}>Next</button>
        <button type="button" class="btn btn-secondary" onClick={handleSubmit}>Submit</button>
      </div>
    </div >
  )
}
function Question({ questions, options, onAnswerSelect, length, current, answers }) {
  // return (
  //   <div className='question-card'>
  //     <h2>Question {current} out of {length}</h2>
  //     <h2 className='question-header'>{questions}</h2>
  //     {options.map(option => (
  //       <button className='answer-button' onClick={() => onAnswerSelect(option)}>{option.answer}</button>
  //     ))}

  //   </div>
  // );
  return (
    <div className='answer-container-middle'>
      <h2>Question {current} out of {length}</h2>
      <h2>{questions}</h2>
      {options.map((option, index) => (
        <>
          {
            option.answer === answers[current - 1].answer ?

              < button className='btn btn-primary active' id='start-answer-buttons' onClick={() => onAnswerSelect(option)}>{option.answer}</button>
              :
              < button className='btn btn-primary' id='start-answer-buttons' onClick={() => onAnswerSelect(option)}>{option.answer}</button>
          }
        </>
      ))}
    </div >
  )
}

// function DropdownMenu({ questions, length, handleSubmit }) {
//   return (
//     <div className='dropdown-container'>
//       <div onClick={handleMenu} className='dropdown-input'>
//         {showMenu && (
//           <div className='dropdown-menu'>
//             {questions.map((item, index) => (
//               <div
//                 onClick={() => handleDropdown}
//                 key={item.question}
//                 className={`dropdown-item ${isSelected(item) && "selected"}`}
//               >
//                 Q.{index}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

//   <div className="-dropdown">
//   <Button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//     Dropdown
//   </Button>
//   <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
//     <Button className="dropdown-item" type="button">Action</Button>
//     <Button className="dropdown-item" type="button">Another action</Button>
//     <Button className="dropdown-item" type="button">Something else here</Button>
//   </div>
// </div>

function DropdownMenu({ questions, length, handleSubmit }) {
  return (
    <div>
      <div className='dropdown-menu'>
        {questions.map((item, index) => (
          <Button
            className="dropdown-item" type="button"
            key={item.question}
            onClick={() => handleSubmit(index)}>
            Q.{index + 1}
          </Button>
        ))}
      </div>

    </div>

  )
}







