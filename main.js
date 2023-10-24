'use strict';

// 1.Postavljanje igre
// *Grid
let numberOfRows = 16;
let numberOfColumns = 16;
let speedInMs = 160;

const screenWidth = window.innerWidth;

if (screenWidth < 500) {
  speedInMs = 200;
  numberOfRows = 12;
  numberOfColumns = 12;
  console.log('Bok');
}

const gridEl = document.querySelector('.grid');
gridEl.style.gridTemplateRows = `repeat(${numberOfRows}, 1fr)`;
gridEl.style.gridTemplateColumns = `repeat(${numberOfColumns}, 1fr)`;

let snakeRefreshed = true;
let highScoreCookieKeyword = 'highScore';
let zadnjaTipkaPritisnuta = 'right';
let playing = false;

let fruitImages = {
  1: 'ananas.svg',
  2: 'banana.svg',
  3: 'lubenica.svg',
  4: 'malina.svg',
  5: 'jagoda.svg',
};

// *Inicijalizacija hrane
const foodEl = document.createElement('div');
foodEl.classList.add('food');
gridEl.appendChild(foodEl);
foodEl.style.visibility = 'hidden';

// *Inicijalizacija zmijice
let snake;
const createInitialSnake = () => {
  snake = [
    createSnakeBody(numberOfRows / 2, numberOfColumns / 2),
    createSnakeBody(numberOfRows / 2, numberOfColumns / 2 - 1),
    createSnakeBody(numberOfRows / 2, numberOfColumns / 2 - 2),
  ];
};
createInitialSnake();

function createSnakeBody(r, c) {
  const snakeBody = document.createElement('div');
  snakeBody.classList.add('snake');
  gridEl.appendChild(snakeBody);
  snakeBody.style.gridRow = r;
  snakeBody.style.gridColumn = c;
  return snakeBody;
}

let headSnake = snake[0];
headSnake.classList.add('head-snake');

// Score & Highscore
let score = 0;
let highscore = 0;
if (localStorage.getItem(highScoreCookieKeyword)) {
  highscore = Number(localStorage.getItem(highScoreCookieKeyword));
}
document.querySelector('.highscore').textContent = highscore;

// 2. F: generiranje random hrane po gridu
const foodPosition = function () {
  const positionX = Math.floor(Math.random() * numberOfRows) + 1;
  const positionY = Math.floor(Math.random() * numberOfColumns) + 1;
  const randomNumberFruit = Math.floor(Math.random() * 5) + 1;
  foodEl.style.gridRow = positionX;
  foodEl.style.gridColumn = positionY;
  foodEl.style.background = `url(./icons/${fruitImages[randomNumberFruit]})`;
};

// F: button mobitel
const buttonDirection = (direction) => {
  console.log(direction);
  if (snakeRefreshed) {
    switch (true) {
      case direction === 'up':
        // Pomakni zmiju prema gore
        if (zadnjaTipkaPritisnuta !== 'down') {
          snakeRefreshed = false;
          zadnjaTipkaPritisnuta = 'up';
        }
        break;
      case direction === 'down': // Pomakni zmiju prema dolje
        if (zadnjaTipkaPritisnuta !== 'up') {
          snakeRefreshed = false;
          zadnjaTipkaPritisnuta = 'down';
        }
        break;
      case direction === 'left': // Pomakni zmiju lijevo
        if (zadnjaTipkaPritisnuta !== 'right') {
          snakeRefreshed = false;
          zadnjaTipkaPritisnuta = 'left';
        }
        break;
      case direction === 'right': // Pomakni zmiju desno
        if (zadnjaTipkaPritisnuta !== 'left') {
          snakeRefreshed = false;
          zadnjaTipkaPritisnuta = 'right';
        }
        break;

      default: // Ne reagiraj na druge tipke
        break;
    }
  }
};

