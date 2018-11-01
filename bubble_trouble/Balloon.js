"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Balloon(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    } 
};

// Initial, inheritable, default values
Balloon.prototype.cx = 150;
Balloon.prototype.cy = 40;
Balloon.prototype.radius = 30;
Balloon.prototype.velX = 2;
Balloon.prototype.velY = 1;
    
var NOMINAL_GRAVITY = 0.12;

Balloon.prototype.update = function (du) {
    var accelY = NOMINAL_GRAVITY*du;
    this.applyAccel(accelY, du);
};

Balloon.prototype.applyAccel = function(accelY, du) {

     var oldVelY = this.velY;
    
     this.velY += accelY * du; 
 
     var aveVelY = (oldVelY + this.velY) / 2;

    this.cx += du * this.velX;
    this.cy += du * aveVelY;
}

Balloon.prototype.render = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.cx,this.cy,this.radius,0,360, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
};
