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

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
};

function newObject() {
	// init variables (code 100% not stolen from previous thing)
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	this.info = [];
	this.neightbors = [];
	// starting location of dot
	this.reset = function() {
		switch(Math.round(randomNumber(1, 4)) {
			case 1:
				let x = 0;
				let y = randomNumber(0, height);
				this.info.x = x;
				this.info.y = y;
				this.info.angle = randomNumber(1, 179);
				break;
			case 2:
				let x = randomNumber(0, width);
				let y = height;
				this.info.x = x;
				this.info.y = y;
				// for bottom side
				switch(Math.round(randomNumber(1, 2)) { case 1: this.info.angle = randomNumber(271, 359); break; case 2: this.info.angle = randomNumber(0, 89); break; }
				break;
			case 3:
				let x = width;
				let y = randomNumber(0, height);
				this.info.x = x;
				this.info.y = y;
				this.info.angle = randomNumber(181, 359);
				break;
			case 4:
				let x = randomNumber(0, width);
				let y = 0;
				this.info.x = x;
				this.info.y = y;
				this.info.angle = randomNumber(91, 269);
				break;
		}
		this.info.speed = randomNumber(20, 200);
		// magical regression sauce that scales radius from 1 to 2 based on speed (20 to 200)
		this.info.radius = 0.00555556 * this.info.speed + 0.888889;
	}

	this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.ctx_array[0], this.ctx_array[1], this.info.radius, 0, 2*Math.PI, false);
        ctx.lineWidth = 5;
        ctx.fillStyle = "rgb(183, 183, 183)";
        ctx.fill();
        ctx.strokeStyle = "rgb(183, 183, 183)";
        ctx.stroke();
    }

	this.update = function() {
		// Man idk what i'm doing idk trig
		if (0 <= this.info.angle && 90 > this.info.angle) {
			// neg y pos x
			this.info.x = this.info.speed * Math.cos(Math.abs(this.info.angle);
			this.info.y = -this.info.speed * Math.sin(Math.abs(this.info.angle);
		} else if (90 <= this.info.angle && 180 > this.info.angle) {
			// pos y pos x
            this.info.x = this.info.speed * Math.cos(Math.abs(this.info.angle);
			this.info.y = this.info.speed * Math.sin(Math.abs(this.info.angle);
		} else if (180 <= this.info.angle && 270 > this.info.angle) {
			// pos y neg x
            this.info.x = -this.info.speed * Math.cos(Math.abs(this.info.angle);
			this.info.y = this.info.speed * Math.sin(Math.abs(this.info.angle);
		} else if (270 <= this.info.angle && 360 >= this.info.angle) {
			// neg y neg x
            this.info.x = -this.info.speed * Math.cos(Math.abs(this.info.angle);
			this.info.y = -this.info.speed * Math.sin(Math.abs(this.info.angle);
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

setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
    /* points.forEach(function(b) {
        b.updatePos();
        b.draw();
    }); */
}, 15);
