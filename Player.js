"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Player(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified

    this.scale  = this.scale  || 0.5;
    
};

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};

Player.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Player.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Player.prototype.KEY_FIRE   = ' '.charCodeAt(0);
Player.prototype.KEY_JUMP   = 'W'.charCodeAt(0);

// Initial, inheritable, default values
Player.prototype.rotation = 0;
Player.prototype.cx = 200;
Player.prototype.cy = 200;
Player.prototype.velX = 0;
Player.prototype.velY = 0;
Player.prototype.spriteCell = 0;
Player.prototype.sprite;
Player.prototype.animationLag = 5;
Player.prototype.left = true;
Player.prototype.move = false;
Player.prototype.shoot = false;
Player.prototype.spriteMode = 1;
//var NOMINAL_GRAVITY = 0.12;
    
Player.prototype.update = function (du) {
    
    spatialManager.unregister(this);
    //Quit game if the player dies
    if(this._isDeadNow){
        return main.gameOver();
        return -1;
    }
    this.movePlayer(du);
    // Handle firing
    this.maybeFire();
    
    var entity = this.findHitEntity();
    if (entity) {
        return this.kill();
    }


    var prevX = this.cx;
    var prevY = this.cy;
    var nextY = prevY + this.velY;
    //gravity only for the Bubbleboy
    var NOMINAL_GRAVITY = 0.8;
       
    var accelY = NOMINAL_GRAVITY*du;
   
    if (keys[this.KEY_JUMP] && this.cy >= entityManager._blocks[0].cy-this.getRadius()+5) {
        this.jump();
    }
    
    this.applyAccel(accelY, du); 
    
    if(this.cy > entityManager._blocks[0].cy-this.getRadius()){
        this.cy = entityManager._blocks[0].cy-this.getRadius()+5;
    }

            if(this.shoot){
            this.spriteMode = 3;
        }

        //Update sprite
    this.sprite = g_sprite_cycles[this.spriteMode][this.spriteCell];


    //Manage the speed - better way of doing this ?
    if(this.animationLag > 0) this.animationLag--;

    else {
        ++this.spriteCell;
        this.animationLag = 5;

        if (this.spriteCell === g_sprite_cycles[this.spriteMode].length){ 
            if(this.shoot) this.shoot = false;
            this.spriteCell = 0;
        }
    }

    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};

Player.prototype.movePlayer = function (du) {

   if (keys[this.KEY_LEFT]) {

    if(!this.move) this.spriteCell = 0;
    this.left = true;
    this.move = true;
    this.cx -= 5*du;
    this.spriteMode = 2;
    
} 

else if (keys[this.KEY_RIGHT]) {

    if(!this.move) this.spriteCell = 0;
    this.left = false;
    this.move = true;
    this.cx += 5*du;
    this.spriteMode = 2;
    
}

else {

    if(this.move) this.spriteCell = 0;
    this.move = false;
    this.spriteMode = 1;

}

};

Player.prototype.maybeFire = function () {

    if (eatKey(this.KEY_FIRE)) {

        entityManager.fire(this.cx, this.cy);
        if(!this.shoot) this.spriteCell = 0;
        this.shoot = true;

    }

};

Player.prototype.getRadius = function () {
    return 20;
};

Player.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;
    this.halt();
};

Player.prototype.render = function (ctx) {
    this.sprite.drawSpriteAt(
        ctx, this.cx, this.cy, this.scale, this
        );
};


var jumphight = 3.7;
var jumphightSquared = jumphight * jumphight;
Player.prototype.jump = function(du,nextY){
    
    this.velY = - jumphightSquared;
  //  this.velY += 1.5 *du;
    this.cy += this.velY;
   
    console.log(this.getRadius());
};


Player.prototype.applyAccel = function(accelY, du) {

     var oldVelY = this.velY;
    
     this.velY += accelY * du; 
 
     var aveVelY = (oldVelY + this.velY) / 2;

    this.cx += du * this.velX;
    this.cy += du * aveVelY;
}