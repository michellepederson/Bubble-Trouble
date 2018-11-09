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
if(this._isDeadNow && Player.prototype.lives === 0){
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
      this.spriteMode = 0;
      this.spriteCell = 0;
    } else {
      Player.prototype.lives -= 1;
      this.lastEnt = ent;
    }
  }
};



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

           // console.log("not working");
        
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
    var brickheight = 40;
    var brickwidth = 60;
    var PlayerWidth = 98;
    var PlayerHeight = 103.5;
    var PHMiddle = this.cx + 25;

    var playerHalfLeft = this.cx - 15;
    var playerHalfRight =this.cx + 15;
    var playerHMiddle = this.cx;
    var playerVMiddle = this.cy;

      for(var n = 0; n < entityManager._bricks.length; n++){
           // console.log(nextY + this.getRadius(), entityManager._bricks[n].cy);
        if(entityManager._bricks[n].status === 1){
            var temp = entityManager._bricks[n].cy;
            //console.log(prevX,this.cx, entityManager._bricks[n].cx);
            //falling/walking on bricks collision
            if((nextY + 50 > entityManager._bricks[n].cy &&
                     nextY + 50 < entityManager._bricks[n].cy + brickheight) &&

                    ((this.cx - 20 > entityManager._bricks[n].cx && 
                        this.cx - 20 < entityManager._bricks[n].cx + brickwidth)||
                        (this.cx + 20 > entityManager._bricks[n].cx &&
                        this.cx + 20 < entityManager._bricks[n].cx + brickwidth))){    

                this.velY = 0;
                this.cy = temp-50;
            
                if (keys[this.KEY_JUMP]){
                    this.jump(du,nextY);
                } 
               // console.log("ofan á");
                return;
            }
            
            // jumping under bricks collision
            else if((nextY - 50 < entityManager._bricks[n].cy + 40 && 
                     nextY - 50 > entityManager._bricks[n].cy) &&

                    ((this.cx + 20 > entityManager._bricks[n].cx && 
                      this.cx - 20 < entityManager._bricks[n].cx + 60))){

                this.cy = entityManager._bricks[n].cy + 41 + 50; 
                this.velY = 0;
            //console.log("undir");
                return;
            }
            //Bricks on left collision
            else if(this.cx - 20 < entityManager._bricks[n].cx + 60 && this.cx + 20 > entityManager._bricks[n].cx + 60){

                if((this.cy + 20 >= entityManager._bricks[n].cy && 
                    this.cy - 20 <  entityManager._bricks[n].cy) ||

                    (this.cy + 20 >= entityManager._bricks[n].cy+40 &&
                     this.cy - 20 < entityManager._bricks[n].cy+40)){
                        this.cx = entityManager._bricks[n].cx + 61+20;
                        this.velY = 0;
                        this.cy = prevY-0.4;
                        return;
                }
            }


            // Bricks on right colision
            else if(this.cx + 20 > entityManager._bricks[n].cx  && this.cx < entityManager._bricks[n].cx){

                if((this.cy + 20 >= entityManager._bricks[n].cy && 
                    this.cy - 20 <  entityManager._bricks[n].cy) ||

                    (this.cy + 20 >= entityManager._bricks[n].cy+40 &&
                     this.cy - 20 < entityManager._bricks[n].cy+40)){
                        this.cx = entityManager._bricks[n].cx-21;
                        this.velY = 0;
                        this.cy = prevY-0.4;
                        return;
                }
            }
                
            /*
            if (playerVMiddle > entityManager._bricks[n].cy && playerVMiddle < entityManager._bricks[n].cy+40) { // If player vertical-middle is inside block vertical bounds
                if ((this.cx + 50 > entityManager._bricks[n].cx && this.cx + 50  < entityManager._bricks[n].cx + 60)) { // If player vmiddle-right goes through block-left
                   // p.x = blockLeft - p.w;
                    this.cx = entityManager._bricks[n].cx - 50; // ????????
                } 
            else if ((this.cx - 50 < entityManager._bricks[n].cx + 60 && this.cx + 50 > entityManager._bricks[n].cx)) { // If player vmiddle-left goes through block-right
                    //p.x = blockRight;
                    this.cx = entityManager._bricks[n].cx+60+50;
                }
            }

            */

            
            /*
            else if(prevX > entityManager._bricks[n].cx && this.cx  < entityManager._bricks[n].cx + 60 && nextY > entityManager._bricks[n].cy+70){
               return;
            }
             else if(prevX  < entityManager._bricks[n].cx && this.cx > entityManager._bricks[n].cx && nextY > entityManager._bricks[n].cy+70){
               return;
            }

            else if(prevX > entityManager._bricks[n].cx && this.cx < entityManager._bricks[n].cx + 60 && prevY > entityManager._bricks[n].cy){
              // console.log("return true");
               this.cx = entityManager._bricks[n].cx + 61;
               return;
            }
             else if(prevX < entityManager._bricks[n].cx && this.cx > entityManager._bricks[n].cx && prevY > entityManager._bricks[n].cy){
               //console.log("return true");
               this.cx = entityManager._bricks[n].cx - 1;
               return;
            }
        */
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
        if(this.velY !== 0){
            this.spriteMode = 5;
            this.spriteCell = 0;
        }
        this.applyAccel(accelY, du);
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
  // this.drawcenter(ctx);
};


var jumphight = 4.5;
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

/*
Player.prototype.PlayerToBrickCollision = function(ctx){
    var prevX = this.cx;
    var prevY = this.cy;
    var nextX = prevX + this.velX;
    var nextY = prevY + this.velY;


    for(var n = 0; n < entityManager._bricks.length; n++){
        if(entityManager._bricks[n].status === 1){
            console.log(prevX,nextX, entityManager._bricks[n].cx, this.velX);
            if(prevX < entityManager._bricks[n].cx && nextX >= entityManager._bricks[n].cx){
               // console.log("return true");
            }
           // console.log("not working");
        }
    }
}

*/

Player.prototype.drawcenter = function(ctx){

             ctx.beginPath();
             ctx.fillStyle = 'black';
             ctx.rect(this.cx-25, this.cy-50, 50, 100);
             ctx.fill();
}