// F: checkiranje tipke korisnika
function tipkaKorisnika(event) {
  console.log(
    'Pritisnuta tipka:',
    event.key,
    'Zadnja pritisnuta tipka:',
    zadnjaTipkaPritisnuta
  );

  event.preventDefault(); // Spriječi uobičajeno ponašanje tipke
  if (snakeRefreshed) {
    switch (true) {
      case event.key === 'ArrowUp' || event.key === 'w':
        // Pomakni zmiju prema gore
        if (zadnjaTipkaPritisnuta !== 'down') {
          snakeRefreshed = false;
          zadnjaTipkaPritisnuta = 'up';
        }
        break;
      case event.key === 'ArrowDown' || event.key === 's':
        // Pomakni zmiju prema dolje
        if (zadnjaTipkaPritisnuta !== 'up') {
          snakeRefreshed = false;
          zadnjaTipkaPritisnuta = 'down';
        }
        break;
      case event.key === 'ArrowLeft' || event.key === 'a':
        // Pomakni zmiju lijevo
        if (zadnjaTipkaPritisnuta !== 'right') {
          snakeRefreshed = false;
          zadnjaTipkaPritisnuta = 'left';
        }
        break;
      case event.key === 'ArrowRight' || event.key === 'd':
        // Pomakni zmiju desno
        if (zadnjaTipkaPritisnuta !== 'left') {
          snakeRefreshed = false;
          zadnjaTipkaPritisnuta = 'right';
        }
        break;
      case event.key === 'Enter' || event.code === 'Space':
        init(); // Pokreni game ponovno
        break;
      default: // Ne reagiraj na druge tipke
        break;
    }
  }
}

// F: pomak zmije
function moveSnake() {
  snakeRefreshed = true;
  const glavaTrenutniRed = parseInt(headSnake.style.gridRow);
  const glavaTrenutnaKolona = parseInt(headSnake.style.gridColumn);

  let glavaNoviRed, glavaNovaKolona;

  let bodyNoviRed = glavaTrenutniRed;
  let bodyNovaKolona = glavaTrenutnaKolona;

  switch (zadnjaTipkaPritisnuta) {
    case 'up':
      glavaNoviRed = glavaTrenutniRed - 1;
      glavaNovaKolona = glavaTrenutnaKolona;
      snake[0].style.gridRow = glavaNoviRed;
      snake[0].style.gridColumn = glavaNovaKolona;

      for (let i = 1; i < snake.length; i++) {
        const bodySegment = snake[i];

        let bodyTrenutniRed = parseInt(bodySegment.style.gridRow);
        let bodyTrenutnaKolona = parseInt(bodySegment.style.gridColumn);

        bodySegment.style.gridRow = bodyNoviRed;
        bodySegment.style.gridColumn = bodyNovaKolona;

        bodyNoviRed = bodyTrenutniRed;
        bodyNovaKolona = bodyTrenutnaKolona;
      }

      break;
    case 'down':
      glavaNoviRed = glavaTrenutniRed + 1;
      glavaNovaKolona = glavaTrenutnaKolona;
      snake[0].style.gridRow = glavaNoviRed;
      snake[0].style.gridColumn = glavaNovaKolona;

      for (let i = 1; i < snake.length; i++) {
        const bodySegment = snake[i];

        let bodyTrenutniRed = parseInt(bodySegment.style.gridRow);
        let bodyTrenutnaKolona = parseInt(bodySegment.style.gridColumn);

        bodySegment.style.gridRow = bodyNoviRed;
        bodySegment.style.gridColumn = bodyNovaKolona;

        bodyNoviRed = bodyTrenutniRed;
        bodyNovaKolona = bodyTrenutnaKolona;
      }
      break;
    case 'right':
      glavaNoviRed = glavaTrenutniRed;
      glavaNovaKolona = glavaTrenutnaKolona + 1;
      snake[0].style.gridRow = glavaNoviRed;
      snake[0].style.gridColumn = glavaNovaKolona;
      for (let i = 1; i < snake.length; i++) {
        const bodySegment = snake[i];

        let bodyTrenutniRed = parseInt(bodySegment.style.gridRow);
        let bodyTrenutnaKolona = parseInt(bodySegment.style.gridColumn);

        bodySegment.style.gridRow = bodyNoviRed;
        bodySegment.style.gridColumn = bodyNovaKolona;

        bodyNoviRed = bodyTrenutniRed;
        bodyNovaKolona = bodyTrenutnaKolona;
      }
      break;
    case 'left':
      glavaNoviRed = glavaTrenutniRed;
      glavaNovaKolona = glavaTrenutnaKolona - 1;
      snake[0].style.gridRow = glavaNoviRed;
      snake[0].style.gridColumn = glavaNovaKolona;
      for (let i = 1; i < snake.length; i++) {
        const bodySegment = snake[i];

        let bodyTrenutniRed = parseInt(bodySegment.style.gridRow);
        let bodyTrenutnaKolona = parseInt(bodySegment.style.gridColumn);

        bodySegment.style.gridRow = bodyNoviRed;
        bodySegment.style.gridColumn = bodyNovaKolona;

        bodyNoviRed = bodyTrenutniRed;
        bodyNovaKolona = bodyTrenutnaKolona;
      }
      break;
    default:
      return; //ne reagiraj na druge smjerove
  }
  //***Sudari
  // Sudar: hrana
  checkFood(glavaNoviRed, glavaNovaKolona);

  // Sudar: zid
  if (
    glavaNoviRed > numberOfRows ||
    glavaNovaKolona > numberOfColumns ||
    glavaNoviRed < 1 ||
    glavaNovaKolona < 1
  ) {
    gameOver();
  }

  // Sudar: tijelo
  for (let i = 1; i < snake.length; i++) {
    if (
      glavaNoviRed === parseInt(snake[i].style.gridRow) &&
      glavaNovaKolona === parseInt(snake[i].style.gridColumn)
    ) {
      gameOver();
    }
  }
}

