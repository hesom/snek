
const GRID_SIZE = 16;
const gridCenter = Math.floor(GRID_SIZE / 2);

let paused = false;
let gameover = false;

document.addEventListener("DOMContentLoaded", () => {

    let resetButton = document.getElementById('reset');
    resetButton.onclick = () => {
        if(gameover){
            gameover = false;
            setupPlayfield();
        }
    };
    let pauseButton = document.getElementById('pause');
    pauseButton.onclick = () => {
        paused = !paused;
    }

    setupPlayfield();
});

const setupPlayfield = () => {

    let playfield = document.getElementById("playfield");
    playfield.classList.remove('outline');

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
        spawnFood();
    }

    let snake = new Snake(gridCenter, gridCenter);

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

    function gameloop(){
        if(paused){
            setTimeout(() => {
                gameloop();
            }, 10);
        } else if(snake.move()){
            setTimeout(() => {
                gameloop();
            }, Math.max(200 - 10*Math.floor(snake.length()/5), 50));
        }else{
            gameover = true;
            playfield.classList.add('outline');
        }
    }
    gameloop();

}

const setGridCell = (cls, x, y) => {
    document.getElementById(`cell-${y}-${x}`).classList.add(cls);
}

const unsetGridCell = (cls, x, y) => {
    document.getElementById(`cell-${y}-${x}`).classList.remove(cls);
}

const spawnFood = () => {
    let cellFound = false;

    while(!cellFound){
        let r = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
        let row = Math.floor(r / GRID_SIZE);
        let col = r % GRID_SIZE;
    
        if(!document.getElementById(`cell-${col}-${row}`).classList.contains('snek')){
            setGridCell('food', row, col);
            cellFound = true;
        }
    }
}

class Snake {
    constructor(x, y){
        this.body = [{x, y}, { x: x, y : y+1 }]

        this.direction = 'up';
        
        // draw initial snake
        for(let part of this.body){
            let {x, y} = part;

            let cell = document.getElementById(`cell-${y}-${x}`);
            cell.classList.add('snek');
        }

        document.getElementById('score').textContent = this.body.length;
    }

    move() {
        let {x, y} = this.body[0];
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
        if(this.checkCollision(x, y)){     // check if next move would be a collision
            return false;
        };
        setGridCell('snek', x, y);

        ({x, y} = this.body[this.body.length - 1]);
        
        unsetGridCell('snek', x, y);

        this.body.splice(this.body.length - 1);

        return true;
    }

    checkCollision(x, y) {

        if(x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE){
            return true;
        }

        for(let part of this.body.slice(1)){
            if(x == part.x && y == part.y){
                return true;
            }
        }

        // check if food is on this grid cell
        let cell = document.getElementById(`cell-${y}-${x}`);
        if(cell.classList.contains('food')){
            this.eat();
            cell.classList.remove('food');

            // spawn new food
            spawnFood();
        }

        return false;
    }

    eat() {
        // hack: just duplicate the last body element
        this.body = [...this.body, this.body[this.body.length - 1]];
        document.getElementById('score').textContent = this.body.length - 1;
    }

    length() {
        return this.body.length;
    }
}