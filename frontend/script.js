let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

let grid = 10;
let count = 0;

// Scores
let player1Score = 0;
let player2Score = 0;
let player1Name = 'Player 1';
let player2Name = 'Player 2';

// Snake Base Stats
let snake = {
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

let snake2 = {
    x: 200,
    y: 200,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 5,
    alive: true,
    active: false,
    color: 'blue',
    directionQueue: []
};

let snakes = [snake];

// First Apple Spawn
let apple = {
    x: 320,
    y: 320,
    color: 'gold'
}, Speed;

// Random Int for Apple Spawn
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Start Game function
function startGame() {
    player1Name = document.getElementById('player1').value;
    player2Name = document.getElementById('player2').value;

    if (!player1Name || !player2Name) {
        alert('Please enter both player names.');
        return;
    }

    document.getElementById('overlay').style.display = 'none';
    document.getElementById('Score').innerHTML = `${player1Name}: 0, ${player2Name}: 0`;
    player1Score = 0;
    player2Score = 0;
    GameMode(); // Start the game mode
    fetchLeaderboard(); // Fetch the leaderboard when the game starts
}

// Game Mode setup
function GameMode() {
    // Initialize game settings
    Speed = 20;
    activateSnakes(2); // Start with two snakes
    requestAnimationFrame(loop); // Start the game loop
}

// Arrow Key Movement for Snake 1
document.addEventListener('keydown', function(e) {
    if (e.which === 37 && snake.dx === 0 && snake.directionQueue[snake.directionQueue.length - 1] !== 'right') {
        snake.directionQueue.push('left');
    } else if (e.which === 38 && snake.dy === 0 && snake.directionQueue[snake.directionQueue.length - 1] !== 'down') {
        snake.directionQueue.push('up');
    } else if (e.which === 39 && snake.dx === 0 && snake.directionQueue[snake.directionQueue.length - 1] !== 'left') {
        snake.directionQueue.push('right');
    } else if (e.which === 40 && snake.dy === 0 && snake.directionQueue[snake.directionQueue.length - 1] !== 'up') {
        snake.directionQueue.push('down');
    }
});

// Arrow Key Movement for Snake 2
document.addEventListener('keydown', function(e) {
    if (e.which === 65 && snake2.dx === 0 && snake2.directionQueue[snake2.directionQueue.length - 1] !== 'right') {
        snake2.directionQueue.push('left');
    } else if (e.which === 87 && snake2.dy === 0 && snake2.directionQueue[snake2.directionQueue.length - 1] !== 'down') {
        snake2.directionQueue.push('up');
    } else if (e.which === 68 && snake2.dx === 0 && snake2.directionQueue[snake2.directionQueue.length - 1] !== 'left') {
        snake2.directionQueue.push('right');
    } else if (e.which === 83 && snake2.dy === 0 && snake2.directionQueue[snake2.directionQueue.length - 1] !== 'up') {
        snake2.directionQueue.push('down');
    }
});

// Game Loop
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

// Move Snakes function
function moveSnakes(snakes, canvas) {
    snakes.forEach(function(snake) {
        if (!snake.active) {
            return;
        }

        // Process the direction queue
        if (snake.directionQueue.length) {
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

// Score function
function SnakeScore(snake) {
    if (snake.alive) {
        if (snake.color === 'white') {
            player1Score++;
            updateLeaderboard(player1Name, player1Score); // Update the leaderboard
        } else if (snake.color === 'blue') {
            player2Score++;
            updateLeaderboard(player2Name, player2Score); // Update the leaderboard
        }
    } else {
        if (snake.color === 'white') {
            player1Score = 0;
        } else if (snake.color === 'blue') {
            player2Score = 0;
        }
        snake.alive = true; // Reset snake alive status
    }

    // Update the score display
    document.getElementById("Score").innerHTML = `${player1Name}: ${player1Score}, ${player2Name}: ${player2Score}`;
}


function updateLeaderboard(playerName, score) {
    fetch('http://localhost:5255/api/v1/Leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            playerName: playerName,
            score: score
        })
    }).then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => {
            console.error('Error:', error);
        });
}

function fetchLeaderboard() {
    fetch('http://localhost:5255/api/v1/leaderboard')
        .then(response => response.json())
        .then(data => {
            const leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML = ''; // Clear existing leaderboard

            data.forEach(entry => {
                const row = document.createElement('div');
                row.classList.add('row');

                const name = document.createElement('div');
                name.classList.add('name');
                name.textContent = entry.playerName;

                const score = document.createElement('div');
                score.classList.add('score');
                score.textContent = entry.score;

                row.appendChild(name);
                row.appendChild(score);
                leaderboard.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Fetch the leaderboard when the page loads
document.addEventListener('DOMContentLoaded', fetchLeaderboard);


// Summon Snake function
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
        snake2.active = false;
    } else if (numberOfSnakes === 2) {
        SummonSnake(snake, 200, 200);
        SummonSnake(snake2, 200, 100); // 3 blocks apart from the first snake
        snakes = [snake, snake2];
        snake2.active = true;
    }
}

requestAnimationFrame(loop);
