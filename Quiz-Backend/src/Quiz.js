import { getData, setData } from './data.js';
import HTTPError from 'http-errors';

function quizCreate(token, mcs, ext, name) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let length = data.quizzes.length

  let quiz = {
    quizId: length,
    name: name,
    uId: user.uId,
    mcLength: mcs,
    mcs: [],
    extLength: ext,
    ext: [],
    userAttempts: [],
    pracUserAttempts: [],
    pracMode: true,
    dueDate: 0,
    public: false,
  }

  data.quizzes.push(quiz);

  setData(data);

  return { quizId: length };

}

function quizList(token) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let list = [];
  for (const quiz of data.quizzes) {

    if (quiz.public && quiz.members.find(u => u === user.uId) !== undefined) {
      list.push({
        quizId: quiz.quizId,
        name: quiz.name,
        mcLength: quiz.mcLength,
        extLength: quiz.extLength,
      });
    } else if (quiz.uId === user.uId) {
      list.push({
        quizId: quiz.quizId,
        name: quiz.name,
        mcLength: quiz.mcLength,
        extLength: quiz.extLength,
      });
    }

  }

  return { quizzes: list };
}

function quizInfo(token, quizId) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let quiz;
  for (const q of data.quizzes) if (q.quizId === quizId) quiz = q;
  if (quiz === undefined) throw HTTPError(400, 'quiz doesnt exist');

  let assignee = data.users.find(user => user.uId === quiz.uId).name;

  let attempted = quiz.userAttempts.find(u => u.uId === user.uId) === undefined ? false : true;

  return {
    name: quiz.name,
    assignee: assignee,
    mcLength: quiz.mcLength,
    questions: quiz.mcs,
    extLength: quiz.extLength,
    attempted: attempted,
    isOwner: quiz.uId === user.uId ? true : false,
  }
}

function quizRecieve(token, quizId, questions) {
  let data = getData();
  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let quiz;
  for (const q of data.quizzes) if (q.quizId === quizId) quiz = q;
  if (quiz === undefined) throw HTTPError(400, 'quiz doesnt exist!');

  for (const q of questions) {
    if (q.question === '') throw HTTPError(400, 'empty question!');

    let isCorrect = false;
    for (const ans of q.answers) {
      if (ans.answer === '') throw HTTPError(400, 'empty answer!');

      if (isCorrect && ans.correct) throw HTTPError(400, 'Only 1 correct answer allowed!');
      if (ans.correct) isCorrect = true;
    }
    if (!isCorrect) throw HTTPError(400, 'Must be 1 correct answer!');
  }

  quiz.mcs = questions;
  setData(data);

  return questions;
}

function quizStart(token, quizId) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let quiz;
  for (const q of data.quizzes) if (q.quizId === quizId) quiz = q;
  if (quiz === undefined) throw HTTPError(400, 'quiz doesnt exist');

  return {
    mcLength: quiz.mcLength,
    mcs: quiz.mcs,
    extLength: quiz.extLength,
  }
}

function quizEnd(token, quizId, answers) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let quiz;
  for (const q of data.quizzes) if (q.quizId === quizId) quiz = q;
  if (quiz === undefined) throw HTTPError(400, 'quiz doesnt exist');

  let userAttempt;
  userAttempt = quiz.userAttempts.find(attempt => attempt.uId === user.uId);

  let correct = answers.filter(q => q.correct);
  let score = correct.length / answers.length;

  if (userAttempt === undefined) {
    userAttempt = {
      uId: user.uId,
      attempts: [
        {
          answers: answers,
          timeStamp: 0,
          score: score,
        }
      ],
    }
    quiz.userAttempts.push(userAttempt);
  } else {
    userAttempt.attempts.push({
      answers: answers,
      timeStamp: 0,
      score: score,
    })
  }

  setData(data);

  return {};
}

function quizAttempt(token, quizId) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let quiz;
  for (const q of data.quizzes) if (q.quizId === quizId) quiz = q;
  if (quiz === undefined) throw HTTPError(400, 'quiz doesnt exist');

  let attempt = quiz.userAttempts.find(u => u.uId === user.uId);

  if (attempt === undefined) throw HTTPError(400, 'user has not attempted the quiz');

  let lattestAnswers = attempt.attempts.reduce(function (prev, curr) {
    return prev.Cost < curr.Cost ? prev : curr;
  });

  return {
    answers: quiz.mcs,
    userAnswers: lattestAnswers.answers,
  }
}

function quizAssign(token, quizId) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let quiz;
  for (const q of data.quizzes) if (q.quizId === quizId) quiz = q;
  if (quiz === undefined) throw HTTPError(400, 'quiz doesnt exist');

  let users = [], members = [], Add = [];
  for (const user of data.users) {
    users.push(user);
    if (quiz.members.find(u => u === user.uId) !== undefined) {
      members.push(user);
      Add.push({ uId: user.uId, name: user.name, addStatus: true })
    } else {
      Add.push({ uId: user.uId, name: user.name, addStatus: false })
    }
  }

  return {
    members: members,
    users: users,
    userAdd: Add,
  }
}

function quizAddAssign(token, quizId, userAdd) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let quiz;
  for (const q of data.quizzes) if (q.quizId === quizId) quiz = q;
  if (quiz === undefined) throw HTTPError(400, 'quiz doesnt exist');

  console.log(userAdd)

  for (const user of userAdd) {
    if (user.addStatus && quiz.members.find(u => u === user.uId) === undefined) {
      quiz.members.push(user.uId);
    } else if (!user.addStatus && quiz.members.find(u => u === user.uId) !== undefined) {
      quiz.members = quiz.members.filter(u => u !== user.uId);
    }
  }

  setData(data);

  return {}
}

function quizPublic(token, quizId) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let quiz;
  for (const q of data.quizzes) if (q.quizId === quizId) quiz = q;
  if (quiz === undefined) throw HTTPError(400, 'quiz doesnt exist');

  quiz.public = !quiz.public
  setData(data);

  return {}
}

function quizDelete(token, quizId) {
  let data = getData();

  let user;
  for (let u of data.users) {
    if (u.token.includes(token)) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  let quiz;
  for (const q of data.quizzes) if (q.quizId === quizId) quiz = q;
  if (quiz === undefined) throw HTTPError(400, 'quiz doesnt exist');

  if (quiz.uId !== user.uId) throw HTTPError(400, 'You dont have permission to delete quiz');

  data.quizzes = data.quizzes.filter(q => q.quizId !== quizId);

  setData(data);

  return {};
}

export { quizCreate, quizList, quizInfo, quizRecieve, quizStart, quizEnd, quizAttempt, quizAssign, quizAddAssign, quizPublic, quizDelete };