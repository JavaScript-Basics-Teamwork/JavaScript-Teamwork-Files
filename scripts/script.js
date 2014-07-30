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

var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		W = window.innerWidth, 
		H = window.innerHeight, 
		particles = [],
		ball = {},
		paddles = [2], 
		mouse = {}, 
		points = 0, 
		fps = 60, 
		particlesCount = 30, 
		flag = 0, 
		particlePos = {}, 
		multipler = 1, 
		startBtn = {}, 
		restartBtn = {}, 
		over = 0, 
		init, 
		paddleHit;
		
var ballColor = "white";
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "bg.jpg";

canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

collision = document.getElementById("collide");

canvas.width = W;
canvas.height = H;

function paintCanvas() { 
	 ctx.drawImage(bgImage, 0, 0, W,H);
}

function Paddle(pos) {
	this.h = 5;
	this.w = 150;
	
	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 0 : H - this.h;
	
}

paddles.push(new Paddle("bottom"));
paddles.push(new Paddle("top"));

ball = {
	x: 50,
	y: 50, 
	r: 5,
	c: "white",
	vx: 4,
	vy: 8,
	
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}
};


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

function createParticles(x, y, m) {
	this.x = x || 0;
	this.y = y || 0;
	
	this.radius = 3.2;
	
	this.vx = (Math.random()*1.5 + Math.random()*3);
	this.vy = m * Math.random()*15.5;
	

}

function draw() {
	paintCanvas();
	for(var i = 0; i < paddles.length; i++) {
		p = paddles[i];
		
		ctx.fillStyle = "white";
		ctx.fillRect(p.x, p.y, p.w, p.h);
	}

	
	ball.draw();
	update();
}

function increaseSpd() {
	if(points % 4 == 0) {
		if(Math.abs(ball.vx) < 15) {
			ball.vx += (ball.vx < 0) ? -1 : 1;
			ball.vy += (ball.vy < 0) ? -2 : 2;
		}
	}
}

function trackPosition(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}

function update() {
	
	updateScore(); 
	

	if (mouseOrKeyboard == "mouse"){
		if(mouse.x && mouse.y) {
			for(var i = 1; i < paddles.length; i++) {
				p = paddles[i];
				p.x = mouse.x - p.w/2;
			}		
		}
	} else if (mouseOrKeyboard == "key") {
		
		if (37 in keysDown) {
			for(var i = 1; i < paddles.length; i++) {
				p = paddles[i];
				p.x = p.x - 10;
			}
		}
		if (39 in keysDown) {
			for(var i = 1; i < paddles.length; i++) {
				p = paddles[i];
				p.x = p.x + 10;
			}
		}
	}

	

	
	
	ball.x += ball.vx;
	ball.y += ball.vy;
	
	p1 = paddles[1];
	p2 = paddles[2];
	
	if(collides(ball, p1)) {
		collideAction(ball, p1);
	}
	
	
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
	} 
	
	else {
	
		if(ball.y + ball.r > H) {
			ball.y = H - ball.r;
			gameOver();
		} 
		
		else if(ball.y < 0) {
			ball.y = ball.r;
			gameOver();
		}
		
		if(ball.x + ball.r > W) {
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
	
	
	
	if(flag == 1) { 
		for(var k = 0; k < particlesCount; k++) {
			particles.push(new createParticles(particlePos.x, particlePos.y, multiplier));
		}
	}	
	
	emitParticles();
	
	flag = 0;
}
	ball.x += ball.vx;
	ball.y += ball.vy;
	
	p1 = paddles[1];
	p2 = paddles[2];
	
	if(collides(ball, p1)) {
		collideAction(ball, p1);
	}
	
	
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
	} 
	
	else {
		
		if(ball.y + ball.r > H) {
			ball.y = H - ball.r;
			gameOver();
		} 
		
		else if(ball.y < 0) {
			ball.y = ball.r;
			gameOver();
		}
		
		if(ball.x + ball.r > W) {
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
	
	
	
	if(flag == 1) { 
		for(var k = 0; k < particlesCount; k++) {
			particles.push(new createParticles(particlePos.x, particlePos.y, multiplier));
		}
	}	
	
	emitParticles();
	
	flag = 0;




function collides(b, p) {
	if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
		if(b.y >= (p.y - p.h) && p.y > 0){
			paddleHit = 1;
			return true;
		}
		
		else if(b.y <= p.h && p.y == 0) {
			paddleHit = 2;
			return true;
		}
		
		else return false;
	}
}

function collides(b, p) {
	if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
		if(b.y >= (p.y - p.h) && p.y > 0){
			paddleHit = 1;
			return true;
		}
		
		else if(b.y <= p.h && p.y == 0) {
			paddleHit = 2;
			return true;
		}
		
		else return false;
	}
}

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
		
		par.radius = Math.max(par.radius - 0.05, 0.0); 
		
	} 
}

function updateScore() {
	ctx.fillStlye = "white";
	ctx.font = "16px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + points, 20, 20 );
}

function gameOver() {
	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over - You scored "+points+" points!", W/2, H/2 + 25 );
	
	cancelRequestAnimFrame(init);
	
	over = 1;
	
}

function animloop() {

	init = requestAnimFrame(animloop);
	draw();
}

function startScreen() {
	draw();
	keyboardChoiceBtn.draw();
	mouseChoiceBtn.draw();
}

function btnClick(e) {
	
	var mx = e.pageX,
			my = e.pageY;

	console.log(" mouse coords: " + mx + ' ' + my);
	console.log(" mouseBtn coords: " + mouseChoiceBtn.x + ' ' + mouseChoiceBtn.y);
	console.log(" keyboard coords: " + keyboardChoiceBtn.x + ' ' + keyboardChoiceBtn.y);


	document.getElementById('cover').style.display = "block";
	
	ball.x = 20;
	ball.y = 20;
	points = 0;
	ball.vx = 2;
	ball.vy = 4;
	animloop();
	
	over = 0;
	
}

function setControls (val) {
	mouseOrKeyboard = val;
	animloop();
	keyboardChoiceBtn = {};
	mouseChoiceBtn = {};
	document.getElementById('cover').style.display = "none";
}



startScreen();
