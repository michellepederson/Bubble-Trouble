// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image, sx, sy, width, height, offsetX, offsetY) {
    if(offsetX === undefined) offsetX = 0;
    if(offsetY === undefined) offsetY = 0;

    if(sx === undefined || sy === undefined){
        sx = 0;
        sy = 0;
    }

    this.image = image;

    this.sx = sx;
    this.sy = sy;

    this.offsetX = offsetX;
    this.offsetY = offsetY;

    if(width === undefined || height === undefined){
        this.width = image.width;
        this.height = image.height;
    }

    else {
    this.width = width;
    this.height = height;
    }
    this.scale = 1;
};

Sprite.prototype.drawAt = function (ctx, x, y, rotation) {
    if(rotation === undefined) rotation = 0;
     ctx.drawImage(this.image, 
                  this.sx, this.sy, this.width, this.height,
                  x, y, this.width, this.height);

};

Sprite.prototype.drawSpriteAt = function (ctx, x, y, scale, player) {    

    ctx.save();
   
    if(player.left){
        ctx.scale(scale, scale);
        ctx.translate(x,y);
    }
    else {
        ctx.scale(-scale, scale);
        ctx.translate(-x*3,y);
    }
    ctx.drawImage(this.image, 
                  this.sx, this.sy, this.width, this.height,
                  x - this.width/2 + this.offsetX, y - this.height/2 +this.offsetY, this.width, this.height);
    ctx.restore();
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;
    
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
                  -w/2, -h/2);
    
    ctx.restore();
};  

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {
    
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);
    
    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;
    
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);
    
    // Top and Bottom wraps
    this.drawCentredAt(ctx, cx, cy - sh, rotation);
    this.drawCentredAt(ctx, cx, cy + sh, rotation);
};
