// ============================================
// NAVEGACIÓN ENTRE MINIJUEGOS
// ============================================

document.querySelectorAll('.game-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const game = btn.dataset.game;
        showGame(game);
    });
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        hideAllGames();
        document.querySelector('.game-selector').style.display = 'block';
    });
});

function hideAllGames() {
    document.querySelectorAll('.game-container').forEach(el => {
        el.classList.add('hidden');
    });
    // Detener todos los juegos
    stopAllGames();
}

function showGame(game) {
    hideAllGames();
    document.querySelector('.game-selector').style.display = 'none';
    document.getElementById(`${game}-game`).classList.remove('hidden');
}

function stopAllGames() {
    // Bug game
    clearInterval(bugGameInterval);
    clearInterval(bugTimerInterval);
    // Snake game
    clearInterval(snakeInterval);
    // Pong game
    cancelAnimationFrame(pongAnimationId);
    // Memory game - no intervals to clear
}

// ============================================
// MINIJUEGO 1: ATRAPA EL BUG
// ============================================

let bugScore = 0;
let bugTimer = 15;
let bugGameInterval;
let bugTimerInterval;

const bug = document.getElementById('bug');
const bugScoreDisplay = document.getElementById('bug-score');
const bugTimerDisplay = document.getElementById('bug-timer');
const bugStartBtn = document.getElementById('bug-start-btn');
const bugBoard = document.getElementById('bug-board');

bugStartBtn.addEventListener('click', startBugGame);
bug.addEventListener('mousedown', catchBug);

function startBugGame() {
    bugScore = 0;
    bugTimer = 15;
    bugScoreDisplay.textContent = bugScore;
    bugTimerDisplay.textContent = bugTimer;

    bugStartBtn.style.display = 'none';
    bugBoard.style.display = 'block';

    moveBug();
    bugGameInterval = setInterval(moveBug, 700);

    bugTimerInterval = setInterval(() => {
        bugTimer--;
        bugTimerDisplay.textContent = bugTimer;
        if (bugTimer <= 0) {
            endBugGame();
        }
    }, 1000);
}

function catchBug() {
    if (bugTimer > 0) {
        bugScore++;
        bugScoreDisplay.textContent = bugScore;
        moveBug();
    }
}

function moveBug() {
    const maxX = bugBoard.clientWidth - 40;
    const maxY = bugBoard.clientHeight - 30;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    bug.style.left = randomX + 'px';
    bug.style.top = randomY + 'px';
}

function endBugGame() {
    clearInterval(bugGameInterval);
    clearInterval(bugTimerInterval);

    bugBoard.style.display = 'none';
    bugStartBtn.style.display = 'inline-block';
    bugStartBtn.textContent = '> [JUGAR DE NUEVO] <';
}

// ============================================
// MINIJUEGO 2: SNAKE ASCII
// ============================================

let snake = [];
let snakeDirection = { x: 1, y: 0 };
let snakeFood = { x: 0, y: 0 };
let snakeScore = 0;
let snakeInterval;
let snakeCellSize = 15;
let snakeCols = 20;
let snakeRows = 20;
let nextDirection = { x: 1, y: 0 };

const snakeCanvas = document.getElementById('snake-board');
const snakeCtx = snakeCanvas.getContext('2d');
const snakeScoreDisplay = document.getElementById('snake-score');
const snakeLengthDisplay = document.getElementById('snake-length');
const snakeStartBtn = document.getElementById('snake-start-btn');

snakeStartBtn.addEventListener('click', startSnakeGame);
document.addEventListener('keydown', handleSnakeKey);

function startSnakeGame() {
    snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ];
    snakeDirection = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    snakeScore = 0;
    snakeScoreDisplay.textContent = snakeScore;
    snakeLengthDisplay.textContent = snake.length;

    placeSnakeFood();
    snakeStartBtn.style.display = 'none';

    if (snakeInterval) clearInterval(snakeInterval);
    snakeInterval = setInterval(updateSnake, 150);
}

