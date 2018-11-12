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
	spatialManager.unregister(this);

    	if(this._isDeadNow){
        	return -1;
    	}

		if(eatKey(this.KEY_BRICK)){
			Brick.ONOFF = !Brick.ONOFF;
			if(Brick.ONOFF === true){
				this.isStatus(); 
			}
			else{
				this.changeStatus();
			}
		}
	
	    if(!this._isDeadNow){
        spatialManager.register(this);
    }
};

Brick.prototype.render = function (ctx) {
	
	for(var i = 0; i < entityManager._bricks.length; i++ ){
		if(entityManager._bricks[i].status === 1){
			 //ctx.fillStyle = 'black';
   			 //ctx.fillRect(entityManager._bricks[i].cx, entityManager._bricks[i].cy, 60, 40);
   			 this.sprite.drawAt(ctx, entityManager._bricks[i].cx, entityManager._bricks[i].cy, 0);
		}
	}
};


Brick.prototype.changeStatus = function(){

	for(var i = 0; i < entityManager._bricks.length; i++ ){
		entityManager._bricks[i].status = 0;
	}
}

Brick.prototype.isStatus = function(){
/*
			entityManager._bricks[10].status = 1;
			entityManager._bricks[21].status = 1;
			entityManager._bricks[32].status = 1;
			entityManager._bricks[43].status = 1;
			entityManager._bricks[54].status = 1;
			entityManager._bricks[65].status = 1;
			entityManager._bricks[79].status = 1;
			
			entityManager._bricks[43].status = 1;
			entityManager._bricks[54].status = 1;
			entityManager._bricks[65].status = 1;
			entityManager._bricks[79].status = 1;
			*/
			entityManager._bricks[8].status = 1;
			//entityManager._bricks[18].status = 1;
			entityManager._bricks[17].status = 1;
			entityManager._bricks[16].status = 1;
			entityManager._bricks[15].status = 1;
			entityManager._bricks[33].status = 1;
			//entityManager._bricks[45].status = 1;
			entityManager._bricks[60].status = 1;
			//entityManager._bricks[65].status = 1;
			entityManager._bricks[81].status = 1;
			entityManager._bricks[82].status = 1;
			entityManager._bricks[87].status = 1;
			entityManager._bricks[97].status = 1;
}


