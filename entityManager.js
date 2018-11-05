/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA
_backgrounds : [],
_players  : [],
_bullets : [],
_blocks : [],
_balloons : [],
_Wires : [],

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._backgrounds, this._bullets, this._players, this._blocks, this._balloons, this._Wires];
},

init: function() {
},

fire: function(cx, cy) {

    this._categories[5].push(
        new Wire({
            cx,
            // temporary solution cy. -40 because otherwise the wire shot collides with the player
            cy: cy - 40,
        })
    );
},

generateBackground : function () {

   var background = new Background();
   this._backgrounds.push(background);

},

generatePlayer : function(cx, ground_edge) {
    var player = new Player();
    var cy = ground_edge - player.getRadius();
    this._players.push(new Player({cx, cy,}))
},

generateGround : function(cx,cy, halfWidth,halfHeight) {
    this._blocks.push(
        new Block({
            cx,
            cy,
            halfWidth,
            halfHeight,
        }));
    
    return cy + halfHeight;
},


generateBalloon : function(descr, g_mouseX, g_mouseY) {

    var entity = new Balloon(descr);
    this._categories[4].push(entity);
},

resetBubbles: function() {
    //this._forEachOf(this._ships, Ship.prototype.reset);
},

haltBubbles: function() {
    //this._forEachOf(this._ships, Ship.prototype.halt);
},	

update: function(du) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

},

render: function(ctx) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);

        }
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

