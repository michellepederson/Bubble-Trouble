
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object

function powerUp(descr) {
	this.setup(descr);

};

powerUp.prototype = new Entity();
// Initial, inheritable, default values
powerUp.prototype.cx;
powerUp.prototype.cy;
powerUp.prototype.velX = 0;
powerUp.prototype.velY = 3;
powerUp.prototype.isPowerON = false;
powerUp.prototype.NOMINAL_GRAVITY = 0.12;
powerUp.prototype.radius = 20;
powerUp.prototype.color;
powerUp.prototype.lifespan = 2000 / NOMINAL_UPDATE_INTERVAL;

powerUp.prototype.update = function (du) {
	spatialManager.unregister(this);
	if (this._isDeadNow) return entityManager.KILL_ME_NOW;

	this.lifespan -= du;
    if (this.lifespan < 0 ) return entityManager.KILL_ME_NOW;

	var prevY = this.cy;
	var nextY = prevY + this.velY*du;

	if (nextY >= g_groundEdge - this.radius) {
		this.velY = 0;
		this.cy = g_groundEdge - this.radius;
	} else {
		this.cy = nextY;
	}
	spatialManager.register(this);
};

powerUp.prototype.isPowerUp = function() {
	return true;
}

powerUp.prototype.getRadius = function() {
	return this.radius;
}

powerUp.prototype.render = function (ctx) {
	ctx.beginPath();
	var powerUpIds = [g_sprites.arrow, g_sprites.powerupPotion, g_sprites.powerupOrb, g_sprites.duck, g_sprites.powerupRing, g_sprites.powerupShield, g_sprites.sword, g_sprites.grenade]
	this.sprite = powerUpIds[this.powerUpId];
	this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};
