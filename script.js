// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

// Game variables
let snake = [{ x: 200, y: 200 }];
let food = { x: 100, y: 100 };
let dx = 20;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;

// Update high score display
highScoreDisplay.textContent = highScore;

// Draw snake
function drawSnake() {
  snake.forEach(part => {
    ctx.fillStyle = "green";
    ctx.fillRect(part.x, part.y, 20, 20);
    ctx.strokeStyle = "darkgreen";
    ctx.strokeRect(part.x, part.y, 20, 20);
  });
}

// Draw food
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);
}

// Move snake
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = highScore;
    }
    generateFood();
  } else {
    snake.pop();
  }
}

// Generate food at random position
function generateFood() {
  food.x = Math.floor(Math.random() * 20) * 20;
  food.y = Math.floor(Math.random() * 20) * 20;
}

// Check for collisions
function checkCollision() {
  const head = snake[0];

  // Check walls
  if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
    return true;
  }

  // Check self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Game loop
function gameLoop() {
  if (checkCollision()) {
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    restartBtn.style.display = "inline-block";
    startBtn.style.display = "none";
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  moveSnake();
  drawSnake();
}

// Start game
function startGame() {
  score = 0;
  scoreDisplay.textContent = score;
  snake = [{ x: 200, y: 200 }];
  dx = 20;
  dy = 0;
  generateFood();
  gameInterval = setInterval(gameLoop, 100);
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
}

// Restart game
function restartGame() {
  clearInterval(gameInterval);
  startGame();
}

// Listen for arrow keys
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -20;
  } else if (key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = 20;
  } else if (key === "ArrowLeft" && dx === 0) {
    dx = -20;
    dy = 0;
  } else if (key === "ArrowRight" && dx === 0) {
    dx = 20;
    dy = 0;
  }
});

// Attach event listeners
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
