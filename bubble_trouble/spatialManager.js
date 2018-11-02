/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
    var id = this._nextSpatialID;
    this._nextSpatialID += 1;
    return id;
},

// Had some problems with registering and unregistering the entities so I just changed this until i got my code to work...

/*
register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    var radius = entity.getRadius();
    entity['posX'] = pos['posX'];
    entity['posY'] = pos['posY'];
    entity['spatialID'] = spatialID;
    entity['radius'] = radius;
    this._entities.push(entity);
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    for (var i = 0; i<this._entities.length; i += 1) {
        var e = this._entities[i]
        if (e.spatialID === spatialID) {
            this._entities.splice(i, 1);
            return;
        }
    }
},
*/

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    // TODO: YOUR STUFF HERE!
    this._entities[spatialID] = entity;
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    delete this._entities[spatialID];
},
/*
findEntityInRange: function(posX, posY, radius) {
    var entity;
    for (var ID in this._entities) {
        var e = this._entities[ID];
        var insideRange = util.distSq(posX, posY, e.posX, e.posY) < util.square(e.radius + radius)
        if (insideRange) {
            entity = e;
        }
    }
    return entity;
},
*/

findEntityInRange: function(posX, posY, radius) {
    // TODO: YOUR STUFF HERE!

var distance;
var halfwidth;
var ent;
var lim;
var dist2;
var lim2;
//Loop through all the entities andcheck them for collision
for(var i = 0; i < this._entities.length; i++){
    if (this._entities[i] === undefined){
        //if the place in the _entity array is undefined then do nothing, just skip it
    }
    else{
        ent = this._entities[i];
        halfwidth = ent.getRadius();
        //find the distance between the center of the objects (treating them like a circle)
       // distance = Math.sqrt(((posX - ent.cx) * (posX - ent.cx)) + ((posY - ent.cy) * (posY - ent.cy)));

       distance = util.distSq(posX, posY, ent.cx, ent.cy);
       
       //Fæ ekki radius og halfwidth inn svo ég setti gildin bara inn manually
       //til að sjá hvort þetta virkar.
       lim = util.square(radius + halfwidth*2);

        // check if the circles overlap (wire ball(the small dot) and balloons)
        if(distance < lim){ 
            return ent;
        }   
        //collision detection to check if the balloons hit the wire
        if(ent instanceof Balloon){
            dist2 = util.distSq(ent.cx, ent.cy, posX, ent.cy);
            lim2 = util.square(radius + halfwidth*2);
            
            // check if the balloons hit the wire
            if(dist2 < lim2 && ent.cy > posY){ 
                return ent;
            }
        }
        //Collision detection for the Player 
        if(ent instanceof Player){
            dist2 = util.distSq(ent.cx, ent.cy, posX, posY);
            lim2 = util.square(radius + halfwidth);
            if(dist2 < lim2){
                return ent;
            }
        }
    }
}

// just return false and do nothing if no collision was found
return false;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