function handleSnakeKey(e) {
    if (document.getElementById('snake-game').classList.contains('hidden')) return;

    switch (e.key) {
        case 'ArrowUp':
            if (snakeDirection.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (snakeDirection.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (snakeDirection.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (snakeDirection.x === 0) nextDirection = { x: 1, y: 0 };
            break;
    }
}

function placeSnakeFood() {
    snakeFood = {
        x: Math.floor(Math.random() * snakeCols),
        y: Math.floor(Math.random() * snakeRows)
    };
    // Evitar que la comida aparezca sobre la serpiente
    for (let segment of snake) {
        if (segment.x === snakeFood.x && segment.y === snakeFood.y) {
            placeSnakeFood();
            return;
        }
    }
}

function updateSnake() {
    snakeDirection = nextDirection;

    const head = {
        x: snake[0].x + snakeDirection.x,
        y: snake[0].y + snakeDirection.y
    };

    // Colisión con paredes
    if (head.x < 0 || head.x >= snakeCols || head.y < 0 || head.y >= snakeRows) {
        endSnakeGame();
        return;
    }

    // Colisión con sí mismo
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endSnakeGame();
            return;
        }
    }

    snake.unshift(head);

    // Comer comida
    if (head.x === snakeFood.x && head.y === snakeFood.y) {
        snakeScore += 10;
        snakeScoreDisplay.textContent = snakeScore;
        snakeLengthDisplay.textContent = snake.length;
        placeSnakeFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

function drawSnake() {
    // Limpiar canvas
    snakeCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    // Dibujar cuadrícula
    snakeCtx.strokeStyle = 'rgba(153, 232, 170, 0.2)';
    snakeCtx.lineWidth = 0.5;
    for (let i = 0; i <= snakeCols; i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(i * snakeCellSize, 0);
        snakeCtx.lineTo(i * snakeCellSize, snakeCanvas.height);
        snakeCtx.stroke();
    }
    for (let i = 0; i <= snakeRows; i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(0, i * snakeCellSize);
        snakeCtx.lineTo(snakeCanvas.width, i * snakeCellSize);
        snakeCtx.stroke();
    }

    // Dibujar comida
    snakeCtx.fillStyle = '#ffffff';
    snakeCtx.font = 'bold 14px JetBrains Mono';
    snakeCtx.textAlign = 'center';
    snakeCtx.textBaseline = 'middle';
    snakeCtx.fillText('[*]',
        snakeFood.x * snakeCellSize + snakeCellSize / 2,
        snakeFood.y * snakeCellSize + snakeCellSize / 2
    );

    // Dibujar serpiente
    snake.forEach((segment, index) => {
        if (index === 0) {
            snakeCtx.fillStyle = '#ffffff';
            snakeCtx.fillText('[H]',
                segment.x * snakeCellSize + snakeCellSize / 2,
                segment.y * snakeCellSize + snakeCellSize / 2
            );
        } else {
            snakeCtx.fillStyle = '#99e8aa';
            snakeCtx.fillText('[o]',
                segment.x * snakeCellSize + snakeCellSize / 2,
                segment.y * snakeCellSize + snakeCellSize / 2
            );
        }
    });
}

function endSnakeGame() {
    clearInterval(snakeInterval);
    snakeStartBtn.style.display = 'inline-block';
    snakeStartBtn.textContent = '> [JUGAR DE NUEVO] <';
}

// ============================================
// MINIJUEGO 3: PONG ASCII
// ============================================

let pongBall = { x: 200, y: 125, dx: 3, dy: 3 };
let pongPlayer = { y: 100, height: 60, width: 10 };
let pongCpu = { y: 100, height: 60, width: 10 };
let pongPlayerScore = 0;
let pongCpuScore = 0;
let pongAnimationId;
let pongRunning = false;

const pongCanvas = document.getElementById('pong-board');
const pongCtx = pongCanvas.getContext('2d');
const pongPlayerDisplay = document.getElementById('pong-player');
const pongCpuDisplay = document.getElementById('pong-cpu');
const pongStartBtn = document.getElementById('pong-start-btn');

pongStartBtn.addEventListener('click', startPongGame);
pongCanvas.addEventListener('mousemove', movePongPlayer);

function startPongGame() {
    pongBall = { x: 200, y: 125, dx: 3, dy: 3 };
    pongPlayer = { y: 100, height: 60, width: 10 };
    pongCpu = { y: 100, height: 60, width: 10 };
    pongPlayerScore = 0;
    pongCpuScore = 0;
    pongPlayerDisplay.textContent = 0;
    pongCpuDisplay.textContent = 0;
    pongRunning = true;

    pongStartBtn.style.display = 'none';
    updatePong();
}

function movePongPlayer(e) {
    const rect = pongCanvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    pongPlayer.y = mouseY - pongPlayer.height / 2;

    // Límites
    if (pongPlayer.y < 0) pongPlayer.y = 0;
    if (pongPlayer.y > pongCanvas.height - pongPlayer.height) {
        pongPlayer.y = pongCanvas.height - pongPlayer.height;
    }
}

function updatePong() {
    if (!pongRunning) return;

    // Mover pelota
    pongBall.x += pongBall.dx;
    pongBall.y += pongBall.dy;

    // Rebote superior/inferior
    if (pongBall.y <= 0 || pongBall.y >= pongCanvas.height - 10) {
        pongBall.dy *= -1;
    }

    // IA de la CPU
    const cpuCenter = pongCpu.y + pongCpu.height / 2;
    if (cpuCenter < pongBall.y - 10) {
        pongCpu.y += 2.5;
    } else if (cpuCenter > pongBall.y + 10) {
        pongCpu.y -= 2.5;
    }
    if (pongCpu.y < 0) pongCpu.y = 0;
    if (pongCpu.y > pongCanvas.height - pongCpu.height) {
        pongCpu.y = pongCanvas.height - pongCpu.height;
    }

    // Colisión con paletas
    // Jugador (izquierda)
    if (pongBall.x <= 20 + pongPlayer.width &&
        pongBall.y >= pongPlayer.y &&
        pongBall.y <= pongPlayer.y + pongPlayer.height) {
        pongBall.dx = Math.abs(pongBall.dx) + 0.5;
        pongBall.dy += (pongBall.y - (pongPlayer.y + pongPlayer.height / 2)) * 0.1;
    }

    // CPU (derecha)
    if (pongBall.x >= pongCanvas.width - 30 - pongCpu.width &&
        pongBall.y >= pongCpu.y &&
        pongBall.y <= pongCpu.y + pongCpu.height) {
        pongBall.dx = -Math.abs(pongBall.dx) - 0.5;
        pongBall.dy += (pongBall.y - (pongCpu.y + pongCpu.height / 2)) * 0.1;
    }

    // Puntuación
    if (pongBall.x < 0) {
        pongCpuScore++;
        pongCpuDisplay.textContent = pongCpuScore;
        resetPongBall();
    }
    if (pongBall.x > pongCanvas.width) {
        pongPlayerScore++;
        pongPlayerDisplay.textContent = pongPlayerScore;
        resetPongBall();
    }

    drawPong();
    pongAnimationId = requestAnimationFrame(updatePong);
}

function resetPongBall() {
    pongBall = {
        x: pongCanvas.width / 2,
        y: pongCanvas.height / 2,
        dx: (Math.random() > 0.5 ? 3 : -3),
        dy: (Math.random() > 0.5 ? 3 : -3)
    };
}

function drawPong() {
    // Limpiar
    pongCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    pongCtx.fillRect(0, 0, pongCanvas.width, pongCanvas.height);

    // Línea central
    pongCtx.setLineDash([10, 10]);
    pongCtx.strokeStyle = '#99e8aa';
    pongCtx.lineWidth = 2;
    pongCtx.beginPath();
    pongCtx.moveTo(pongCanvas.width / 2, 0);
    pongCtx.lineTo(pongCanvas.width / 2, pongCanvas.height);
    pongCtx.stroke();
    pongCtx.setLineDash([]);

    // Paleta jugador
    pongCtx.fillStyle = '#99e8aa';
    pongCtx.fillRect(20, pongPlayer.y, pongPlayer.width, pongPlayer.height);

    // Paleta CPU
    pongCtx.fillStyle = '#99e8aa';
    pongCtx.fillRect(pongCanvas.width - 30, pongCpu.y, pongCpu.width, pongCpu.height);

    // Pelota (ASCII style)
    pongCtx.fillStyle = '#ffffff';
    pongCtx.font = 'bold 12px JetBrains Mono';
    pongCtx.textAlign = 'center';
    pongCtx.textBaseline = 'middle';
    pongCtx.fillText('●', pongBall.x, pongBall.y);
}

function stopPongGame() {
    pongRunning = false;
    cancelAnimationFrame(pongAnimationId);
    pongStartBtn.style.display = 'inline-block';
    pongStartBtn.textContent = '> [JUGAR DE NUEVO] <';
}

// ============================================
// MINIJUEGO 4: MEMORIA
// ============================================

const memorySymbols = ['★', '◆', '■', '▲', '●', '♦', '♠', '♥'];
let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = 0;
let memoryMoves = 0;
let memoryLocked = false;

const memoryBoard = document.getElementById('memory-board');
const memoryMovesDisplay = document.getElementById('memory-moves');
const memoryPairsDisplay = document.getElementById('memory-pairs');
const memoryStartBtn = document.getElementById('memory-start-btn');

memoryStartBtn.addEventListener('click', startMemoryGame);

function startMemoryGame() {
    memoryCards = [...memorySymbols, ...memorySymbols];
    memoryCards = shuffleArray(memoryCards);
    memoryFlipped = [];
    memoryMatched = 0;
    memoryMoves = 0;
    memoryLocked = false;

    memoryMovesDisplay.textContent = memoryMoves;
    memoryPairsDisplay.textContent = memoryMatched;
    memoryStartBtn.style.display = 'none';

    renderMemoryBoard();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderMemoryBoard() {
    memoryBoard.innerHTML = '';
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.textContent = '?';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.addEventListener('click', () => flipMemoryCard(index));
        memoryBoard.appendChild(card);
    });
}

function flipMemoryCard(index) {
    if (memoryLocked) return;
    if (memoryFlipped.includes(index)) return;

    const cards = document.querySelectorAll('.memory-card');
    const card = cards[index];

    if (card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.textContent = memoryCards[index];
    memoryFlipped.push(index);

    if (memoryFlipped.length === 2) {
        memoryMoves++;
        memoryMovesDisplay.textContent = memoryMoves;
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    memoryLocked = true;
    const cards = document.querySelectorAll('.memory-card');
    const [first, second] = memoryFlipped;

    if (memoryCards[first] === memoryCards[second]) {
        // Match!
        cards[first].classList.add('matched');
        cards[second].classList.add('matched');
        memoryMatched++;
        memoryPairsDisplay.textContent = memoryMatched;
        memoryFlipped = [];
        memoryLocked = false;

        if (memoryMatched === 8) {
            setTimeout(() => {
                alert(`\n╔══════════════════════╗\n║   ¡COMPLETADO!     ║\n║   Movimientos: ${memoryMoves.toString().padStart(9)}   ║\n╚══════════════════════╝\n`);
                memoryStartBtn.style.display = 'inline-block';
                memoryStartBtn.textContent = '> [JUGAR DE NUEVO] <';
            }, 500);
        }
    } else {
        // No match
        setTimeout(() => {
            cards[first].classList.remove('flipped');
            cards[second].classList.remove('flipped');
            cards[first].textContent = '?';
            cards[second].textContent = '?';
            memoryFlipped = [];
            memoryLocked = false;
        }, 1000);
    }
}
