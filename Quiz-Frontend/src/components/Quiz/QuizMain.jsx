import React, { Component, useState, useEffect } from 'react';
import { Route, Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/QuizMain.css'

async function quizPublic(credentials) {
  return fetch('http://localhost:5000/quizPublic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

async function quizDelete(credentials) {
  return fetch('http://localhost:5000/quizDelete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

export default function QuizMain(props) {
  const location = useLocation();
  const { quizId } = location.state
  const navigate = useNavigate();

  const [mcLength, setMcLength] = useState(0);
  const [extLength, setExtLength] = useState(0);
  const [name, setName] = useState('');
  const [assignee, setAssignee] = useState('');
  const [attempted, setAttempted] = useState(false)
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Make server call and store return value in serverData state variable
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    fetch(`http://localhost:5000/quizInfo?token=${token}&quizId=${quizId}`)
      .then(response => response.json())
      .then(data => {
        setMcLength(data.mcLength);
        setExtLength(data.extLength);
        setAssignee(data.assignee);
        setName(data.name);
        setAttempted(data.attempted);
        setIsOwner(data.isOwner);
      });
  }, []);

  const changePublic = (e) => {
    e.preventDefault();
    // Submit form data to the server here
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    quizPublic({
      token,
      quizId,
    });
  }

  const handleDelete = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    quizDelete({ token, quizId });
    navigate('/quizzes');
    refreshPage();
  }

  if (name === '') {
    return (<div>
      Loading...
    </div>)
  }

  return (
    <div className='QuizMain-container'>
      <h1>{name}</h1>


      <div className="card" id='quiz-main-card'>
        <h5 className="card-header">{name}

          {isOwner &&
            <div className="btn-group" role="group" aria-label="Basic example">
              <Link className="btn btn-primary btn-sm" role='button' to="/quizMake" state={{ quizId: quizId }}>⚙</Link>
              <button role="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModal">Public</button>
            </div>}

          <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Toggle Public?</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Would you like to toggle the public viewing of this quiz?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={(e) => changePublic(e)} data-dismiss="modal">Confirm</button>
                </div>
              </div>
            </div>
          </div>

        </h5>
        <div className="card-body" id='quiz-main-card-body'>
          <h5 className="card-title">Assigned by: {assignee}</h5>
          <p>Status: {attempted ? 'attempted' : 'unattempted'}</p>
          <ul>
            <li>- {mcLength} multiple choice questions</li>
            <li>- {extLength} extended response questions</li>
          </ul>

          <div className="btn-group" role="group" aria-label="Basic example">
            <Link className="btn btn-secondary" role="button" to="/quizStart" state={{ quizId: quizId }}>Attempt</Link>
            <ReviewBtn quizId={quizId} attempted={attempted} />
            {isOwner &&
              <Link className="btn btn-secondary" role="button" to="/quizAssign" state={{ quizId: quizId }}>Assign</Link>
            }
          </div>
          {isOwner &&
            <button className="btn btn-danger" data-toggle="modal" data-target="#deleteToggle">Delete</button>
          }

          <div className="modal fade" id="deleteToggle" tabindex="-1" role="dialog" aria-labelledby="deleteToggleLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="deleteToggleLabel">Warning: This quiz can never be recovered</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Would you like to continue deleting?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete} data-dismiss="modal">Confirm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='main-back-button-div'>
        <button className='btn btn-primary' id='back-button' onClick={() => { navigate('/quizzes') }}>{'<'} back</button>
      </div>
    </div>
  )
}

function ReviewBtn({ quizId, attempted }) {
  if (!attempted) {
    return (
      <button className='btn btn-secondary'>Review</button>
    )
  } else {
    return (
      <Link className="btn btn-secondary" role="button" to="/quizEnd" state={{ quizId: quizId }}>Review</Link>
    )
  }
}

function refreshPage() {
  window.location.reload(false);
}




