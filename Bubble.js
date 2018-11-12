"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Bubble(descr) {
        // Common inherited setup logic from Entity
    this.setup(descr);
    /*
    for (var property in descr) {
        this[property] = descr[property];
    }
    */
    this.velX *= this.directionX;
    this.sprite = this.sprite || g_sprites.bubble;
    this.scale  = this.scale  || 1;
};

Bubble.prototype = new Entity();
// Initial, inheritable, default values
var KEY_GRAVITY = keyCode('G');

Bubble.prototype.cx = 150;
Bubble.prototype.cy = 50;
Bubble.prototype.radius = 30;
Bubble.prototype.direction = 1;
Bubble.prototype.velX = -2;
Bubble.prototype.velY = 1;
Bubble.prototype.directionX = 1;
Bubble.prototype.orbit = false;
Bubble.prototype.NOMINAL_GRAVITY = 0.12;
Bubble.prototype.powerRandom = 0;


Bubble.prototype.update = function (du) {
    spatialManager.unregister(this);
    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
    var prevX = this.cx;
    var prevY = this.cy;
    var nextX = prevX + this.velX;
    var nextY = prevY + this.velY;


    // Simple collision detection to keep the bubbles inside the canvas
    // Lines 45-60 i'd like to be in a function below (notOrbit).
    if(this.orbit === false){
        if(nextY > g_groundEdge - this.radius/2){
            this.velY *= -1;
        }
        if(nextX <= this.radius/2){
            this.velX *= -1;
        }
        if(nextX >= g_canvas.width-this.radius/2){
            this.velX *= -1;
        }
        if(nextY <= this.radius/2){
            if(Bubble.orbit){
        }
        else{
            scores.raisePoints();
            return entityManager.KILL_ME_NOW;
        }
    }
    }

    Bubble.orbit =  g_gravity;

    if(Bubble.orbit){
        this.gravityOn();
    }
    else{
        Bubble.NOMINAL_GRAVITY = 0.12;
        var accelY = Bubble.NOMINAL_GRAVITY*du;
        this.applyAccel(accelY, du);
    }

    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};

var pow;
Bubble.prototype.isItPowerup = function(){
    pow = util.randRange(1, 1000);
    console.log(pow);
     if(pow > 500){
        //console.log(pow);
        entityManager.generatePowerUp({
            cx : this.cx,
            cy : this.cy,
            color : Math.floor(Math.random()*2),
        });

    }
}


Bubble.prototype.takeWireHit = function (pow) {

    this.isItPowerup();
    this.kill();
    scores.raisePoints();

    if (this.scale > 0.25) {
        this._spawnFragment();
        this._spawnFragment();
    }
};

Bubble.prototype._spawnFragment = function () {

    //this.direction *= -1;
    this.velX *= -1;

    entityManager.generateBubble({
        cx : this.cx,
        cy : this.cy,
        scale: this.scale/2,
        radius: this.radius*this.scale/2,
        //velX : this.direction,
        velX : this.velX*0.8,
        velY : -5.5
    });
};

Bubble.prototype.getRadius = function () {
    return this.radius;
};

Bubble.prototype.applyAccel = function(accelY, du) {

    var oldVelY = this.velY;

    this.velY += accelY * du;

    var aveVelY = (oldVelY + this.velY) / 2;

    this.cx += du * this.velX;
    this.cy += du * aveVelY;
}

Bubble.prototype.render = function (ctx) {

    var originalScale = this.sprite.scale;
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};

// planetX/Y - the black hole
var planetX = 300;
var planetY = 200;
Bubble.prototype.earthSpeed = 0.02;
Bubble.prototype.earthRadians = 20;
Bubble.prototype.dist = 220;

Bubble.prototype.gravityOn = function(){

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
Bubble.prototype.setEarthPosition = function(){


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

// I want to use this later to simplify the update function
// and put some of the if statements here
Bubble.prototype.notOrbit = function(){

}