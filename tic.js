// Set game state
let gameOver = false;

// Keep track of turns
// This is part of an attempt to prevent crash on tie game
// ...still haven't figured it out
let turnCount = 0;

// Create empty array for x and o
// This array will be updated by each plotMove() function call
let theGrid = [[' ', ' ', ' '],
               [' ', ' ', ' '],
               [' ', ' ', ' ']];

// Set a blank grid
let grid =     `   
               |   |   
             ${theGrid[0][0]} | ${theGrid[0][1]} | ${theGrid[0][2]} 
               |   |   
            -----------
               |   |   
             ${theGrid[1][0]} | ${theGrid[1][1]} | ${theGrid[1][2]} 
               |   |   
            -----------
               |   |   
             ${theGrid[2][0]} | ${theGrid[2][1]} | ${theGrid[2][2]}    
               |   |   `;

// This is to keep track of all the moves.
// When a player moves, that number (or 'square')
// gets added to the array.
let moveHistory = [];

// This will draw a new grid after each round
function drawGrid() {
    console.log('\n');
    grid =     `   
               |   |   
             ${theGrid[0][0]} | ${theGrid[0][1]} | ${theGrid[0][2]} 
               |   |   
            -----------
               |   |   
             ${theGrid[1][0]} | ${theGrid[1][1]} | ${theGrid[1][2]} 
               |   |   
            -----------
               |   |   
             ${theGrid[2][0]} | ${theGrid[2][1]} | ${theGrid[2][2]}    
               |   |   `;
    console.log(grid);
    console.log('\n');
}

// This will ask the user to place an 'x'
// then check if it is ok using the checkMove()
// If not, it will re-prompt
// If valid, pass the move to playerMove()
function promptUser() {
    // This creates an interface with the command line
    let readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    // This is where you put the question you want to ask the user
    readline.question(`Select an empty square (1-9): `, pMove => {
        // Checks if move is not valid
        // if not, close current interface...
        // ...prompt again, creating new interface.
        // NOTE: Important that you close the currently open interface
        // before opening another!
        if (!checkMove(pMove)) {
            readline.close();
            promptUser();
        // If move is OK,
        // close current interface
        // and call playerMove with user's input.
        } else {
            readline.close();
            playerMove(pMove);
        }
    })  
}

// This takes the valid n value from
// promptUser() and calls plotMove('x', n)
// plotting an 'x' at space 'n'
function playerMove(n) {
    // Read input as number
    // (this is so I can compare values
    // in a switch later)
    n = parseInt(n);
    // Log players move
    moveHistory.push(n);
    console.log('========== YOUR MOVE ==========')
    // Track turn count
    turnCount++;
    // Plot player's move
    plotMove('x', n);
    // If no win condition, computer's turn
    if (!checkWin()) {
        compMove();
    } 
}    

// This rolls a random 1-9 called 'roll', checks if it is valid
// and calls plotMove('o', roll)
function compMove() {
    // This lets us generate a random 1-9
    let roll = (Math.floor(Math.random()*9)+1);

    // If random roll has already been used, roll again
    if (!checkMove(roll)) {
        compMove();
    } else {
        // Log move
        moveHistory.push(roll);
        console.log('========== COMP MOVE ==========');
        turnCount++;
        // Plot move
        plotMove('o', roll);
        // If no wins, player's turn
        if (!checkWin()) {
            promptUser();
        }
    }
}

// This is function to check if a space has been taken
// or if user input is not a valid input
function checkMove(n) {
    // If input is not a number 1-9, return false
    if (!Number.isInteger(parseInt(n)) || n === '0') {
        console.log('Invalid move!')
        return false;
    }
    // If number has already been taken, return false
    for (let i = 0; i < moveHistory.length; i++) {
        if (moveHistory[i] == n || n == 0) {
            return false;
        }
    }
    return true;   
}

// This plots either an 'x' or an 'o'
// (depending on where it was called from)
// at position 'position'
function plotMove(xORo, position) {
    switch (position) {
        case 1:
            theGrid[0][0] = xORo;
            // console.log(theGrid);
            // drawGrid();
            break;
        case 2:
            theGrid[0][1] = xORo;
            break;
        case 3:
            theGrid[0][2] = xORo;
            break;
        case 4:
            theGrid[1][0] = xORo;
            break;
        case 5:
            theGrid[1][1] = xORo;
            break;
        case 6:
            theGrid[1][2] = xORo;
            break;
        case 7:
            theGrid[2][0] = xORo;
            break;
        case 8:
            theGrid[2][1] = xORo;
            break;
        case 9:
            theGrid[2][2] = xORo;
            break;
    }
    drawGrid();
}

// TO DO:
// function theTieChecker() {
//     if (turnCounter === 9 && checkWin() == false) 
// }

// This contains all win conditions
function checkWin() {
    
    for (let i=0; i<3; i++) {
        // Check for vertical wins
        if (theGrid[0][i] == theGrid[1][i] && theGrid[0][i] == theGrid[2][i] && theGrid[0][i] != ' ') {
            console.log(`====== ${theGrid[0][i]}\'s WIN!! =====`);
            gameOver = true;
            return true;
        }
        // Check for horizontal wins
        if (theGrid[i][0] == theGrid[i][1] && theGrid[i][0] == theGrid[i][2] && theGrid[i][0] != ' ') {
            console.log(`====== ${theGrid[i][0]}\'s WIN!! =====`);
            gameOver = true;
            return true;
        }
    }

    // Check for diagonal wins
    if (theGrid[0][0] == theGrid[1][1] && theGrid[0][0] == theGrid[2][2] && theGrid[0][0] != ' ') {
        console.log(`====== ${theGrid[0][0]}\'s WIN!! =====`);
        gameOver = true;
        return true;       
    }

    else if (theGrid[0][2] == theGrid[1][1] && theGrid[0][2] == theGrid[2][0] && theGrid[0][2] != ' ') {
        console.log(`====== ${theGrid[0][2]}\'s WIN!! =====`);
        gameOver = true;
        return true;       
    }

    // This tie check is not working
    // Needs to be called before a crash
    // if (turnCount === 9 && checkWin === false) {
    //     console.log("========== IT\'S A TIE GAME ==========");
    //     gameOver = true;
    // }
    //console.log(turnCount);    
}

drawGrid();

if (gameOver != true) {
    promptUser();
}

// ONLY PROBLEM IS ERROR IS THROWN ON TIE GAME

