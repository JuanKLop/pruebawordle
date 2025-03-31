const wordList = ['CASA', 'PERRO', 'GATOS', 'LIBRO', 'PLAYA', 'MUSICA'];
const maxAttempts = 6;
let currentWord = '';
let players = {};

function getDailyWord() {
  const today = new Date().toISOString().slice(0, 10);
  const index = parseInt(today.replace(/-/g, '')) % wordList.length;
  return wordList[index];
}

function evaluateGuess(guess, word) {
  guess = guess.toUpperCase();
  let result = '';
  let correct = 0;
  
  for (let i = 0; i < 5; i++) {
    if (guess[i] === word[i]) {
      result += `[${guess[i]}]`;
      correct++;
    } else if (word.includes(guess[i])) {
      result += `(${guess[i]})`;
    } else {
      result += ` ${guess[i]} `;
    }
  }
  
  return { result, isCorrect: correct === 5 };
}

function initGame() {
  currentWord = getDailyWord();
  players = {};
}

// Comando principal
function wordleCommand(user, args) {
  if (!currentWord) initGame();
  
  if (args.length === 0) {
    return `${user}, ¡Juego de Wordle activo! Adivina la palabra de 5 letras con !wordle [tu palabra]. Tienes ${maxAttempts} intentos.`;
  }
  
  const guess = args[0].toUpperCase();
  
  if (guess.length !== 5) {
    return `${user}, la palabra debe tener exactamente 5 letras.`;
  }
  
  if (!players[user]) {
    players[user] = { attempts: 0, guessed: false };
  }
  
  if (players[user].guessed) {
    return `${user}, ya adivinaste la palabra correctamente.`;
  }
  
  if (players[user].attempts >= maxAttempts) {
    return `${user}, ya usaste todos tus intentos. La palabra era: ${currentWord}`;
  }
  
  players[user].attempts++;
  const { result, isCorrect } = evaluateGuess(guess, currentWord);
  
  if (isCorrect) {
    players[user].guessed = true;
    return `🎉 ${user} adivinó la palabra en ${players[user].attempts} intentos! ${result}`;
  }
  
  if (players[user].attempts === maxAttempts) {
    return `${user}, último intento: ${result}. La palabra era: ${currentWord}`;
  }
  
  return `${user}, intento ${players[user].attempts}/${maxAttempts}: ${result}`;
}

// Registra los comandos
exports.register = function (bot) {
  bot.registerCommand('wordle', wordleCommand, {
    description: 'Juega Wordle en el chat',
    usage: '!wordle [palabra]'
  });
};

exports.unregister = function (bot) {
  bot.unregisterCommand('wordle');
};

// Reinicia el juego cada día
setInterval(initGame, 24 * 60 * 60 * 1000);
initGame();
