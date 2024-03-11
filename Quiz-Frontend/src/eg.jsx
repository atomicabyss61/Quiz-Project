import React, { useState } from 'react';

// Quiz component that holds the state for the quiz
function Quiz() {
  // State for the current question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // List of questions
  const questions = [
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'Berlin', 'London', 'Rome'],
      answer: 'Paris'
    },
    {
      question: 'What is the tallest mountain in the world?',
      options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse'],
      answer: 'Mount Everest'
    },
    // Add more questions here...
  ];
  // State for the answers selected by the user
  const [answers, setAnswers] = useState([]);

  // Function to handle when the user selects an answer
  function handleAnswerSelect(answer) {
    // Add the answer to the list of answers
    setAnswers([...answers, answer]);
  }

  // Function to handle when the user moves to the next question
  function handleNext() {
    // Update the current question
    setCurrentQuestion(currentQuestion + 1);
  }

  // Function to handle when the user moves to the previous question
  function handlePrev() {
    // Update the current question
    setCurrentQuestion(currentQuestion - 1);
  }

  return (
    <div>
      {/* Render the current question */}
      <Question
        question={questions[currentQuestion].question}
        options={questions[currentQuestion].options}
        onAnswerSelect={handleAnswerSelect}
      />
      {/* Render the "Next" and "Previous" buttons */}
      <button onClick={handlePrev} disabled={currentQuestion === 0}>
        Previous
      </button>
      <button onClick={handleNext} disabled={currentQuestion === questions.length - 1}>
        Next
      </button>
    </div>
  );
}

// Question component that displays the question and options
function Question({ question, options, onAnswerSelect }) {
  return (
    <div>
      <h2>{question}</h2>
      {options.map(option => (
        <button onClick={() => onAnswerSelect(option)}>{option}</button>
      ))}
    </div>
  );
}

export default Quiz;