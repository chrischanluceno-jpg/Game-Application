const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const healthUI = document.getElementById("health");

// ================= GAME STATE =================
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let gameOver = false;

// ================= PLAYER =================
const player = {
  x: 50,
  y: 220,
  width: 30,
  height: 30,
  dy: 0,
  gravity: 0.8,
  jumpPower: -12,
  grounded: false,
  health: 100
};

// ================= OBSTACLE =================
const obstacle = {
  x: canvas.width,
  y: 230,
  width: 25,
  height: 40,
  speed: 4
};

// ================= DIFFICULTY =================
function updateDifficulty() {
  if (score < 10) {
    obstacle.speed = 4;        // EASY
  } else if (score < 20) {
    obstacle.speed = 6;        // MEDIUM
  } else {
    obstacle.speed = 8;        // HARD
  }
}

// ================= UPDATE =================
function updatePlayer() {
  player.dy += player.gravity;
  player.y += player.dy;

  if (player.y + player.height >= 260) {
    player.y = 260 - player.height;
    player.dy = 0;
    player.grounded = true;
  }
}

function updateObstacle() {
  updateDifficulty();
  obstacle.x -= obstacle.speed;

  if (obstacle.x + obstacle.width < 0) {
    obstacle.x = canvas.width;
    score++;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
  }
}

// ================= COLLISION =================
function checkCollision() {
  if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ) {
    obstacle.x = canvas.width;
    player.health -= 20;
    healthUI.style.width = player.health + "%";

    if (player.health <= 0) {
      gameOver = true;
    }
  }
}

// ================= DRAW =================
function drawPlayer() {
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacle() {
  ctx.fillStyle = "#ff4444";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawUI() {
  ctx.fillStyle = "white";
  ctx.font = "14px Arial";

  ctx.fillText("Score: " + score, 10, 50);
  ctx.fillText("High Score: " + highScore, 10, 70);

  let level = "EASY";
  if (score >= 10 && score < 20) level = "MEDIUM";
  if (score >= 20) level = "HARD";

  ctx.fillText("Difficulty: " + level, 10, 90);
}

function drawGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("GAME OVER", 220, 150);
  ctx.font = "14px Arial";
  ctx.fillText("Refresh to Restart", 210, 180);
}

// ================= GAME LOOP =================
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    updatePlayer();
    updateObstacle();
    checkCollision();
    drawPlayer();
    drawObstacle();
    drawUI();
    requestAnimationFrame(gameLoop);
  } else {
    drawGameOver();
  }
}

// ================= INPUT =================
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
});

// ================= START =================
gameLoop();
