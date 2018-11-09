
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object


function powerUp(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
};

/*
function Player(descr) {

// Common inherited setup logic from Entity
this.setup(descr);


};
*/

// Initial, inheritable, default values
powerUp.prototype.cx;
powerUp.prototype.cy;
powerUp.prototype.velX = 0;
powerUp.prototype.velY = 0;
powerUp.prototype.isPowerON = false;
powerUp.prototype.NOMINAL_GRAVITY = 0.12;
powerUp.prototype.radius = 20;

powerUp.prototype.update = function (du) {
 
	var prevX = this.cx;
	var prevY = this.cy;
	var nextX = prevX + this.velX;
	var nextY = prevY + this.velY;
	//console.log(prevX,prevY);

	if (nextY >= 510) {
		if(nextY >= 510 + this.radius){
			 return entityManager.KILL_ME_NOW;
		}
		else{
			this.velY = 0;
		}
    }
   // this.getPower();
	var accelY = this.NOMINAL_GRAVITY*du;
	this.applyAccel(accelY, du);
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
powerUp.prototype.render = function (ctx) {
	
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.arc(this.cx,this.cy,20,0,2*Math.PI);
	ctx.fill();
	//console.log(this.cx, this.cy);
};

powerUp.prototype.applyAccel = function(accelY, du) {

    var oldVelY = this.velY;
    
    this.velY += accelY * du; 
 
    var aveVelY = (oldVelY + this.velY) / 2;

    this.cx += du * this.velX;
    this.cy += du * aveVelY;
}

