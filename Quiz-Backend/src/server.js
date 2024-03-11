import express from 'express';
const app = express();
import cors from 'cors';

import { loginRegister, login, logout, listToken } from './Auth.js';
import { getData } from './data.js';
import { quizCreate, quizList, quizInfo, quizRecieve, quizEnd, quizAttempt, quizAssign, quizAddAssign, quizPublic, quizDelete } from './Quiz.js';

app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(express.json())

app.get("/data", (req, res) => {
  // res.json({ "users": JSON.stringify(getData().users) })
  res.json({ users: getData().users })
})


app.post("/register", (req, res) => {
  const { userType, email, firstName, lastName, pass } = req.body;
  res.json(loginRegister(userType, email, firstName, lastName, pass));
})

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  res.json(login(email, password));
})

app.post("/logout", (req, res) => {
  const { token } = req.body;
  res.json(logout(token));
})

app.get("/list", (req, res) => {
  res.json(listToken());
})

app.post("/quizCreate", (req, res) => {
  const { token, mcs, ext, name } = req.body;
  res.json(quizCreate(token, mcs, ext, name));
})

app.get("/quizList", (req, res) => {
  const token = req.query.token;
  res.json(quizList(token));
})

app.get("/quizInfo", (req, res) => {
  const token = req.query.token;
  const quizId = req.query.quizId;

  res.json(quizInfo(token, parseInt(quizId)));
})

app.post("/quizRecieve", (req, res) => {
  const { token, quizId, questions } = req.body;
  res.json(quizRecieve(token, quizId, questions));
})

app.post("/quizEnd", (req, res) => {
  const { token, quizId, answers } = req.body;
  res.json(quizEnd(token, quizId, answers))
})

app.get("/quizAttempt", (req, res) => {
  const token = req.query.token;
  const quizId = req.query.quizId;
  res.json(quizAttempt(token, parseInt(quizId)));
})

app.get("/quizAssign", (req, res) => {
  const token = req.query.token;
  const quizId = req.query.quizId;
  res.json(quizAssign(token, parseInt(quizId)));
})

app.post("/quizAddAssign", (req, res) => {
  const { token, quizId, userAdd } = req.body;
  res.json(quizAddAssign(token, quizId, userAdd));
})

app.post("/quizPublic", (req, res) => {
  const { token, quizId } = req.body;
  res.json(quizPublic(token, quizId));
})

app.post("/quizDelete", (req, res) => {
  const { token, quizId } = req.body;
  res.json(quizDelete(token, quizId));
})

app.get("/", (req, res) => {
  res.json({ "key": 'success' })
})

app.listen(5000, () => { console.log("Server started on port 5000") })