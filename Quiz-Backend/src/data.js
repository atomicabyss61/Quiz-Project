let data = {
  users: [
    {
      userType: 'teacher',
      uId: -1,
      email: 'a@gmail.com',
      name: 'abhi thapa',
      password: 'password',
      token: [],
    },
    {
      userType: 'student',
      uId: -2,
      email: 'b@gmail.com',
      name: 'bman',
      password: 'password',
      token: [],
    },
    {
      userType: 'student',
      uId: -3,
      email: 'c@gmail.com',
      name: 'cman',
      password: 'password',
      token: [],
    }
  ],
  quizzes: [
    {
      quizId: 0,
      name: '4u final exam',
      uId: -1,
      members: [-2],
      mcLength: 3,
      mcs: [
        {
          question: 'Capital of Australia?',
          answers: [
            { answer: 'Sydney', correct: false },
            { answer: 'Melbourne', correct: false },
            { answer: 'Brisbane', correct: false },
            { answer: 'Canberra', correct: true }
          ]
        },
        {
          question: 'Fastest Sprinter?',
          answers: [
            { answer: 'Gatling', correct: false },
            { answer: 'Bolt', correct: true },
            { answer: 'Jeff', correct: false },
            { answer: 'Bob', correct: false }
          ]
        },
        {
          question: 'which is a fruit',
          answers: [
            { answer: 'Apple', correct: true },
            { answer: 'Brick', correct: false },
            { answer: 'Book', correct: false },
            { answer: 'Cow', correct: false }
          ]
        },
      ],
      extLength: 1,
      ext: [],
      userAttempts: [
        {
          uId: -1,
          attempts: [
            {
              answers: [
                { answer: 'Sydney', correct: false },
                { answer: 'Bolt', correct: true },
                { answer: 'Apple', correct: true },
              ],
              timeStamp: 0,
              score: 2 / 3,
            }
          ]
        }
      ],
      pracUserAttempts: [],
      pracMode: true,
      dueDate: 0,
      public: false,
    }
  ]
}

function getData() {
  return data;
}

function setData(newData) {
  data = newData;
}

function clearData() {
  data = { users: [] };
}

export { getData, setData };