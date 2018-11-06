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
var KEY_GRAVITY = keyCode('G');

Balloon.prototype.cx = 150;
Balloon.prototype.cy = 150;
Balloon.prototype.radius = 30;
Balloon.prototype.velX = -2;
Balloon.prototype.velY = 1;
Balloon.prototype.direction = 1;
Balloon.prototype.orbit = false;
Balloon.prototype.NOMINAL_GRAVITY = 0.12;

Balloon.prototype.update = function (du) {

    spatialManager.unregister(this);
    if(this._isDeadNow){
        return -1;
    }
    var prevX = this.cx;
    var prevY = this.cy;
    var nextX = prevX + this.velX;
    var nextY = prevY + this.velY;
   

    // Simple collision detection to keep the bubbles inside the canvas 
    // Lines 45-60 i'd like to be in a function below (notOrbit).
    if(this.orbit === false){
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
            if(Balloon.orbit){
        }
        else{
            return entityManager.KILL_ME_NOW;
        }
    }
    }

    if(eatKey(KEY_GRAVITY)){
        Balloon.orbit =  !Balloon.orbit;
    }
    
    if(Balloon.orbit){
        this.gravityOn();
    }
    else{
        Balloon.NOMINAL_GRAVITY = 0.12;
        var accelY = Balloon.NOMINAL_GRAVITY*du;
        this.applyAccel(accelY, du);
    }
       

    
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

    entityManager.generateBalloon({
        cx : this.cx,
        cy : this.cy,
        scale: this.scale/2,
        radius: this.radius*this.scale,
        velX : this.direction,
        velY : -5.5
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
   
    if(Balloon.orbit){
        this.drawBlackHole();
    }
    var originalScale = this.sprite.scale;
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};

// planetX/Y - the black hole
var planetX = 300;
var planetY = 200;
Balloon.prototype.earthSpeed = 0.02;
Balloon.prototype.earthRadians = 20;
Balloon.prototype.dist = 220;

Balloon.prototype.gravityOn = function(){

    if(this.earthRadians < (Math.PI * 2)){
        this.earthRadians += this.earthSpeed;
    }
    else{
        this.earthRadians = 0;
    }
    this.setEarthPosition();
}
//Make the bubbles orbit like earths/panets around the black hole (PlanetX/Y)
//This part looks kind of jerky and needs some improvement, but I like the idea...
Balloon.prototype.setEarthPosition = function(){


    //find next cx/cy coordinates of the orbit
    this.cx = planetX + Math.cos(this.earthRadians) * this.dist;
    this.cy = planetY + Math.sin(this.earthRadians) * this.dist;
        
    // increase speed and reduce distance to black hole if bubbles are popped. 
    if(this.scale === 1){
        this.cx += 25;
     
    }
    else if(this.scale === 0.5){
        this.earthSpeed = 0.05;
    }
    else if(this.scale === 0.25){
        this.earthSpeed = 0.1;
        this.dist = 80;

    }
   
}
//if gravity is toggled draw the black hole
Balloon.prototype.drawBlackHole = function(){
    ctx.beginPath();
    ctx.arc(planetX,planetY,12,0,360, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
}

// I want to use this later to simplify the update function
// and put some of the if statements here
Balloon.prototype.notOrbit = function(){

}