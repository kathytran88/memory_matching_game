const assets = ['snorlax.png', 'electrabuzz.png', 'chansey.png', 'oddish.png',
    'pikachu.png', 'paras.png', 'arcanine.png', 'ponita.png',
    'venonat.png', 'eggsecute.png', 'machop.png', 'pidgey.png',
    'psyduck.png', 'tauros.png', 'vulpix.png', 'gloom.png',
    'krabby.png', 'butterfree.png', 'bulbasaur.png', 'clefairy.png',
    'koffing.png', 'goldeen.png', 'magikarp.png', 'beedrill.png',
    'lapras.png', 'meowth.png', 'ekans.png', 'jigglypuff.png',
    'horsea.png', 'polywog.png', 'sandshrew.png', 'rattata.png',
    'gengar.png', 'eevee.png', 'bellsprout.png', 'squirtle.png',
    'seel.png', 'caterpie.png'];

const correctSound = new Audio('assets/correct.wav');
const wrongSound = new Audio('assets/wrong.wav');

let firstCard = null;
let secondCard = null;
let matches = 0;
let timer = 0;
let intervalId;
let bestTime = 99999;
if (localStorage.getItem('bestTime')) {
    bestTime = parseInt(localStorage.getItem('bestTime'));
}

document.getElementById('start-button').onclick = startGame;
document.getElementById('play-again').onclick = resetGame;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('play-screen').style.display = 'block';
    setupBoard();
    startTimer();
}

function setupBoard() {
    const difficulty = document.getElementById('difficulty').value;
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    let rows, cols;
    if (difficulty === 'easy') {
        rows = 3;
        cols = 4;
    } else if (difficulty === 'medium') {
        rows = 4;
        cols = 5;
    } else {
        rows = 5;
        cols = 6;
    }

    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    const selectedAssets = shuffle(assets).slice(0, (rows * cols) / 2);
    const cards = shuffle([...selectedAssets, ...selectedAssets]);

    cards.forEach((asset) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.asset = asset;
        card.style.backgroundImage = 'url("assets/pokeball.png")';
        card.onclick = () => flipCard(card);
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (firstCard && secondCard) return;
    if (card === firstCard) return;

    card.style.backgroundImage = `url("assets/${card.dataset.asset}")`;
    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkMatch();
    }
}

function checkMatch() {
    if (firstCard.dataset.asset === secondCard.dataset.asset) {
        correctSound.play();
        firstCard = null;
        secondCard = null;
        matches++;
        if (matches === document.querySelectorAll('.card').length / 2) {
            setTimeout(endGame, 1000);
        }
    } else {
        wrongSound.play();
        setTimeout(() => {
            firstCard.style.backgroundImage = 'url("assets/pokeball.png")';
            secondCard.style.backgroundImage = 'url("assets/pokeball.png")';
            firstCard = null;
            secondCard = null;
        }, 1000);
    }
}


function startTimer() {
    timer = 0;
    intervalId = setInterval(() => {
        timer++;
        document.getElementById('timer').innerText = `Time: ${timer}s`;
    }, 1000);
}

function endGame() {
    clearInterval(intervalId);
    document.getElementById('play-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
    document.getElementById('final-time').innerText = timer;

    const previousBestTime = localStorage.getItem('bestTime');
    const previousBestPlayer = localStorage.getItem('bestPlayer');

    if (!previousBestTime || timer < parseInt(previousBestTime)) {
        const playerName = prompt("Congratulations! You've set a new high score. Enter your name:");
        bestTime = timer;
        localStorage.setItem('bestTime', bestTime);
        localStorage.setItem('bestPlayer', playerName);
        document.getElementById('best-time').innerText = `${bestTime}s - New High Score!`;
        document.getElementById('best-player').innerText = playerName;
    } else {
        bestTime = parseInt(previousBestTime);
        const bestPlayer = previousBestPlayer || "No Player Yet";
        document.getElementById('best-time').innerText = `${bestTime}s`;
        document.getElementById('best-player').innerText = bestPlayer;
    }
}



function resetGame() {
    matches = 0;
    firstCard = null;
    secondCard = null;
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('play-screen').style.display = 'block';
    setupBoard(); 
    startTimer(); 
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

