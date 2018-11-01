
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Wire(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    } 
};

// Initial, inheritable, default values
Wire.prototype.velY = -2;
Wire.prototype.radius = 2;
    
Wire.prototype.update = function (du) {
    this.cy += this.velY*du;

    // If "wire" crosses top edge of canvas
    if (this.cy <= 0) {
        return entityManager.KILL_ME_NOW;
    }
};


Wire.prototype.render = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.cx,this.cy,this.radius,0,360, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
};
