const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;
const cells = 3;
const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body, //location of the canvas
    engine: engine,
    options: {
        wireframse: false,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
    Bodies.rectangle((width/2), 0, width, 10, {isStatic: true}),
    Bodies.rectangle((width/2), height, width, 10, {isStatic: true}),
    Bodies.rectangle(0, (width/2), 10, height, {isStatic: true}),
    Bodies.rectangle(width, (width/2), 10, height, {isStatic: true}),
];
World.add(world, walls);

//Grid Array generator
const shuffle = (arr) => { //shuffling an array of neighbor cells
    let counter = arr.length;
    
    while(counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));
const verticals = Array(cells).fill(null).map(() => Array(cells -1).fill(false));
const horizontals = Array(cells -1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => { //funciton to create a maze
    if(grid[row][column]) { //check if the cell was already visited
        return;
    }
    grid[row][column] = true; //marking the cell as visited

    const neighbors = shuffle([ //getting all naighbors of the current cell
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row+1, column, 'down'],
        [row, column-1, 'left']
    ]);
    
    for(let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;

        if( //check if neighbor exist and skip the step if not
            nextRow < 0 ||
            nextRow >= cells ||
            nextColumn < 0 ||
            nextColumn >= cells 
        ) { 
            continue;
        }

        if(grid[nextRow][nextColumn]) { //check if we alredy visited that neighbor
            continue;
        }
        
        if(direction === 'left') {//change a chosen border to true by direction of current neighbor
            verticals[row][column - 1] = true;
        } else if(direction === 'right') {
            verticals[row][column] = true;
        } else if(direction === 'up') {
            horizontals[row - 1][column] = true;
        } else if(direction === 'down') {
            horizontals[row][column] = true;
        }
        stepThroughCell(nextRow, nextColumn); //function call for recursive behavior
    }
};
stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open) { //if boolean = true => no wall needed
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength, 
            10,
            {
                isStatic: true
            }
        );
        World.add(world, wall);
    })
})
verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open) { //if boolean = true => no wall needed
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength / 2,
            10,
            unitLength, 
            {
                isStatic: true
            }
        );
        World.add(world, wall);
    })
})

