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
//Player.prototype.KEY_FIRE   = ' '.charCodeAt(0);
Player.prototype.KEY_JUMP   = 'W'.charCodeAt(0);
Player.prototype.KEY_CROUCH = 'S'.charCodeAt(0);
Player.prototype.KEY_SWORD = 'Z'.charCodeAt(0);


//grenade key
//Player.prototype.KEY_GRENADE = 'N'.charCodeAt(0);
var KEY_GRENADE = keyCode('N');

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
Player.prototype.eWires = false;
Player.prototype.shield = false;
Player.prototype.sword = false;
//var NOMINAL_GRAVITY = 0.12;

Player.prototype.update = function (du) {

//Unregister
spatialManager.unregister(this);

//Quit game if the player dies
if(this._isDeadNow && Player.prototype.lives === 1){
    g_playerIsDead = true;
    return entityManager.KILL_ME_NOW;
}

if(this.spriteMode!==0){

    this.movePlayer(du);

    this.maybeJump(du);
    // Shoot wire or swing sword
    this.maybeAttack();

    }
    this.grenade();
    //Update sprite to next animation frame
    this.spriteUpdate();

    // Check if player has been hit
    var entity = this.findHitEntity();

    if (entity) {
        this.checkEntity(entity);
    } else {
        this.lastEnt = undefined;
    }
        //Check for death and re-register
        if(!this._isDeadNow){
            spatialManager.register(this);
        }
};



Player.prototype.grenade = function () {
    if(eatKey(KEY_GRENADE) && g_grenades > 0){
        g_grenades -= 1;
        entityManager.makeGrenade(this.cx,this.cy-50, 10, this.left);
        pin.play();
        throwGrenade.play();
    }
};

// Works but each bubble can only take one life in a row.
// Probably shouldn't be a problem for gameplay

Player.prototype.checkEntity = function (ent) {
    // If the entity is power up element.
    if (ent.isPowerUp()) {
        if (ent.powerUpId === 0) {
            g_eWires = true;
            armor.play();
            g_sword = false;
        }
        // Powerup that gives extra life
        else if (ent.powerUpId === 1) {
            Player.prototype.lives += 1;
            potion.play();
        }
        // Powerup that increases the speed of the wire
        else if (ent.powerUpId === 2) {
            g_wireVelToggle = true;
            if(g_powerUpTimeOuts[0]) {
                clearTimeout(g_powerUpTimeOuts[0]);
            }
            // Remove the powerup from the player after 7 sec
            g_powerUpTimeOuts[0] = setTimeout(function() {
                g_wireVelToggle = false;
            }, 7000);
            collect.play();
        }
        // Bad powerup, removes the increased speed of the wire
        else if (ent.powerUpId === 3) {
         g_wireVelToggle = false;
         quack.play();
          }
        // Powerup that toggles the sauron eye on which the bubbles spin around
        else if (ent.powerUpId === 4) {
            g_gravity = true;
            if (g_powerUpTimeOuts[1]) {
                clearTimeout(g_powerUpTimeOuts[1]);
            }
            // Remove the powerup from the player after 7 sec
            g_powerUpTimeOuts[1] = setTimeout(function() {
                g_gravity = false;
            }, 7000);
            coin.play();
            bass.play();
        }
        // Power up that gives the player a shield
        else if (ent.powerUpId === 5) {
            g_shield = true;
            if (g_powerUpTimeOuts[2]) {
                clearTimeout(g_powerUpTimeOuts[2]);
            }
            // Remove the powerup from the player after 7 sec
            g_powerUpTimeOuts[2] = setTimeout(function() {
                g_shield = false;
            }, 7000);
            shield.play();
        }
        // Power up that gives the player a sword
        else if (ent.powerUpId === 6) {
            g_sword = true;
            if (g_powerUpTimeOuts[3]) {
                clearTimeout(g_powerUpTimeOuts[3]);
            }
            // Remove the powerup from the player after 7 sec
            g_powerUpTimeOuts[3] = setTimeout(function() {
                g_sword = false;
            }, 7000);
            unsheath.play();
         }
         else if (ent.powerUpId === 7) {
            g_grenades += 1;
         }
        ent.kill();
        return;
    // If the entity is still colliding with the player, like the same bubble
} else if(ent === this.lastEnt) {
    return;
}
//If the shield is activated, skip collision check for non-powerups
else if(g_shield) return;
    // Lifecheck
    else {
        if (Player.prototype.lives === 1) {
            this.spriteMode = 0;
            this.spriteCell = 0;
            death.play();
        } else {
            Player.prototype.lives -= 1;
            hurt.play();
            this.lastEnt = ent;
        }
    }
};



