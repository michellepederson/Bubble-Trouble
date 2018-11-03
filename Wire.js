
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Wire(descr) {

        // Common inherited setup logic from Entity
    this.setup(descr);
    /*
    for (var property in descr) {
        this[property] = descr[property];
    } 
    */
};
Wire.prototype = new Entity();
// Initial, inheritable, default values
Wire.prototype.velY = -6;
Wire.prototype.radius = 2;

Wire.prototype.update = function (du) {

    spatialManager.unregister(this);
    if(this._isDeadNow){
        return -1;
    }
    
    this.cy += this.velY*du;
    
    // If "wire" crosses top edge of canvas
              
    if (this.cy <= 0) {
        return entityManager.KILL_ME_NOW;
    }
    var hitEntity = this.findHitEntity();
    if (hitEntity){
        var canTakeHit = hitEntity.takeWireHit;
        if (canTakeHit) canTakeHit.call(hitEntity); 
        return entityManager.KILL_ME_NOW;
    }
    
    if(!this._isDeadNow){
         spatialManager.register(this);
    }
   
};

Wire.prototype.takeWireHit = function () {
    this.kill();
};

Wire.prototype.render = function (ctx) {

	ctx.beginPath();
    ctx.arc(this.cx,this.cy,this.radius,0,360, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
	ctx.moveTo(this.cx, this.cy);
	ctx.lineTo(this.cx, 510);
	ctx.stroke();
};
