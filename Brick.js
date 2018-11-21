"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object

function Brick(descr) {
   this.setup(descr);
   /*
    for (var property in descr) {
        this[property] = descr[property];
    } 
    */

    this.sprite = this.sprite || g_sprites.platform;
    
};

Brick.prototype = new Entity();

// Initial, inheritable, default values
Brick.prototype.cx = 200;
Brick.prototype.cy = 200;
Brick.prototype.Width = 50;
Brick.prototype.Height = 50;
Brick.prototype.status = 0;
Brick.prototype.KEY_BRICK = 'M'.charCodeAt(0);
Brick.prototype.rotation = 0;
Brick.prototype.update = function (du){	
};

Brick.prototype.render = function (ctx) {
	this.sprite.drawCentredAt(ctx, this.cx, this.cy, this.rotation);
};


Brick.prototype.changeStatus = function(){
}

Brick.prototype.isStatus = function(){

}


