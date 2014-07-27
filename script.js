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