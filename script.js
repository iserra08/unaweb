let score = 0;
let timer = 15;
let gameInterval;
let timerInterval;

const bug = document.getElementById('bug');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const gameBoard = document.getElementById('game-board');

// Evento para iniciar el juego
startBtn.addEventListener('click', startGame);

// Evento para cuando atrapas el BUG
bug.addEventListener('mousedown', () => {
    if (timer > 0) {
        score++;
        scoreDisplay.textContent = score;
        moveBug();
    }
});

function startGame() {
    // Reiniciar valores
    score = 0;
    timer = 15;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timer;
    
    // Cambiar la vista
    startBtn.style.display = 'none';
    gameBoard.style.display = 'block';
    
    // Primer movimiento
    moveBug();
    
    // Mover automáticamente el bug cada 800ms
    gameInterval = setInterval(moveBug, 800);
    
    // Cuenta regresiva
    timerInterval = setInterval(() => {
        timer--;
        timerDisplay.textContent = timer;
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

function moveBug() {
    // Calcular límites para que no se salga de la caja
    const maxX = gameBoard.clientWidth - 30; 
    const maxY = gameBoard.clientHeight - 30;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    bug.style.left = randomX + 'px';
    bug.style.top = randomY + 'px';
}

function endGame() {
    // Detener intervalos
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    // Restaurar vista
    gameBoard.style.display = 'none';
    startBtn.style.display = 'inline-block';
    startBtn.textContent = '> [JUGAR DE NUEVO] <';
    
    // Mostrar resultado
    alert(`\n== RESULTADO FINAL ==\nHas atrapado ${score} 'Bugs'.\n\n¿Nada mal para un servidor caído, verdad?\n`);
}
