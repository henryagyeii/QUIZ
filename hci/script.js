//get DOM elements by their IDs
const quizContainer = document.getElementById('quiz-container');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const startNextButton = document.getElementById('start-next-button');
const timerElement = document.getElementById('timer');
const endQuizButton = document.getElementById('end-quiz-button');

// create score element and append it to quizContainer
const scoreElement = document.createElement('p');
const homeButton = document.getElementById('home-button');
scoreElement.setAttribute('id', 'score');
scoreElement.classList.add('hide');
quizContainer.appendChild(scoreElement);

//initialize variables
let shuffledQuestions, currentQuestionIndex, timer, score =0;

//reload page when home button is clicked
homeButton.addEventListener('click', ()=>{
  location.reload();
});

//add event listener to startNextButton that starts quiz or sets next question
endQuizButton.addEventListener('click', endQuiz);



startNextButton.addEventListener('click', () => {
  if (startNextButton.innerText === 'Start') {
    startQuiz();
  } else if (startNextButton.innerText === 'Next') {
    currentQuestionIndex++;
    setNextQuestion();
  } else if (startNextButton.innerText === 'Restart'){
    resetQuiz();
    
  }
});

//function to execute when endQuizButton is clicked

function endQuiz()
{
  stopTimer();
  const name = document.getElementById('name').value;
  const number = document.getElementById('number').value;
  const scoreDisplay = `${score}/${questions.length}`;

//create table row to display user's details and score
  const row = document.createElement('tr');
  const nameCell = document.createElement('td');
  const numberCell = document.createElement('td');
  const scoreCell = document.createElement('td');
  nameCell.textContent = name;
  numberCell.textContent = number;
  scoreCell.textContent = scoreDisplay;
  row.appendChild(nameCell);
  row.appendChild(numberCell);
  row.appendChild(scoreCell);
  const tbody = document.querySelector('#score-table tbody');
  tbody.appendChild(row);
  
  //display score and remarks
  scoreElement.textContent = `Score: ${scoreDisplay}`;
  scoreElement.classList.remove('hide');
  let remarks = ''; 
  if (score < questions.length * 0.5) {
    remarks = 'Try Harder Next Time!';
  } else if (score >= questions.length * 0.5 && score < questions.length * 0.7) {
    remarks = 'Good Enough!';
  } else {
    remarks = 'That Was Awesome!';
  } 
  alert(remarks);
  
  // change startNextButton text and show endQuizButton and startNextButton
  startNextButton.innerText = 'Restart';
  startNextButton.classList.remove('hide');
  endQuizButton.classList.remove('hide');

  //display name, number and score

  const nameDisplay = document.createElement('p');
  nameDisplay.textContent = `Name: ${name}`;
  nameDisplay.classList.add('display');
  quizContainer.appendChild(nameDisplay);

  const numberDisplay = document.createElement('p');
  numberDisplay.textContent = `Number: ${number}`;
  numberDisplay.classList.add('display')
  quizContainer.appendChild(numberDisplay);
  
  const scoreDisplayElement = document.createElement('p');
  scoreDisplayElement.textContent = `Score: ${scoreDisplay}`;
  scoreDisplayElement.classList.add('display' , 'score')
  quizContainer.appendChild(scoreDisplayElement);

  createPieChart();

}
// function to create pie chart
function createPieChart() {
  const correctAnswers = score;
  const incorrectAnswers = questions.length - score;
  const data = [
    { label: 'Correct Answers', count: correctAnswers },
    { label: 'Incorrect Answers', count: incorrectAnswers },
  ];

  const width = 360;
  const height = 360;
  const radius = Math.min(width, height) / 2;

  const svg = d3
    .select('#pie-chart')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal().range(['green', 'red']);

  const pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.count;
    });

  const path = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  const legendSpacing = 20;
  const legendRectSize = 18;
  const legendHeight = legendRectSize + legendSpacing;

  const legend = svg
    .selectAll('.legend')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      const height = legendHeight * data.length;
      const offset = height / 2;
      const x = radius + 20;
      const y = i * legendHeight - offset;
      return `translate(${x}, ${y})`;
    });

  legend
    .append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function (d) {
      return color(d.label);
    });

  legend
    .append('text')
    .attr('x', legendRectSize + 5)
    .attr('y', legendRectSize - 5)
    .style('font-size', '12px')
    .text(function (d) {
      return d.label;
    });

  const arc = svg
    .selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc');

  arc
    .append('path')
    .attr('d', path)
    .attr('fill', function (d) {
      return color(d.data.label);
    });

  arc
    .append('text')
    .attr('transform', function (d) {
      return 'translate(' + path.centroid(d) + ')';
    })
    .attr('dy', '0.35em')
    .style('font-size', '14px')
    .text(function (d) {
      return d.data.count;
    });
}



