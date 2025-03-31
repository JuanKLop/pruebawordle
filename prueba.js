const words = ["CASA", "PERRO", "GATOS", "LIBRO", "MESA", "SILLA", "PLAYA"];

// Seleccionar palabra aleatoria del día
const todayWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
const maxAttempts = 6;

let attempts = 0;
let gameActive = false;
let currentGuess = "";

// Función para evaluar un intento
function evaluateGuess(guess) {
    if (guess.length !== 5) return "La palabra debe tener 5 letras";
    
    attempts++;
    let result = "";
    
    for (let i = 0; i < 5; i++) {
        if (guess[i] === todayWord[i]) {
            result += `[${guess[i]}]`; // Letra correcta en posición correcta
        } else if (todayWord.includes(guess[i])) {
            result += `(${guess[i]})`; // Letra correcta en posición incorrecta
        } else {
            result += ` ${guess[i]} `; // Letra incorrecta
        }
    }
    
    if (guess === todayWord) {
        gameActive = false;
        return `¡Correcto! ${result} - Ganaste en ${attempts} intentos!`;
    }
    
    if (attempts >= maxAttempts) {
        gameActive = false;
        return `Perdiste. La palabra era: ${todayWord}`;
    }
    
    return result;
}

// Comandos para Nightbot (adaptar a la sintaxis de Nightbot)
function startGame(user) {
    if (gameActive) return "Ya hay un juego en curso";
    gameActive = true;
    attempts = 0;
    return `Nuevo juego de Wordle iniciado por ${user}! Adivina la palabra de 5 letras.`;
}

function guessWord(user, guess) {
    if (!gameActive) return "No hay juego activo. Usa !wordle para empezar";
    guess = guess.toUpperCase();
    return evaluateGuess(guess);
}