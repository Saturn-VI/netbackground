// spaghetthi that sets up page
container = document.getElementById("background-container");
canv = document.createElement("canvas");
canv.id = "background-canvas";
container.appendChild(canv);
container.style.height = "100%";
container.style.width = "100%";
container.style.margin = "0";
container.style.overflow = "hidden";
container.style.position = "fixed";
container.style.top = "0";
container.style.left = "0";

const canvas = document.getElementById("background-canvas");

let width = window.screen.width;
let height = window.screen.height;
let center = (width/2, height/2);
let ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.canvas.style.background = "rgb(27, 27, 30)";
let points = [];
// milliseconds
tickrate = 15;
maxrange = 150;
pointcount = 325;
let mouseX = 0;
let mouseY = 0;

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
};

onresize = (event) => {
	width = window.screen.width;
	height = window.screen.height;
	center = (width/2, height/2);
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
};

function newObject() {
	// init variables (code 100% not stolen from previous thing)
	this.info = [];
	this.neightbors = [];
	let x = 0;
	let y = 0;
	// starting location of dot
	this.initpoint = function() {
		this.info.x = randomNumber(0, width);
		this.info.y = randomNumber(0, height);
		// i know this line will have like slightly more going straight up but i Do Not Care
		this.info.angle = randomNumber(1, 360);

		// speed stuff is defined here, radius is a linear regression that has minimum/maximum speed as x and desired radius as y
        	this.info.speed = randomNumber(30, 200);
        	// magical regression sauce that scales radius from 0.3 to 1.3 based on speed (20 to 175)
        	this.info.radius = 0.00774194 * this.info.speed - 0.0548387;
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
		if (this.info.x > width + maxrange / 2 || this.info.x < 0 - maxrange / 2 || this.info.y > height + maxrange / 2 || this.info.y < 0 - maxrange / 2) {
			this.initpoint()
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
		points[pointcount].info.x = mouseX;
		points[pointcount].info.y = mouseY;
		points.forEach(function(c, index){
			let dist =  Math.sqrt((Math.abs(initx) - Math.abs(c.info.x)) ** 2 + (Math.abs(inity) - Math.abs(c.info.y)) ** 2);
			if (dist < maxrange) {
				ctx.beginPath();
				ctx.lineWidth = 0.2;
				ctx.strokeStyle = "rgb(254, 254, 255)";
				// makes the cursor's lines more opaque
				let preDefAlpha = -0.00666667 * dist + 1
				if (index == pointcount) {
					preDefAlpha += 0.5;
				};
				ctx.globalAlpha = Math.max(0, Math.min(1, (preDefAlpha)));
				ctx.moveTo(initx, inity);
				ctx.lineTo(c.info.x, c.info.y);
				ctx.stroke();
			}
		});

		// this part adds the mouse and I don't want to deal with adding it to the array of points
		// TODO: deal with it (add as final element of array by setting
	}
}

for (i = 0; i<pointcount; i++) {
    points[i] = new newObject();
	points[i].initpoint();
}

// handles with treating mouse as a point
document.addEventListener("mousemove", logKey);
function logKey(e) {
	mouseX = e.clientX;
	mouseY = e.clientY;
}

document.addEventListener("click", (e) => {
	pointcount += 5;
	for (i = pointcount - 5; i < pointcount; i++) {	
		points[i] = new newObject();
		points[i].initpoint();
		points[i].info.x = mouseX;
		points[i].info.y = mouseY;
	}
	initMouseLoc();
});

// reinitialize mouse in array at end after click
function initMouseLoc() {	
	points[pointcount] = new newObject();
	points[pointcount].info.x = mouseX;
	points[pointcount].info.y = mouseY;
};

initMouseLoc();

setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   	points.forEach(function(b) {
        b.update();
        b.draw();
    });
	// for the actual lines
	points.forEach(function(d) {
		d.net()
	});
}, 15);
