// Ball object     
ball = {
	x: 50,
	y: 50, 
	r: 5,
	c: "white",
	vx: 4,
	vy: 8,
	
	// Function for drawing ball on canvas
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}
};
// Start Button object
keyboardChoiceBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 25,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Keyboard", W/2, (H/2) - 60 );
	}
};

mouseChoiceBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 85,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Mouse", W/2, H/2 );
	}
};
// Restart Button object
restartBtn = {
	w: 100,
	h: 50,
	x: W/2 - 50,
	y: H/2 - 50,
	
	draw: function() {
		ctx.strokeStyle = "white";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("Restart", W/2, H/2 - 25 );
	}
};
// Function to update positions, score and everything.
// Basically, the main game logic is defined here
function update() {
	
// Update scores
updateScore(); 

// Move the paddles on mouse move


if (mouseOrKeyboard == "mouse"){
	if(mouse.x && mouse.y) {
		for(var i = 1; i < paddles.length; i++) {
			p = paddles[i];
			p.x = mouse.x - p.w/2;
		}		
	}
} else if (mouseOrKeyboard == "key") {
	
	if (37 in keysDown) { // Player holding left
		for(var i = 1; i < paddles.length; i++) {
			p = paddles[i];
			p.x = p.x - 10;
		}
	}
	if (39 in keysDown) { // Player holding right
		for(var i = 1; i < paddles.length; i++) {
			p = paddles[i];
			p.x = p.x + 10;
		}
	}
}


//Do this when collides == true
function collideAction(ball, p) {
	ball.vy = -ball.vy;
	ballColor = '#'+Math.floor(Math.random()*16777215).toString(16);
	if(paddleHit == 1) {
		ball.y = p.y - p.h;
		particlePos.y = ball.y + ball.r;
		multiplier = -1;	
	}
	
	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
		particlePos.y = ball.y - ball.r;
		multiplier = 1;	
	}
	
	points++;
	increaseSpd();
	
	if(collision) {
		if(points > 0) 
			collision.pause();
			
		collision.currentTime = 0;
		collision.play();
	}
	
	particlePos.x = ball.x;
	flag = 1;
}

// Function for emitting particles
function emitParticles() { 	
	for(var j = 0; j < particles.length; j++) {
		par = particles[j];		
		ctx.beginPath(); 
		ctx.fillStyle = ballColor;
		if (par.radius > 0) {
			ctx.arc(par.x, par.y, par.radius, 0, Math.PI*2, false);
		}
		ctx.fill();	 
		
		par.x += par.vx; 
		par.y += par.vy; 
		
		// Reduce radius so that the particles die after a few seconds
		par.radius = Math.max(par.radius - 0.05, 0.0); 		
	} 
}

// Function for updating score
function updateScore() {
	ctx.fillStlye = "white";
	ctx.font = "16px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + points, 20, 20 );
}

var mouseOrKeyboard = "none";                                             

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();



// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"), // Create canvas context --!>
		W = window.innerWidth, // Window's width
		H = window.innerHeight, // Window's height
		particles = [], // Array containing particles
		ball = {}, // Ball object
		paddles = [2], // Array containing two paddles
		mouse = {}, // Mouse object to store it's current position
		points = 0, // Varialbe to store points
		fps = 60, // Max FPS (frames per second)
		particlesCount = 30, // Number of sparks when ball strikes the paddle
		flag = 0, // Flag variable which is changed on collision
		particlePos = {}, // Object to contain the position of collision 
		multipler = 1, // Varialbe to control the direction of sparks
		startBtn = {}, // Start button object
		restartBtn = {}, // Restart button object
		over = 0, // flag varialbe, cahnged when the game is over
		init, // variable to initialize animation
		paddleHit;
		
// Background image
var ballColor = "white";
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "bg.jpg";

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Initialise the collision sound
collision = document.getElementById("collide");

// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;

// Function to paint canvas
function paintCanvas() { 
	 ctx.drawImage(bgImage, 0, 0, W,H);

}

// Function for creating paddles
function Paddle(pos) {
	// Height and width
	this.h = 5;
	this.w = 150;
	
	// Paddle's position
	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 0 : H - this.h;
	
}

// Push two new paddles into the paddles[] array
paddles.push(new Paddle("bottom"));
paddles.push(new Paddle("top")); 

