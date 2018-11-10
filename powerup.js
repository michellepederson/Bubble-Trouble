
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object

function powerUp(descr) {
	this.setup(descr);
};

powerUp.prototype = new Entity();
// Initial, inheritable, default values
powerUp.prototype.cx;
powerUp.prototype.cy;
powerUp.prototype.velX = 0;
powerUp.prototype.velY = 3;
powerUp.prototype.isPowerON = false;
powerUp.prototype.NOMINAL_GRAVITY = 0.12;
powerUp.prototype.radius = 20;

powerUp.prototype.update = function (du) {
	spatialManager.unregister(this);
	if (this._isDeadNow) return entityManager.KILL_ME_NOW;
	var prevY = this.cy;
	var nextY = prevY + this.velY*du;

	if (nextY >= g_groundEdge - this.radius) {
		this.velY = 0;
		this.cy = g_groundEdge - this.radius;
	} else {
		this.cy = nextY;
	}
	spatialManager.register(this);
};

/*
powerUp.prototype.getPower = function (nextX,nextY,radius) {

	var prevXX = this.cx;
	var prevYY = this.cy;
	var nextX = prevXX + this.velX;
	var nextY = prevYY + this.velY;
	

	var PlayerDist = util.distSq(nextX, nextY, prevXX, prevYY);
	var limit = util.square(20 + radius);
		
	if(limit < PlayerDist){
		powerUp.prototype.isPowerON = true;
	}

	return powerUp.prototype.isPowerON;
};
*/

powerUp.prototype.isPowerUp = function() {
	return true;
}

powerUp.prototype.getRadius = function() {
	return this.radius;
}

powerUp.prototype.render = function (ctx) {
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.arc(this.cx,this.cy,this.radius,0,2*Math.PI);
	ctx.fill();
	//console.log(this.cx, this.cy);
};

