// spaghetthi that sets up page
let width = window.screen.width;
let height = window.screen.height;
let center = (width/2, height/2);

// style and create container for canvas
container = document.getElementById("background-container");
c = document.createElement("canvas");
c.id = "background-canvas";
container.appendChild(c);
container.style.margin = "0";
container.style.overflow = "hidden";
container.style.position = "fixed";
container.style.top = "0";
container.style.left = "0";

// canvas context
const canvas = document.getElementById("background-canvas");
let ctx = canvas.getContext("2d");
let dpr = window.devicePixelRatio || 1;
ctx.canvas.width = width * dpr;
ctx.canvas.height = height * dpr;
ctx.canvas.style.background = "rgb(27, 27, 30)";
ctx.imageSmoothingEnabled = true;
let points = [];

// scales points to scale based on average dimensions of screen
// stops working after around 10000
// i'm starting to think that this should have just been square or linear
// https://www.desmos.com/calculator/dcrnwgb2ju
let pointcount = Math.round(-0.0000062638 * (((canvas.width + canvas.height) / (2 * dpr)) ** 2) + 0.159716 * ((canvas.width + canvas.height) / (2 * dpr)) + 13.4925);
let mouseX = 0;
let mouseY = 0;

// quick fix that disables net if prefers-reduced-motion is on
if (window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true) {
	pointcount = 0;
}

// customizable values
// in ms
let tickrate = 15;

// ticks per second
let tps = tickrate / 1000

// max line draw distance (pixels)
// does not scale because it is relative to canvas + dpr
let maxrange = 100;

// set speed (pixels / second)
let speedfactor = 15;
let maxspeed = Math.floor(maxrange) + speedfactor * 10;
let minspeed = speedfactor;

// set radius (pixels)
let maxradius = 1.3;
let minradius = 0.3;

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
};

onresize = (event) => {
	width = window.innerWidth;
	height = window.innerHeight;
	center = (width/2, height/2);
	ctx.canvas.width = window.innerWidth * dpr;
	ctx.canvas.height = window.innerHeight * dpr;

	pointcount = Math.round(-0.0000062638 * (((canvas.width + canvas.height) / (2 * dpr)) ** 2) + 0.159716 * ((canvas.width + canvas.height) / (2 * dpr)) + 13.4925);
	if (window.matchMedia(`(prefers-reduced-motion: reduce)`) === false || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === false) {
		points = [];
		for (i = 0; i < pointcount; i++) {
			points[i] = new dot();
			points[i].initpoint();
		};
		initMouseLoc();
	};
};

function dot() {
	// init variables (code 100% not stolen from previous thing)
	this.neightbors = [];
	let x = 0;
	let y = 0;
	// starting location of dot
	this.initpoint = function() {
		this.x = randomNumber(0, ctx.canvas.width);
		this.y = randomNumber(0, ctx.canvas.height);
		this.angle = randomNumber(1, 360);

		// speed stuff is defined here, radius is a linear regression that has minimum/maximum speed as x and desired radius as y
		this.speed = randomNumber(minspeed, maxspeed);
		// magical sauce that scales radius linearly based on speed;
		this.radius = (maxradius - minradius) * ((this.speed - minspeed) / (maxspeed - minspeed)) + minradius;

		this.dx = this.speed * tps * Math.cos(this.angle);
		this.dy = this.speed * tps * Math.sin(this.angle);
	};

	this.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
		ctx.lineWidth = this.radius * 2;
		ctx.globalAlpha = 1;
		ctx.fillStyle = "rgb(162, 162, 163)";
		ctx.strokeStyle = "rgb(162, 162, 163)";
		ctx.stroke();
		ctx.fill();
	};

	this.update = function() {
		// set out of bounds to add maxrange to improve smoothness
		if (this.x > width || this.x < 0 || this.y > height  || this.y < 0) {
			this.initpoint()
		};

		// The last version of this was way too complicated jeez
		this.x += this.dx;
		this.y += this.dy;
	};

	this.net = function() {
		let initx = this.x;
		let inity = this.y;
		let floorinitx = Math.floor(initx);
		let floorinity = Math.floor(inity);

		points[pointcount].x = mouseX;
		points[pointcount].y = mouseY;

		ctx.lineWidth = 0.8 * dpr;

		points.forEach(function(c, index) {
			let newpointx = c.x;
			let newpointy = c.y;
			let floornewpointx = Math.floor(c.x);
			let floornewpointy = Math.floor(c.y);


			let dist =  Math.sqrt((initx - newpointx) ** 2 + (inity - newpointy) ** 2);
			if (dist <=  maxrange || (index == pointcount && dist <= 1.6 * maxrange)) {

				ctx.beginPath();

				// makes the cursor's lines more opaque
				let preDefAlpha = 1 - (dist / maxrange);
				if (index == pointcount) {
					preDefAlpha += 0.6;
				};
				alpha = Math.max(0, Math.min(1, (preDefAlpha)));

				ctx.strokeStyle = `rgb(254, 254, 255, ${alpha})`;

				ctx.moveTo(initx, inity);
				ctx.lineTo(newpointx, newpointy);
				ctx.stroke();
			}; // draw line
		}); // point iteration
	};
};

for (i = 0; i < pointcount; i++) {
    points[i] = new dot();
	points[i].initpoint();
}

// handles with treating mouse as a point
document.addEventListener("mousemove", logKey);
function logKey(e) {
	mouseX = e.clientX;
	mouseY = e.clientY;
}

document.addEventListener("click", (e) => {
	if (window.matchMedia(`(prefers-reduced-motion: reduce)`) === false || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === false) {
		pointcount += 5;
		for (i = pointcount - 5; i < pointcount; i++) {
			points[i] = new dot();
			points[i].initpoint();
			points[i].x = mouseX;
			points[i].y = mouseY;
		}
		initMouseLoc();
	}
});

// reinitialize mouse in array at end after click
function initMouseLoc() {	
	points[pointcount] = new dot();
	points[pointcount].x = mouseX;
	points[pointcount].y = mouseY;
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