function startTimer() {
  let time = 0;
  timerElement.innerText = '0:00';

  timer = setInterval(() => {
    time++;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerElement.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}


function startQuiz() {
  startNextButton.innerText = 'Next';
  startNextButton.classList.remove('hide'); 
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainer.classList.remove('hide');
  setNextQuestion();
  startTimer();
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledQuestions.length){
    showQuestion(shuffledQuestions[currentQuestionIndex]);
  } else {
    stopTimer();    
  }
}
  
  function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
      const button = document.createElement('button');
      button.innerText = answer.text;
      button.classList.add('answer-button');
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener('click', selectAnswer);
      answerButtonsElement.appendChild(button);
    });
  }

  function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resetState();
    clearInterval(timer);
    timerElement.innerHTML = '0:00';
    startQuiz();
    scoreElement.textContent = "";
    scoreElement.classList.add('hide');
  
}

  
  function resetState() {
    clearStatusClass(document.body);
    while (answerButtonsElement.firstChild) {
      answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
  }
  
  function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
      setStatusClass(button, button.dataset.correct);
    });
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
      startNextButton.innerText = 'Next';
    } else {
      startNextButton.innerText = 'Restart';
    }
    if (shuffledQuestions.length === currentQuestionIndex +1){
      stopTimer();
    }
    if (correct){
      score++;
    }
  }
  
  function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
      element.classList.add('correct');
    } else {
      element.classList.add('wrong');
    }
  }
  
  function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
  }
  
  // questions for the quiz. 
  const questions = [
        {
          question: 'What is the capital city of Australia?',
          answers: [
            { text: 'Sydney', correct: false },
            { text: 'Melbourne', correct: false },
            { text: 'Canberra', correct: true }
          ]
        },
        {
          question: 'What is the currency of Japan?',
          answers: [
            { text: 'Dollar', correct: false },
            { text: 'Euro', correct: false },
            { text: 'Yen', correct: true }
          ]
        },
        {
          question: 'Who is the author of "The Great Gatsby"?',
          answers: [
            { text: 'Ernest Hemingway', correct: false },
            { text: 'F. Scott Fitzgerald', correct: true },
            { text: 'J.D. Salinger', correct: false }
          ]
        },
        {
          question: 'What is the tallest mammal in the world?',
          answers: [
            { text: 'Elephant', correct: false },
            { text: 'Giraffe', correct: true },
            { text: 'Hippo', correct: false }
          ]
        },
        {
          question: 'Who painted the famous artwork "The Mona Lisa"?',
          answers: [
            { text: 'Leonardo da Vinci', correct: true },
            { text: 'Vincent van Gogh', correct: false },
            { text: 'Pablo Picasso', correct: false }
          ]
        },
        {
          question: 'What is the largest bird in the world?',
          answers: [
            { text: 'Penguin', correct: false },
            { text: 'Ostrich', correct: true },
            { text: 'Eagle', correct: false }
          ]
        },
        {
          question: 'What is the smallest country in the world by land area?',
          answers: [
            { text: 'Monaco', correct: false },
            { text: 'San Marino', correct: false },
            { text: 'Vatican City', correct: true }
          ]
        },
        {
          question: 'What is the name of the second largest ocean in the world?',
          answers: [
            { text: 'Atlantic Ocean', correct: false },
            { text: 'Indian Ocean', correct: false },
            { text: 'Southern Ocean', correct: false },
            { text: 'Pacific Ocean', correct: true }
          ]
        },
        {
          question: 'What is the name of the largest planet in our solar system?',
          answers: [
            { text: 'Mars', correct: false },
            { text: 'Jupiter', correct: true },
            { text: 'Saturn', correct: false }
          ]
        },
        {
          question: 'What is the name of the highest mountain in Africa?',
          answers: [
            { text: 'Mount Everest', correct: false },
            { text: 'Mount Kilimanjaro', correct: true },
            { text: 'Mount Fuji', correct: false }
          ]
        }
      ];
      