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
// max line draw distance (pixels)
// does not scale because it is relative to canvas + dpr
let maxrange = 110;
// set speed (pixels / second)
let speedfactor = 15;
let maxspeed = Math.floor(maxrange) + speedfactor * 5;
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
			points[i] = new newObject();
			points[i].initpoint();
		};
		initMouseLoc();
	};
};

function newObject() {
	// init variables (code 100% not stolen from previous thing)
	this.info = [];
	this.neightbors = [];
	let x = 0;
	let y = 0;
	// starting location of dot
	this.initpoint = function() {
		this.info.x = randomNumber(0, ctx.canvas.width);
		this.info.y = randomNumber(0, ctx.canvas.height);
		this.info.angle = randomNumber(1, 360);

		// speed stuff is defined here, radius is a linear regression that has minimum/maximum speed as x and desired radius as y
		this.info.speed = randomNumber(minspeed, maxspeed);
		// magical sauce that scales radius linearly based on speed;
		this.info.radius = (maxradius - minradius) * ((this.info.speed - minspeed) / (maxspeed - minspeed)) + minradius;
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
		if (this.info.x > width || this.info.x < 0 || this.info.y > height  || this.info.y < 0) {
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
			if (dist <=  maxrange || (index == pointcount && dist <= 1.6 * maxrange)) {
				ctx.beginPath();
				ctx.lineWidth = 0.8;
				ctx.strokeStyle = "rgb(254, 254, 255)";
				// makes the cursor's lines more opaque
				let preDefAlpha = -(dist / maxrange) + 1
				if (index == pointcount) {
					preDefAlpha += 0.6;
				};
				ctx.globalAlpha = Math.max(0, Math.min(1, (preDefAlpha)));
				ctx.moveTo(initx, inity);
				ctx.lineTo(c.info.x, c.info.y);
				ctx.stroke();
			}
		});
	}
}

for (i = 0; i < pointcount; i++) {
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
	if (window.matchMedia(`(prefers-reduced-motion: reduce)`) === false || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === false) {
		pointcount += 5;
		for (i = pointcount - 5; i < pointcount; i++) {
			points[i] = new newObject();
			points[i].initpoint();
			points[i].info.x = mouseX;
			points[i].info.y = mouseY;
		}
		initMouseLoc();
	}
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
