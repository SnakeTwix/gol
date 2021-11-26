"use strict";
const SIZE_Y = 40;
const CELL_SIZE = window.innerHeight / SIZE_Y;
const SIZE_X = Math.floor(window.innerWidth / CELL_SIZE);
const colors = {
    0: 'white',
    1: 'black',
};
let animationFrameId;
let gameRunning = false;
const grid = document.getElementById('grid');
const divCells = [];
const cells = getCells(SIZE_X * SIZE_Y);
fillGrid();
draw();
setStyles();
function setStyles() {
    grid.style.gridTemplateColumns = `repeat(${SIZE_X}, ${CELL_SIZE}px)`;
    grid.style.gridTemplateRows = `repeat(${SIZE_Y}, ${CELL_SIZE}px)`;
}
function fillGrid() {
    for (let i = 0; i < SIZE_Y * SIZE_X; i++) {
        divCells[i] = document.createElement('div');
        grid.append(divCells[i]);
    }
}
function game() {
    animationFrameId = window.requestAnimationFrame(game);
    logic();
    draw();
}
function draw() {
    divCells.forEach((elem, index) => {
        const color = cells[index];
        elem.classList.add(colors[color]);
        elem.classList.remove(colors[color ? 0 : 1]);
    });
}
function logic() {
    for (let i = 0; i < SIZE_X; i++) {
        for (let j = 0; j < SIZE_Y; j++) {
            const neighbours = [];
            const index = i + j * SIZE_X;
            // Gets all the neighbours
            for (let m = -1; m < 2; m++) {
                if (i === 0 && m === -1)
                    continue;
                if (i === SIZE_X - 1 && m === 1)
                    continue;
                pushIfDefined(neighbours, cells[index + SIZE_X + m]);
                pushIfDefined(neighbours, cells[index - SIZE_X + m]);
                if (m === 0)
                    continue;
                pushIfDefined(neighbours, cells[index + m]);
            }
            const neighbourSum = neighbours.reduce((a, b) => a + b, 0);
            // Decides whether a cell should live or die
            if (neighbourSum === 3)
                cells[index] = 1;
            else if (neighbourSum < 2 || neighbourSum > 3)
                cells[index] = 0;
        }
    }
}
function pushIfDefined(arr, value) {
    if (typeof value !== 'undefined')
        arr.push(value);
}
// Generates values for cells
function getCells(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.round(Math.random()));
        // arr.push(0);
    }
    return arr;
}
// EventListeners
// Pauses/Unpauses the game when pressed on space
document.addEventListener('keydown', function ({ code }) {
    if (code !== 'Space')
        return;
    if (gameRunning)
        window.cancelAnimationFrame(animationFrameId);
    else
        animationFrameId = window.requestAnimationFrame(game);
    gameRunning = !gameRunning;
});
// Revert the value of a cell on click
grid.addEventListener('click', function ({ target }) {
    const index = divCells.findIndex((elem) => elem === target);
    if (index === -1)
        return;
    cells[index] = cells[index] ? 0 : 1;
    draw();
});
