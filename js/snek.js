
const GRID_SIZE = 32;

let mainLoop = null;

document.addEventListener("DOMContentLoaded", () => {

    let resetButton = document.getElementById('reset');
    resetButton.onclick = () => {
        setupPlayfield();
    };

    setupPlayfield();
});

const setupPlayfield = () => {

    window.clearInterval(mainLoop);
    let playfield = document.getElementById("playfield");

    playfield.textContent = '';

    let grid = document.createElement('div');
    grid.classList.add('grid');
    grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

    for(let i = 0; i < GRID_SIZE; i++){
        for(let j = 0; j < GRID_SIZE; j++){
            let cell = document.createElement('div');
            cell.id = `cell-${i}-${j}`;
            grid.appendChild(cell);
        }
    }

    playfield.appendChild(grid);

    for(let i = 0; i < 5; i++){
        let r = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
        let row = Math.floor(r / GRID_SIZE);
        let col = r % GRID_SIZE;

        setGridCell('food', row, col);
    }

    let gridCenter = Math.floor(GRID_SIZE / 2);
    let snake = new Snake(gridCenter, gridCenter);

    mainLoop = window.setInterval(() => {
        snake.move();
    }, 1000);

    document.addEventListener('keydown', (event) => {
        switch(event.key){
            case "ArrowUp":
                snake.direction = 'up';
                break;
            case "ArrowDown":
                snake.direction = 'down';
                break;
            case "ArrowLeft":
                snake.direction = 'left';
                break;
            case "ArrowRight":
                snake.direction = 'right';
                break;
            default:
                break;
        }
    })
}

const setGridCell = (cls, x, y) => {
    document.getElementById(`cell-${y}-${x}`).classList.add(cls);
}

const unsetGridCell = (cls, x, y) => {
    document.getElementById(`cell-${y}-${x}`).classList.remove(cls);
}

class Snake {
    constructor(x, y){
        this.head = {x, y};
        this.body = [this.head, { x: x, y : y+1 }]

        this.direction = 'up';
        
        // draw initial snake
        for(let part of this.body){
            let {x, y} = part;

            let cell = document.getElementById(`cell-${y}-${x}`);
            cell.classList.add('snek');
        }
    }

    move() {
        let {x, y} = this.body[this.body.length - 1];
        
        unsetGridCell('snek', x, y);

        this.body.splice(this.body.length - 1);
        
        ({x, y} = this.body[0]);
        switch(this.direction){
            case 'up':
                this.body.unshift({x: x, y: y-1});
                break;
            case 'down':
                this.body.unshift({x: x, y: y+1});
                break;
            case 'left':
                this.body.unshift({x: x-1, y: y});
                break;
            case 'right':
                this.body.unshift({x: x+1, y: y});
                break;
            default:
                break;
        }

        ({x, y} = this.body[0]);
        setGridCell('snek', x, y);
    }
}