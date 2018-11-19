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
//Brick.prototype.brickArray = [[]];
//var KEY_BRICK = keyCode('M');
Brick.prototype.ONOFF = false;
//Brick.prototype.buildBricks = function() 
Brick.prototype.update = function (du){
	
	
	
};

Brick.prototype.render = function (ctx) {
	if(g_bricks){
		for(var i = 0; i < entityManager._bricks.length; i++ ){
			if(entityManager._bricks[i].status === 1){
				//ctx.fillStyle = 'black';
   				//ctx.fillRect(entityManager._bricks[i].cx, entityManager._bricks[i].cy, 60, 40);
   				this.sprite.drawAt(ctx, entityManager._bricks[i].cx, entityManager._bricks[i].cy, 0);
			}
		}
	}
};


Brick.prototype.changeStatus = function(){
}

Brick.prototype.isStatus = function(){

}


