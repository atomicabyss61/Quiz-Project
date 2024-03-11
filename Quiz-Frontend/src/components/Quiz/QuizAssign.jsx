import React, { Component, useState, useEffect } from 'react';
import { Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import '../css/QuizAssign.css'

async function quizAddAssign(credentials) {
  return fetch('http://localhost:5000/quizAddAssign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

export default function QuizAssign(props) {
  const location = useLocation();
  const { quizId } = location.state
  const navigate = useNavigate();

  const [members, setMembers] = useState(null);
  const [users, setUsers] = useState(null);
  const [userAdd, setUserAdd] = useState(null);

  useEffect(() => {
    // Make server call and store return value in serverData state variable
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    fetch(`http://localhost:5000/quizAssign?token=${token}&quizId=${quizId}`)
      .then(response => response.json())
      .then(data => {
        setMembers(data.members);
        setUsers(data.users);
        setUserAdd(data.userAdd);
      });
  }, []);



  const handleChange = (index) => {
    const list = [...userAdd];
    list[index].addStatus = !list[index].addStatus;
    setUserAdd(list);
  }

  const submitAssign = (e) => {
    e.preventDefault();
    // Submit form data to the server here
    const token = sessionStorage.getItem('token').replace(/[^0-9]/gi, '');
    quizAddAssign({
      token,
      quizId,
      userAdd,
    });

    navigate('/quizzes');
  }

  if (!users || !userAdd) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className='assign-container'>
      <div className='assign-above'></div>
      <div class="card" id='assign-card'>
        <h5 class="card-header">Assign</h5>
        <div class="card-body">
          <h5 class="card-title">Members</h5>
          {members.map((member, index) => (
            <li key={member.uId}>{member.name}</li>
          ))}
        </div>

        <div class="card-body">
          <h5 class="card-title">All Users</h5>
          <form onSubmit={(e) => submitAssign(e)}>
            {users.map((user, index) => (
              <li key={user.name}>
                <input
                  type="checkbox"
                  name="name"
                  checked={userAdd[index].addStatus}
                  onChange={() => handleChange(index)}
                /> {userAdd[index].name}
              </li>

            ))}
            <button className='btn btn-primary' id='assign-btn'>Assign!</button>
          </form>
        </div>
      </div>

      <div className='assign-back-button-div'>
        <Link className="btn btn-primary" role='button' to="/quizMain" state={{ quizId: quizId }}>{'<'} back</Link>
      </div>
    </div>
  )
}