Player.prototype.movePlayer = function (du) {
    var prevX = this.cx;
    var prevY = this.cy;
    var nextX = prevX + this.velX;
    var nextY = prevY + this.velY;

    if(keys[this.KEY_CROUCH] && !this.move){
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

    if(g_bricks){

    var brickheight = 40;
    var brickwidth = 60;
    var PlayerWidth = 98;
    var PlayerHeight = 103.5;
    var PHMiddle = this.cx + 25;

    var playerHalfLeft = this.cx - 15;
    var playerHalfRight =this.cx + 15;
    var playerHMiddle = this.cx;
    var playerVMiddle = this.cy;


    // The  player to brick collision checking: 
    for(var n = 0; n < entityManager._bricks.length; n++){

        if(entityManager._bricks[n].status === 1){
            var temp = entityManager._bricks[n].cy;
            
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
            return;
        }

            // jumping under bricks collision
            else if((nextY - 50 < entityManager._bricks[n].cy + 40 &&
               nextY - 50 > entityManager._bricks[n].cy) &&

                ((this.cx + 20 > entityManager._bricks[n].cx &&
                  this.cx - 20 < entityManager._bricks[n].cx + 60))){

                this.cy = entityManager._bricks[n].cy + 41 + 50;
            this.velY = 0;
            return;
        }

            //Bricks on left collision
            else if(this.cx - 20 < entityManager._bricks[n].cx + 60 && this.cx + 20 > entityManager._bricks[n].cx + 60){

                if((this.cy + 20 >= entityManager._bricks[n].cy &&
                    this.cy - 20 <  entityManager._bricks[n].cy) ||

                    (this.cy + 20 >= entityManager._bricks[n].cy+40 &&
                       this.cy - 20 < entityManager._bricks[n].cy+40)){
                    this.cx = entityManager._bricks[n].cx + 61+20;
                    this.move = false;
                //this.velY = 0;
                this.cy = prevY;
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
                    this.move = false;
                //this.velY = 0;
                this.cy = prevY;
                return;
               }
            }
        }
    }
    }
};

var KEY_FIRE = keyCode(' ');

Player.prototype.maybeAttack = function () {

    if (eatKey(KEY_FIRE)){
        if(g_sword){
            swoosh.play();
            this.spriteMode = 4;
            this.spriteCell = 0;
        }
        else{
            if(entityManager._Wires.length < 1 ||  g_eWires){
                throw1.play();
                entityManager.fire(this.cx, this.cy-this.getRadius());
                if (entityManager._Wires.length > 1) g_eWires = false;
            }
            if(!this.shoot){
                this.spriteCell = 0;
            }
            else{
               this.shoot = true;
           }
    }
}

    //If in sword mode, collison check for sword swings
    if(g_sword && this.spriteMode === 4 &&(this.spriteCell === 1 || this.spriteCell === 2)){
        var hitEntity;
        hitEntity = spatialManager.findEntityOnSword(this.cx, this.cy, this.sprite.width, this.sprite.height, this.spriteCell);

        if (hitEntity){
            var canTakeHit = hitEntity.takeWireHit;
            if (canTakeHit) canTakeHit.call(hitEntity);
        }
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
        if(this.velY !== 0 && this.spriteMode!==4){
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
};

Player.prototype.getRadius = function () {
    //return 50; // weird bug
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
    this.renderPowerup();
  // this.drawcenter(ctx);
};

var jumphight = 3.8;
var jumphightSquared = jumphight * jumphight;

Player.prototype.jump = function(du,nextY){
    jump.play();
    this.velY = -jumphightSquared;
    this.cy += this.velY;
};

// Renders additioinal sprites on top of player sprite, for relevant power ups.
Player.prototype.renderPowerup = function () {
    if(g_shield) {
        ctx.save();
        ctx.translate(-this.cx, -this.cy);
        ctx.scale(2, 2);
        g_sprites.shield.drawCentredAt(ctx, this.cx, this.cy);
        ctx.restore();
    }
}

Player.prototype.applyAccel = function(accelY, du) {

    var oldVelY = this.velY;

    this.velY += accelY * du;

    var aveVelY = (oldVelY + this.velY) / 2;

    this.cx += du * this.velX;
    this.cy += du * aveVelY;
};

Player.prototype.drawcenter = function(ctx){
   ctx.beginPath();
   ctx.fillStyle = 'black';
   ctx.rect(this.cx-25, this.cy-50, 50, 100);
   ctx.fill();
}
