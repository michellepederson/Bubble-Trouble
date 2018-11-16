"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object

function Grenade(descr) {
   this.setup(descr);
   /*
    for (var property in descr) {
        this[property] = descr[property];
    } 
    */
};

Grenade.prototype = new Entity();

// Initial, inheritable, default values
Grenade.prototype.cx = 200;
Grenade.prototype.cy = 200;
Grenade.prototype.velX = 6;
Grenade.prototype.velY = -13;
Grenade.prototype.radius = 15;
Grenade.prototype.NOMINAL_GRAVITY = 0.5;

Grenade.prototype.update = function (du){  
   
    spatialManager.unregister(this);
    if(this._isDeadNow){
        return   -1;
    }
   
    var accelY = Grenade.prototype.NOMINAL_GRAVITY*du;
    var accelX = 0;


    var prevX = this.cx;
    var prevY = this.cy;
    var nextX = prevX + this.velX;
    var nextY = prevY + this.velY;
   
   
    if(nextX <= this.radius/2){
        this.velX *= -1;
    }
    if(nextX >= g_canvas.width-this.radius/2){
        this.velX *= -1;
    }

    if(this.velX > 0){
        this.velX -= 0.1;
    }
    else if(this.velX < 0){
         this.velX += 0.1;
    }
   
    this.applyAccel(accelX,accelY,du);

    var hitEntity = this.findHitEntity();
    hitEntity = spatialManager.findEntityOnGrenade(this);
    if (hitEntity){
        var canTakeHit = hitEntity.takeWireHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        //console.log(this.radius);
            if(this.radius > 70){
                return entityManager.KILL_ME_NOW;
            }
            else{
                this.radius *= 2; 
            }
    }
    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};

Grenade.prototype.render = function (ctx) {
	
	ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(this.cx,this.cy,this.radius,0,360, false);    
    ctx.fill();
    ctx.beginPath();
    //console.log(this.radius);

};


Grenade.prototype.getRadius = function () {
    //return 50; // weird bug
    return this.radius;
};




// Makes the grenade bounce off ground and handles it's gravity.
// Basically copy paste from Patrick's code in entities.
Grenade.prototype.applyAccel = function (accelX, accelY, du) {
    
    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;
    
    // v = u + at
    this.velX += accelX * du;
    this.velY += accelY * du; 

    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;
    
    // Decide whether to use the average or not (average is best!)
    var intervalVelX = g_useAveVel ? aveVelX : this.velX;
    var intervalVelY = g_useAveVel ? aveVelY : this.velY;
    
    // s = s + v_ave * t
    var nextX = this.cx + intervalVelX * du;
    var nextY = this.cy + intervalVelY * du;
    
    // bounce

    var minY = this.radius/ 2;
    var maxY = 510 - minY;

    // Ignore the bounce if the ship is already in
    // the "border zone" (to avoid trapping them there)
    if (this.cy > maxY || this.cy < minY) {
        // do nothing
    } 
    else if (nextY > maxY) {
            this.velY = oldVelY * -0.6;
            intervalVelY = this.velY;
    }
    
    // s = s + v_ave * t
    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

Grenade.prototype.takeGrenadeHit = function () {
    this.kill();
};


