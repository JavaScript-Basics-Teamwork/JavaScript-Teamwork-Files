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



