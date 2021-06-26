const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;
const cells = 3;

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
const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));
const verticals = Array(cells).fill(null).map(() => Array(cells -1).fill(false));
const horizontals = Array(cells).fill(null).map(() => Array(cells -1).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

console.log(startColumn, startRow);

