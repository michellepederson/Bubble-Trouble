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
Player.prototype.KEY_CROUCH = 'S'.charCodeAt(0);
Player.prototype.KEY_SWORD = 'Z'.charCodeAt(0);

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
Player.prototype.lives = 3;
Player.prototype.lastEnt;


//var NOMINAL_GRAVITY = 0.12;

Player.prototype.update = function (du) {
  //Unregister
  spatialManager.unregister(this);

  //Quit game if the player dies
  if(this._isDeadNow){
      return main.gameOver();
      return -1;
  }

  if(this.spriteMode!==0){

  this.movePlayer(du);
  // Shoot wire or swing sword
  this.maybeAttack();

  this.maybeJump(du);

  }
  //Update sprite to next animation frame
  this.spriteUpdate();

  // Check if player has been hit
  var entity = this.findHitEntity();
  if (entity) {
    this.checkForDeath(entity);
  }

  //Check for death and re-register
  if(!this._isDeadNow){
      spatialManager.register(this);
  }
};

// Works but each balloon can only take one life in a row.
// Probably shouldn't be a problem for gameplay
Player.prototype.checkForDeath = function (ent) {
  if (ent === this.lastEnt) {
    return;
  } else {
    if (Player.prototype.lives === 1) {
      Player.prototype.lives -= 1;
      this.spriteMode = 0;
      this.spriteCell = 0;
    } else {
      Player.prototype.lives -= 1;
      this.lastEnt = ent;
    }
  }
}

Player.prototype.movePlayer = function (du) {
    var prevX = this.cx;
    var prevY = this.cy;
    var nextX = prevX + this.velX;
    var nextY = prevY + this.velY;


    if(keys[this.KEY_CROUCH]){
        if(this.spriteMode!==6) this.spriteCell =0;
        this.spriteMode = 6;
    }

    //If moving left, make sure player stays within screen
    if (keys[this.KEY_LEFT] && nextX > this.getRadius()) {

        if(!this.move) this.spriteCell = 0;
        this.left = true;
        this.move = true;
        this.cx -= 5*du;
        this.spriteMode = 2;
    }
    //If moving right, make sure player stays within screen
    else if (keys[this.KEY_RIGHT] && nextX < 600-this.getRadius()) {

        if(!this.move) this.spriteCell = 0;
        this.left = false;
        this.move = true;
        this.cx += 5*du;
        this.spriteMode = 2;

    }

    else {
        //If player just stopped moving, set flag to false
        if(this.move) this.spriteCell = 0;
        this.move = false;
        //If the player isn't doing anything, return to idle animation cycle
        if(this.spriteMode !== 4 & this.spriteMode!==6){
            this.spriteMode = 1;
        }
    }



};

Player.prototype.maybeAttack = function () {

    if (eatKey(this.KEY_FIRE) && entityManager._Wires.length < 1) {
        entityManager.fire(this.cx, this.cy-this.getRadius());
        if(!this.shoot) this.spriteCell = 0;
        this.shoot = true;
    }

    if(eatKey(this.KEY_SWORD)) {
        this.spriteMode = 4;
        this.spriteCell = 0;
    }

    if(this.shoot){
        this.spriteMode = 3;
    }
};

Player.prototype.maybeJump = function (du) {
    var prevX = this.cx;
    var prevY = this.cy;
    var nextY = prevY + this.velY;
    //gravity only for the Bubbleboy
    var NOMINAL_GRAVITY = 0.8;

    var accelY = NOMINAL_GRAVITY*du;


    if (keys[this.KEY_JUMP] && this.cy >= entityManager._blocks[0].cy-this.getRadius()*2) {
        this.jump();
    }
    if(nextY > entityManager._blocks[0].cy-this.getRadius()*2){
        this.cy = entityManager._blocks[0].cy-this.getRadius()*2;

    }
    else{
        this.applyAccel(accelY, du);
        this.spriteMode = 5;
        this.spriteCell = 0;
    }
}

Player.prototype.spriteUpdate = function () {
    this.sprite = g_sprite_cycles[this.spriteMode][this.spriteCell];

    //Manage the speed - better way of doing this ?
    if(this.animationLag > 0) this.animationLag--;

    else {
        //Go to next frame of sprite animation after each passage of given duration
        ++this.spriteCell;
        this.animationLag = 5;

        if (this.spriteCell === g_sprite_cycles[this.spriteMode].length){
            //If sprite is in death animation cycle, kill once he reaches the end of the animation.
            if(this.spriteMode === 0) return this.kill();
            //Likewise if sprite is in sword slashing animation cycle, return to idle once animation is complete.
            if(this.spriteMode === 4) this.spriteMode = 1;
            if(this.shoot) this.shoot = false;
            //Reset to beginning of whatever animation cycle you are in
            this.spriteCell = 0;
        }
    }
}

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


var jumphight = 4;
var jumphightSquared = jumphight * jumphight;

Player.prototype.jump = function(du,nextY){
    this.velY = -jumphightSquared;
    this.cy += this.velY;
};


Player.prototype.applyAccel = function(accelY, du) {

    var oldVelY = this.velY;

    this.velY += accelY * du;

    var aveVelY = (oldVelY + this.velY) / 2;

    this.cx += du * this.velX;
    this.cy += du * aveVelY;
};
