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
Bubble.prototype.cy = 80;
Bubble.prototype.radius = 30;
Bubble.prototype.direction = 1;
Bubble.prototype.velX = -2;
Bubble.prototype.velY = 1;
Bubble.prototype.directionX = 1;
Bubble.prototype.orbit = false;
Bubble.prototype.NOMINAL_GRAVITY = 0.12;
Bubble.prototype.popped = false;
Bubble.prototype.spriteCell = 0;
Bubble.prototype.animationLag = 3;
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
        if(nextY <= this.radius*2){
            if(Bubble.orbit){
            }
        else{
            scores.raisePoints();
            this.popped = true;
     
            //return entityManager.KILL_ME_NOW;
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

    if(this.popped) this.spriteUpdate();

    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};

var pow;
Bubble.prototype.isItPowerup = function(){
    pow = util.randRange(1, 1000);
     if(pow > 800){
        //console.log(pow);
        entityManager.generatePowerUp({
            cx : this.cx,
            cy : this.cy,
            color : Math.floor(Math.random()*8),
        });

    }
}


Bubble.prototype.takeWireHit = function (pow) {
    if(!this.popped){
        this.isItPowerup();
        //this.kill();
        this.popped = true;
        scores.raisePoints();
        //pop1.play();
        if(this.scale === 1)pop1.play();
        if (this.scale === 0.25) pop3.play();
        if (this.scale > 0.25) {
            this._spawnFragment();
            this._spawnFragment();
            if(this.scale === 0.5) pop2. play();
        }
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
    if(!this.popped)this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
    else {
            this.scale = 0.5;
            this.sprite.drawSpriteAt(
        ctx, this.cx, this.cy, this.scale, this
        );
    }
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

Bubble.prototype.spriteUpdate = function () {
    this.sprite = g_sprite_cycles[7][this.spriteCell];

    //Manage the speed - better way of doing this ?
    if(this.animationLag > 0) this.animationLag--;

    else {
        //Go to next frame of sprite animation after each passage of given duration
        ++this.spriteCell;
        this.animationLag = 5;

        if (this.spriteCell === g_sprite_cycles[7].length){ 
            //If sprite is in death animation cycle, kill once he reaches the end of the animation.
            return this.kill();
        }
    } 
}
