
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Player(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;
    
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
//var NOMINAL_GRAVITY = 0.12;
    
Player.prototype.update = function (du) {
    
    spatialManager.unregister(this);
    //Quit game if the player dies
    if(this._isDeadNow){
        return main.gameOver();
        return -1;
    }
    // Handle firing
    this.maybeFire();
    
    var entity = this.findHitEntity();
    if (entity) {
        return this.kill();
    }
    
    if (keys[this.KEY_LEFT]) {
        if(this.cx > this.getRadius()){
               this.cx -= 2.5*du;
        }
    } 
    else if (keys[this.KEY_RIGHT]) {
        if(this.cx < g_canvas.width-this.getRadius()){
             this.cx += 2.5*du;
        }
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
    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};

Player.prototype.maybeFire = function () {
    if (eatKey(this.KEY_FIRE)) {
        entityManager.fire(this.cx, this.cy);
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
    var radius = this.getRadius();
    ctx.beginPath();
    ctx.arc(this.cx,this.cy,radius,0,360, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
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
