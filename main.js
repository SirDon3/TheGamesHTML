
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 10;
let x = canvas.width /2;
let y = canvas.height -30;
let dx = 4;
let dy = -1;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;


// Creating 2D bricks array 
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Function to handle when the right or left key is pressed
function keyDownHandler(e) {

    if (e.key == "Right" || e.key == "ArrowRight") {

        rightPressed = true;

    } else if (e.key == "Left" || e.key == "ArrowLeft") {

        leftPressed = true;

    }
}

// Function to handle when the right or left key is unpressed
function keyUpHandler(e) {

    if (e.key == "Right" || e.key == "ArrowRight") {

        rightPressed = false;

    } else if (e.key == "Left" || e.key == "ArrowLeft") {

        leftPressed = false;

    }
}


function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// Function to draw ball
function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
}

// Function to draw paddle
function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
}

// Function to draw bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
}

// Function to detect collision with bricks and make them disappear 
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth &&
                    y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}


// Function to display everthing on the canvas
function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        // IF loop to check if the ball is touching the left or right walls
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {

                dx = -dx;

        }

        // IF loop to check if the ball is touching top wall
        if (y + dy < ballRadius) {

                dy = -dy;

        } else if (y + dy > canvas.height - ballRadius) { // Checking if the ball is touching bottom wall

            if (x > paddleX && x < paddleX + paddleWidth) { //Checking if paddle has contact with the ball

                    dy = -dy;

            } else { // Minus live if ball touches bottom wall
                    lives--;
                    if (!lives) { // alert("GAME OVER") if 0 lives;
                            alert("GAME OVER");
                            document.location.reload();
                    } else {
                            x = canvas.width / 2;
                            y = canvas.height - 30;
                            dx = 2;
                            dy = -2;
                            paddleX = (canvas.width - paddleWidth) / 2;
                    }
            }
        }

        if (rightPressed) { // Check if RIght key is pressed, if so move to the right

                paddleX += 7;

                if (paddleX + paddleWidth > canvas.width) { // Checking if the paddle has reached the right edge

                        paddleX = canvas.width - paddleWidth;

                }

        } else if (leftPressed) { // Check if Left key is pressed, if so move to the right

                paddleX -= 7;

                if (paddleX < 0) { // Checking if the paddle has reached the left edge

                paddleX = 0;

                }
        }

        // Changing the x and y coordinate of the ball
        x += dx;
        y += dy;
        requestAnimationFrame(draw);
}


// Adding start game function (Draw function) to button
document.getElementById("runButton").addEventListener("click", function() {
    draw();
    this.disabled = true; 
    console.log(bricks)
    
} )