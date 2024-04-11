const canvas = document.getElementById("background-canvas");

let width = window.screen.width;
let height = window.screen.height;
let center = (width/2, height/2);
let ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
let points = [];
// milliseconds
tickrate = 15;
maxrange = 200;

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
};

function newObject() {
	// init variables (code 100% not stolen from previous thing)
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	this.info = [];
	this.neightbors = [];
	let x = 0;
	let y = 0;
	// starting location of dot
	this.reset = function() {
		switch (Math.round(randomNumber(1, 4))) {
			case 1:
				x = 0;
				y = randomNumber(0, height);
				this.info.x = x;
				this.info.y = y;
				this.info.angle = randomNumber(1, 179);
				break;
			case 2:
				x = randomNumber(0, width);
				y = height;
				this.info.x = x;
				this.info.y = y;
				// for bottom side
				switch (Math.round(randomNumber(1, 2))) {
					case 1:
						this.info.angle = randomNumber(271, 359);
						break;
					case 2:
						this.info.angle = randomNumber(0, 89);
						break;
				};
				break;
			case 3:
				x = width;
				y = randomNumber(0, height);
				this.info.x = x;
				this.info.y = y;
				this.info.angle = randomNumber(181, 359);
				break;
			case 4:
				x = randomNumber(0, width);
				y = 0;
				this.info.x = x;
				this.info.y = y;
				this.info.angle = randomNumber(91, 269);
				break;
		}
		// speed stuff is defined here, radius is a linear regression that has minimum/maximum speed as x and desired radius as y
		this.info.speed = randomNumber(10, 175);
		// magical regression sauce that scales radius from 0.3 to 1.3 based on speed (10 to 175)
		this.info.radius = 0.00606061 * this.info.speed + 0.239394;
	}

	this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.info.x, this.info.y, this.info.radius, 0, 2*Math.PI, false);
        ctx.lineWidth = this.info.radius * 2;
		ctx.globalAlpha = 1;
        ctx.fillStyle = "rgb(162, 162, 163)";
        ctx.strokeStyle = "rgb(162, 162, 163)";
        ctx.stroke();
		ctx.fill();
    }

	this.update = function() {
		// set out of bounds to add maxrange to improve smoothness
		if (this.info.x > width + 20 || this.info.x < 0 - 20 || this.info.y > height + 20 || this.info.y < 0 - 20) {
			this.reset()
		}
		// ticks per second
		let tps = tickrate / 1000
		// Man idk what i'm doing idk trig
		if (0 <= this.info.angle && 90 > this.info.angle) {
			// neg y pos x
			this.info.x += (this.info.speed * Math.cos(Math.abs(this.info.angle))) * tps;
			this.info.y += (-this.info.speed * Math.sin(Math.abs(this.info.angle))) * tps;
		} else if (90 <= this.info.angle && 180 > this.info.angle) {
			// pos y pos x
			this.info.x += (this.info.speed * Math.cos(Math.abs(this.info.angle))) * tps;
			this.info.y += (this.info.speed * Math.sin(Math.abs(this.info.angle))) * tps;
		} else if (180 <= this.info.angle && 270 > this.info.angle) {
			// pos y neg x
			this.info.x += (-this.info.speed * Math.cos(Math.abs(this.info.angle))) * tps;
			this.info.y += (this.info.speed * Math.sin(Math.abs(this.info.angle))) * tps;
		} else if (270 <= this.info.angle && 360 >= this.info.angle) {
			// neg y neg x
          	this.info.x += (-this.info.speed * Math.cos(Math.abs(this.info.angle))) * tps;
			this.info.y += (-this.info.speed * Math.sin(Math.abs(this.info.angle))) * tps;
		}
	}

	this.net = function() {
		let initx = this.info.x;
		let inity = this.info.y;
		points.forEach(function(c){
			let dist =  Math.sqrt((Math.abs(initx) - Math.abs(c.info.x)) ** 2 + (Math.abs(inity) - Math.abs(c.info.y)) ** 2);
			if (dist < maxrange) {
				ctx.beginPath();
				ctx.lineWidth = 0.5;
				ctx.strokeStyle = "rgb(162, 162, 163)";
				ctx.globalAlpha = Math.max(0, Math.min(1, (-0.00606061 * dist + 1.06061)));
				ctx.moveTo(initx, inity);
				ctx.lineTo(c.info.x, c.info.y);
				ctx.stroke();
			}
		});
	}
}

function background() {
    ctx.fillStyle = "rgb(27, 27, 30)"
    ctx.strokeStyle = "rgb(27, 27, 30)";
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();
    ctx.fill();
};

for (i = 0; i<150; i++) {
    points[i] = new newObject();
	points[i].reset();
}

setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
   	points.forEach(function(b) {
        b.update();
        b.draw();
    });
	// for the actual lines
	points.forEach(function(d) {
		d.net()
	});
}, 15);
