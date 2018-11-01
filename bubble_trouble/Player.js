
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

// Initial, inheritable, default values
Player.prototype.rotation = 0;
Player.prototype.cx = 200;
Player.prototype.cy = 200;

    
Player.prototype.update = function (du) {
    
    spatialManager.unregister(this);

    if (this._isDeadNow) return;

    // Handle firing
    this.maybeFire();

    var entity = this.findHitEntity();
    if (entity) {
        return this.kill();
    }

    if (keys[this.KEY_LEFT]) {
        this.cx -= 2.5*du;
    } else if (keys[this.KEY_RIGHT]) {
        this.cx += 2.5*du;
    }
    spatialManager.register(this);

};

Player.prototype.maybeFire = function () {

    if (eatKey(this.KEY_FIRE)) {
    
        entityManager.fire(this.cx, this.cy);
           
    }
    
};

Player.prototype.getRadius = function () {
    //return (this.sprite.width / 2) * 0.9;
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
