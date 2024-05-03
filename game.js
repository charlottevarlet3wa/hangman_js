let wordToGuess = '';
let displayedWord = [];
let wrongGuesses = [];
const maxTries = 10;
let score = 0;
let totalWords = 0;
let wordsList = [];
let damageToEnemy = 10; // new

async function fetchWords() {
  const response = await fetch('words.json');
  const data = await response.json();
  wordsList = shuffleArray(data.words);
  totalWords = wordsList.length;
  pickWordAndInitialize();
}

// Utility function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
  return array;
}

function pickWordAndInitialize() {
  if (wordsList.length === 0) {
    document.getElementById('nextBtn').style.display = 'none';
    if(score === totalWords){
        document.getElementById('status').innerText = "Bravo ! Tu as deviné tous les mots !";
    } else {
        document.getElementById('status').innerText = "Tu y es presque !";
    }
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * wordsList.length);
  wordToGuess = wordsList.splice(randomIndex, 1)[0]; // Remove the word from the list
  damageToEnemy = Math.ceil(100 / (wordToGuess.length - 1)); // new
  console.log("damage to enemy : " + damageToEnemy)
//   damageToEnemy = 50; // new
  displayedWord = Array(wordToGuess.length).fill('_');
  // Reveal the first letter
  revealLetter(wordToGuess[0]);
  document.getElementById('wordToGuess').innerText = displayedWord.join(' ');
  document.getElementById('status').innerText = '';
  document.getElementById('wrongGuesses').innerText = '';
  wrongGuesses = [];
  initializeKeyboard();
  resetHealth('enemy');
  resetHealth('hero');
}

document.getElementById('nextBtn').addEventListener('click', pickWordAndInitialize);

function resetHealth(character) {
  const healthBar = document.getElementById(character + '-bar');
  healthBar.style.width = '100%';
  healthBar.style.backgroundColor = 'rgba(79,185,212,1)';
}

function initializeKeyboard() {
  const letterContainer = document.getElementById('keyboard');
  letterContainer.innerHTML = ''; // Clear previous keyboard for new game
  for (let i = 65; i <= 90; i++) {
    const button = document.createElement('button');
    button.textContent = String.fromCharCode(i);
    button.classList.add("keyboard-button");
    button.disabled = false;
    button.addEventListener('click', function() {
      makeGuess(button.textContent);
      button.disabled = true;
    });
    letterContainer.appendChild(button);
  }
}

function revealLetter(guessedLetter) {
  const letterCount = wordToGuess.split('').filter(letter => letter === guessedLetter).length;
  wordToGuess.split('').forEach((letter, index) => {
    if (letter === guessedLetter) {
      displayedWord[index] = guessedLetter;
    }
  });
//   const damageToEnemy = 100 / wordToGuess.length * letterCount;
  reduceHealth(damageToEnemy * letterCount, "enemy");
  document.getElementById('wordToGuess').innerText = displayedWord.join(' ');
}

function makeGuess(guessedLetter) {
  if (displayedWord.includes(guessedLetter)) return;
  revealLetter(guessedLetter);
  if (!wordToGuess.includes(guessedLetter)) {
    wrongGuesses.push(guessedLetter);
    document.getElementById('wrongGuesses').innerText = wrongGuesses.join(', ');
    reduceHealth(10, "hero");
  }
  updateGameStatus();
}

function updateGameStatus() {
    const statusElem = document.getElementById('status');
    const enemyElem = document.getElementById('enemy'); // Get the enemy element
    const heroElem = document.getElementById('hero'); // Get the enemy element
  
    if (!displayedWord.includes('_')) {
      statusElem.innerText = "Congratulations! You've won this round!";
      score++;
      document.getElementById('score').innerText = `${score}/${totalWords}`;
      if (wordsList.length > 0) {
        document.getElementById('nextBtn').style.display = 'inline';
      } else {
        document.getElementById('status').innerText = "Great job! You've guessed all the words!";
        document.getElementById('nextBtn').style.display = 'none';
      }
    } else if (wrongGuesses.length >= maxTries) {
      statusElem.innerText = "Dommage! Le mot était : " + wordToGuess;
      heroElem.classList.add('fade-out'); // Apply the fade-out animation
      document.getElementById('nextBtn').style.display = 'inline';
    }
  }
  

function reduceHealth(percentage, character) {
  const healthBar = document.getElementById(character + '-bar');
  const currentHealthPercentage = parseFloat(healthBar.style.width);
  const newHealth = Math.max(0, currentHealthPercentage - percentage);
  healthBar.style.width = newHealth + '%';
  console.log("new HP : " + newHealth);
}

function resetHealth(character) {
    const healthBar = document.getElementById(character + '-bar');
    healthBar.style.width = '100%';
    healthBar.style.backgroundColor = 'rgba(79,185,212,1)';
  
    if (character === 'enemy') {
      const enemyElem = document.getElementById('enemy');
      enemyElem.classList.remove('fade-out'); // Reset animation
      enemyElem.style.opacity = 1; // Reset opacity
      return;
    }
    const heroElem = document.getElementById('hero');
    heroElem.classList.remove('fade-out'); // Reset animation
    heroElem.style.opacity = 1; // Reset opacity
  }

window.onload = function() {
  fetchWords();
  setupKeyboardListeners();
};

function setupKeyboardListeners() {
    document.addEventListener('keydown', function(event) {
      const letter = event.key.toUpperCase();
      if (letter >= 'A' && letter <= 'Z') {
        const buttons = document.querySelectorAll('.keyboard-button');
        buttons.forEach(button => {
          if (button.textContent === letter && !button.disabled) {
            button.click();  // Trigger the click event of the button
            button.disabled = true;  // Disable the button
          }
        });
      }
    });
  }