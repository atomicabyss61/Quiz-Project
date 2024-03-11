import { getData, setData } from './data.js';
import HTTPError from 'http-errors';

function loginRegister(userType, email, firstname, lastName, pass) {
  let data = getData();

  if (userType !== 'student' && userType != 'teacher') {
    throw HTTPError(401, 'Incorrect type specificed');
  }

  let emailGet = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailGet !== undefined) throw HTTPError(401, 'email already in use!');

  if (pass.length < 6) {
    throw HTTPError(401, 'pass is too short');
  }

  const token = generateToken();

  let user = {
    userType: userType,
    uId: data.users.length,
    email: email,
    name: firstname + ' ' + lastName,
    password: pass,
    token: [token],
  }

  data.users.push(user);

  setData(data);

  return { token: token };

}

function login(email, pass) {
  let data = getData();

  let user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user === undefined) throw HTTPError(400, 'user does not have an account');

  if (user.pass !== pass) throw HTTPError(400, 'user does not have an account');

  const token = generateToken();
  user.token.push(token);

  setData(data);

  return { token: token };
}

function logout(token) {

  let data = getData();
  let user;
  for (let u of data.users) {
    if (u.token.find(t => t === token) !== undefined) user = u;
  }

  if (user === undefined) throw HTTPError(400, 'token is invalid');

  user.token = user.token.filter(t => { t !== token });

  setData(data);

  return {};
}

function listToken() {
  let data = getData();

  let d = [];
  for (const user of data.users) {
    for (const t of user.token) d.push(t);
  }

  return { tokens: d };
}

function generateToken() {
  return Math.random().toString().slice(2);
}

export { loginRegister, login, logout, listToken }; 