// F: checkiranje hrane
function checkFood(glavaNoviRed, glavaNovaKolona) {
  if (
    glavaNoviRed === parseInt(foodEl.style.gridRow) &&
    glavaNovaKolona === parseInt(foodEl.style.gridColumn)
  ) {
    // Kreiraj novi dio tijela
    const newBodySegment = createSnakeBody();
    snake.push(newBodySegment);
    // Score dodaj
    score++;
    // Ponovo postavi hranu
    foodPosition();
  }
}
// F: Game over
function gameOver() {
  playing = false;
  alert(`
  Game over!
  Your score: ${score}`);
  clearInterval(interval);
  while (gridEl.hasChildNodes()) {
    gridEl.removeChild(gridEl.firstChild);
  }
  snake = [];
  zadnjaTipkaPritisnuta = 'right';
}

// Score & Highscore
const getHighscore = function () {
  if (score > highscore) {
    highscore = score;
    localStorage.setItem(highScoreCookieKeyword, highscore);
    document.querySelector('.highscore').textContent = highscore;
  }
};

const getScore = function () {
  let scoreEl = document.querySelector('.score');
  scoreEl.innerHTML = score;
};

// 3. Pokreni igru
let interval;
function init() {
  if (!playing) {
    playing = true;
    score = 0;
    if (snake.length === 0) {
      createInitialSnake();
      headSnake = snake[0];
      headSnake.classList.add('head-snake');
      gridEl.appendChild(foodEl);
    }

    foodPosition();
    document.addEventListener('keydown', tipkaKorisnika);
    foodEl.style.visibility = 'visible';

    interval = setInterval(() => {
      moveSnake();
      getHighscore();
      getScore();
    }, speedInMs);
  }
}

// Buttons
document.querySelector('.btn-start').addEventListener('click', init);
document.querySelector('.btn-stop').addEventListener('click', gameOver);
