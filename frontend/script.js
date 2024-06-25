const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let grid = 10;
let count = 0;

let player1Score = 0;
let player1Name = 'Player 1';

let Speed;

const snake = {
    x: 200,
    y: 200,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4,
    alive: true,
    active: true,
    color: 'white',
    directionQueue: []
};

let snakes = [snake];

let apple = {
    x: 320,
    y: 320,
    color: 'gold'
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGameUI() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('Score').innerHTML = `${player1Name}: 0`;
}

function startGame() {
    resetGameUI();
    initializeGame();
    fetchLeaderboard();
}

function initializeGame() {
    Speed = 20;
    activateSnakes(1);
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', function(e) {
    let lastDirection = snake.directionQueue[snake.directionQueue.length - 1];
    if ((e.which === 37 || e.which === 65) && lastDirection !== 'right') {
        snake.directionQueue.push('left');
    } else if ((e.which === 38 || e.which === 87) && lastDirection !== 'down') {
        snake.directionQueue.push('up');
    } else if ((e.which === 39 || e.which === 68) && lastDirection !== 'left') {
        snake.directionQueue.push('right');
    } else if ((e.which === 40 || e.which === 83) && lastDirection !== 'up') {
        snake.directionQueue.push('down');
    }
});

function loop() {
    requestAnimationFrame(loop);

    if (++count < Speed) {
        return;
    }

    count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveSnakes(snakes, canvas);

    ctx.fillStyle = apple.color;
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    drawSnakes(snakes, ctx, apple);
}

function moveSnakes(snakes, canvas) {
    snakes.forEach(function(snake) {
        if (!snake.active) {
            return;
        }

        if (snake.directionQueue.length > 0) {
            const newDirection = snake.directionQueue.shift();

            if (newDirection === 'left' && snake.dx === 0) {
                snake.dx = -grid;
                snake.dy = 0;
            } else if (newDirection === 'up' && snake.dy === 0) {
                snake.dy = -grid;
                snake.dx = 0;
            } else if (newDirection === 'right' && snake.dx === 0) {
                snake.dx = grid;
                snake.dy = 0;
            } else if (newDirection === 'down' && snake.dy === 0) {
                snake.dy = grid;
                snake.dx = 0;
            }
        }

        snake.x += snake.dx;
        snake.y += snake.dy;

        if (snake.x < 0) {
            snake.x = canvas.width - grid;
        } else if (snake.x >= canvas.width) {
            snake.x = 0;
        }

        if (snake.y < 0) {
            snake.y = canvas.height - grid;
        } else if (snake.y >= canvas.height) {
            snake.y = 0;
        }

        snake.cells.unshift({
            x: snake.x,
            y: snake.y
        });

        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }
    });
}

function drawSnakes(snakes, ctx, apple) {
    snakes.forEach(function(snake) {
        if (!snake.active) {
            return;
        }

        ctx.fillStyle = snake.color;

        snake.cells.forEach(function(cell, index) {
            ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                apple.x = getRandomInt(0, 40) * grid;
                apple.y = getRandomInt(0, 40) * grid;
                SnakeScore(snake);
            }

            for (let i = index + 1; i < snake.cells.length; i++) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    SummonSnake(snake);
                    snake.alive = false;
                    SnakeScore();
                }
            }
        });
    });
}

function SnakeScore(snake) {
    if (snake.alive) {
        if (snake.color === 'white') {
            player1Score++;
            saveHighScore(player1Name, player1Score);
        }
    } else {
        if (snake.color === 'white') {
            player1Score = 0;
        }
        snake.alive = true;
    }

    document.getElementById("Score").innerHTML = `${player1Name}: ${player1Score}`;
}

function saveHighScore(name, score) {
    fetch('https://localhost:5255/api/v1/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerName: name, score: score })
    })
        .then(response => response.json())
        .then(() => {
            fetchLeaderboard();
        });
}

function fetchLeaderboard() {
    fetch('https://localhost:5255/api/v1/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML = '';
            data.forEach((entry, index) => {
                leaderboard.innerHTML += `<div class="row"><div class="name">${entry.playerName}</div><div class="score">${entry.score}</div></div>`;
            });
        });
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'flex';
}

function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'flex';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('https://localhost:5255/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
        .then(response => {
            if (response.ok) {
                response.json().then(() => {
                    player1Name = username;
                    startGame();
                });
            } else {
                console.log('Login failed with status:', response.status, response.statusText);
                alert('Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('https://localhost:5255/api/v1/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log(data.message);
                });
            } else {
                response.json().then(error => {
                    console.log('Registration failed: ' + error.message);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function SummonSnake(snake, initialX, initialY) {
    snake.x = initialX;
    snake.y = initialY;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
}

function activateSnakes(numberOfSnakes) {
    if (numberOfSnakes === 1) {
        SummonSnake(snake, 200, 200);
        snakes = [snake];
    }
}

requestAnimationFrame(loop);