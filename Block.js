
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Block(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    } 
};

// Initial, inheritable, default values
Block.prototype.cx = 200;
Block.prototype.cy = 200;
    
Block.prototype.update = function (du) {

};

Block.prototype.render = function (ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.cx - this.halfWidth, this.cy + this.halfHeight, this.halfWidth*2, this.halfHeight*2);
};
