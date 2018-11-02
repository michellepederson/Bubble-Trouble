"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Balloon(descr) {
        // Common inherited setup logic from Entity
    this.setup(descr);
    /*
    for (var property in descr) {
        this[property] = descr[property];
    } 
    */
    this.sprite = this.sprite || g_sprites.bubble;
    this.scale  = this.scale  || 1;
};

Balloon.prototype = new Entity();
// Initial, inheritable, default values
Balloon.prototype.cx = 150;
Balloon.prototype.cy = 40;
Balloon.prototype.radius = 30;
Balloon.prototype.velX = -2;
Balloon.prototype.velY = 1;
Balloon.prototype.direction = 1;

var NOMINAL_GRAVITY = 0.12;

Balloon.prototype.update = function (du) {

    spatialManager.unregister(this);
    if(this._isDeadNow){
        return -1;
    }
    var prevX = this.cx;
    var prevY = this.cy;
    var nextX = prevX + this.velX;
    var nextY = prevY + this.velY;
    
    //Balloon ground - ceiling and wall collisions 
    if(nextY > entityManager._blocks[0].cy - this.radius/2){
        this.velY *= -1;
    }
    if(nextX <= this.radius/2){
        this.velX *= -1;
    }
    if(nextX >= g_canvas.width-this.radius/2){
        this.velX *= -1;
    }
    if(nextY <= this.radius/2){
       return entityManager.KILL_ME_NOW;
    }
    var accelY = NOMINAL_GRAVITY*du;
    this.applyAccel(accelY, du);
    
    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};


Balloon.prototype.takeWireHit = function () {
    this.kill();
  if (this.scale > 0.25) {
        this._spawnFragment();
        this._spawnFragment();
    }
};

Balloon.prototype._spawnFragment = function () {

    this.direction *= -1;
    var dir = this.velX

    entityManager.generateBalloon({
        cx : this.cx,
        cy : this.cy,
        //radius: radius
        scale: this.scale/2,
        velX : this.direction
    });
};


Balloon.prototype.getRadius = function () {
    return this.scale * (this.radius / 2) * 0.9;
};

Balloon.prototype.applyAccel = function(accelY, du) {

     var oldVelY = this.velY;
    
     this.velY += accelY * du; 
 
     var aveVelY = (oldVelY + this.velY) / 2;

    this.cx += du * this.velX;
    this.cy += du * aveVelY;
}

Balloon.prototype.render = function (ctx) {
   
  /*
    ctx.beginPath();
    ctx.arc(this.cx,this.cy,this.radius,0,360, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
*/
    var originalScale = this.sprite.scale;
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};
