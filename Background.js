"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Background(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    } 

    // Default sprite and scale, if not otherwise specified
    //this.sprite = this.sprite || g_sprites.bubble;
    this.scale  = this.scale  || 1;
}

Background.prototype = new Entity();

Background.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Background.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);
Background.prototype.KEY_BACKGROUND = 'B'.charCodeAt(0);

// Initial, inheritable, default values
Background.prototype.cx = 0;
Background.prototype.backgroundMode = 1;

Background.prototype.update = function (du) {
    //Update x coord for parallax 
    if (keys[this.KEY_LEFT]) {
        this.cx -= 2.5*du;
    } else if (keys[this.KEY_RIGHT]) {
        this.cx += 2.5*du;
    }
    this.maybeToggleBackground();


};

Background.prototype.maybeToggleBackground = function () {

    if(keys[this.KEY_BACKGROUND]){
        this.backgroundMode *= -1;
    }

};

Background.prototype.render = function (ctx) {

    var cx = this.cx;

    util.clearCanvas(ctx);

    if(this.backgroundMode === 1){

    ctx.save();
    ctx.scale(4, 4);
    ctx.translate(cx/60, 0);
    g_sprites.bgkIndustrial1.drawAt(ctx, -50, 0);
    ctx.translate(cx/60, 0);
    g_sprites.bgkIndustrial2.drawAt(ctx, -50, 0);
    ctx.translate(cx/60, 0);
    g_sprites.bgkIndustrial3.drawAt(ctx, -50, 0);
    ctx.translate(cx/60, 0);
    g_sprites.bgkIndustrial4.drawAt(ctx, -50, 22);

    ctx.restore();
}

    else {

    ctx.save();
    ctx.scale(2.75, 2.75);
    ctx.translate(cx/60, 0);
    g_sprites.bgkBulkhead1.drawAt(ctx, -50, 0);
    ctx.translate(cx/60, 0);
    g_sprites.bgkBulkhead2.drawAt(ctx, -50, 0);
    ctx.translate(cx/60, 0);
    g_sprites.bgkBulkhead3.drawAt(ctx, -50, 0);
    ctx.translate(cx/60, 0);
    g_sprites.bgkBulkhead4.drawAt(ctx, -50, 0);

    ctx.restore();

    }



};
