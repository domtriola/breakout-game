/*	
	This is my modified version of the breakout game that can be made by following
	the tutorial at: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
*/

/* Things I have improved

	- Ball now collides with the edges of the bricks and paddle rather than the center
	- Ball color changes betwen rgb upon brick collision
	- Bricks now take more than one hit to destroy
	- Bricks change color to indicate how many times they have been hit
	- Ball can now change dx when it hits the side of the brick

*/

/* Things it would be nice to do

	- Have ball copy color of last brick it hit
	- Add ability for paddle to alter the course of the ball

*/

//get canvas variable
var canvas = document.getElementById("myCanvas");
//define context to draw on
var ctx = canvas.getContext("2d");

//Set auto-play for testing purposes
autoPlay = true;
function toggleAutoPlay() {
	if(autoPlay)
		autoPlay = false;
	else
		autoPlay = true;
}

//set starting position for ball relative to canvas
var x = canvas.width/2;
var y = canvas.height-30;
//set starting color for ball
ballColor = "#0000ff";
//set starting colorIdx for getRGB()
colorIdx = 2
//set ball radius for easier collision detection
var ballRadius = 10;

//setup paddle dimensions
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleColor = "#000";

//set intervals to change positions each frame
var dx = 4;
var dy = -4;

//setup variables for keyboard input
var rightPressed = false;
var leftPressed = false;

//initialize score and lives
var score = 0;
var lives = 3;

//setup brick variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickColor1 = "#12A03D";
var brickColor2 = "#D85218";
var brickColor3 = "#D81818";
var brickLives = 3;

//hold bricks in two dimensional array
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
	//create column arrays
	bricks[c] = [];
	for(r=0; r<brickRowCount; r++) {
		//add bricks to the row for each column
		bricks[c][r] = { x: 0, y: 0, status: brickLives, color: brickColor1 };
	}
}

//function to draw bricks
function drawBricks() {
	for(c=0; c<brickColumnCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			if(bricks[c][r].status > 0) {
				//setup brick position values based on column and row index
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				//set x and y positions for collision detection
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				//draw brick
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = bricks[c][r].color;
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

/* random hex color generator
//setup function to randomly generate a hex color
function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random()*16)];
	}
	return color;
}
*/

//function to cycle through rgb colors
function getRGB() {
	var colors = ["#ff0000", "#00ff00", "#0000ff"];
	if (colorIdx < colors.length - 1) {
		colorIdx+=1;
	} else {
		colorIdx = 0;
	}
	return colors[colorIdx];
}

//setup ball
function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
}

//setup paddle
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = paddleColor;
	ctx.fill();
	ctx.closePath();
}

//add event listeners for key presses and mouse movement
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//add create key handler functions
function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
	}
	if(e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
	}
	if(e.keyCode == 37) {
		leftPressed = false;
	}
}

//anchor paddle movement to mouse movement
function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
		paddleX = relativeX - paddleWidth/2;
	}
}

function brickHit(b) {
	b.status -= 1;
	if (b.status == 2) {
		b.color = brickColor2;
	} else if (b.status == 1) {
		b.color = brickColor3;
	}
	ballColor = getRGB();
	score+=1;
	if(score==brickRowCount*brickColumnCount*brickLives) {
		document.location.reload();
		alert("You Win! Press ok to play again");
	}
}

function collisionDetection() {
	for(c=0; c<brickColumnCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			//use b variable for easier readability
			var b = bricks[c][r];
			if(b.status > 0) {
				if(x > b.x - ballRadius &&
				   x < b.x + brickWidth + ballRadius && 
				   y > b.y - ballRadius && 
				   y < b.y + brickHeight + ballRadius) {
					if (y > b.y && y < b.y + brickHeight) {
						dx = -dx;
					} else {
						dy = -dy;
					}
					brickHit(b);
				}
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

//setup draw function for animations
function draw() {
	//clear canvas before every frame
	ctx.clearRect(0,0,canvas.width, canvas.height);
	//draw functions
	drawBricks();
	drawBall();
	drawPaddle();
	collisionDetection();
	drawScore();
	drawLives();

	//check ball for collision with wall and reverse direction if so
	if((x+dx < ballRadius) || (x+dx > canvas.width - ballRadius)) {
		dx = -dx;
	}
	if(y+dy < ballRadius) {
		dy = -dy;
	} else if(y+dy > canvas.height-paddleHeight-ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			//alert("Game Over. Reload to try again");
			lives--;
			if(!lives) {
				document.location.reload();
				alert("Game Over. Play again?");
			} else {
				//reset starting positions
				x = canvas.width/2;
				y = canvas.height-30;
				dx = 4;
				dy = -4;
				paddleX = (canvas.width-paddleWidth)/2;
			}
		}
	}

	//move paddle
	if(rightPressed && paddleX < (canvas.width-paddleWidth)) {
		paddleX += 5;
	}
	else if(leftPressed && paddleX > 0) {
		paddleX -= 5;
	}

	//auto play if set to true
	if (autoPlay) {
		paddleX = x - paddleWidth/2;
	}

	//increment position
	x += dx;
	y += dy;

	//have draw call itself
	requestAnimationFrame(draw);
}

//run draw function with time interval in ms
//setInterval(draw, 10);
draw();