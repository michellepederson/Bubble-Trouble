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


register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    entity['posX'] = pos['posX'];
    entity['posY'] = pos['posY'];
    entity['spatialID'] = entity.getSpatialID();
    entity['radius'] = entity.getRadius();
    this._entities[spatialID] = entity;
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    delete this._entities[spatialID];
},

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

// Special collision check for wires
findEntityOverlapWire(wire) {
    var halfwidth = wire.getRadius()/2;
    var entity, pos, posX, posY, radius;
    var bubbles = entityManager.getBubbles();
    for (var i = 0; i<bubbles.length; i += 1) {
        var e = bubbles[i];
        pos = e.getPos();
        posX = pos['posX'];
        posY = pos['posY'];
        radius = e.getRadius();
        if(posX + radius >= wire.cx - halfwidth && posX - radius <= wire.cx - halfwidth){
            if(posY <= g_groundEdge && posY >= wire.cy + wire.radius) entity = e;
        }
        else if(posX + radius >= wire.cx + halfwidth && posX - radius <= wire.cx +halfwidth) {
            if(posY <= g_groundEdge && posY >= wire.cy + wire.radius) entity = e;
        }
    }
    return entity;
},

//Special collision check for sword mode
findEntityOnSword(cx, cy, width, height, frame){

    //if(frame!== 1 || frame!== 2) return;
    var x1, x2, y1, y2;
    var entity, pos, posX, posY, radius;
    var bubbles = entityManager.getBubbles();

    if(frame === 0 || frame === 3) return;

    if(frame === 1){
        x1 = cx - width/2 + 83;
        y1 = cy - height/2 + 10;
        x2 = cx - width/2 + 246;
        y2 = cy - height/2 +58;
    }
    else {
        x1 = cx - width/2 + 2;
        y1 = cy - height/2 + 34;
        x2 = cx - width/2 + 239;
        y2 = cy - height/2 + 115;
    }

    for (var i = 0; i<bubbles.length; i += 1) {
        var e = bubbles[i];
        pos = e.getPos();
        posX = pos['posX'];
        posY = pos['posY'];
        radius = e.getRadius();

        if(posX + radius >= x1 && posX - radius <= x2){
            if(posY + radius <= y2 && posY - radius >= y1) entity = e;
        }

    }
    return entity;

},

/*findEntityInRange: function(posX, posY, radius){
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
        if(ent instanceof Balloon){
            ent = this._entities[i];
            halfwidth = ent.getRadius();
            //find the distance between the center of the objects (treating them like a circle)
            // distance = Math.sqrt(((posX - ent.cx) * (posX - ent.cx)) + ((posY - ent.cy) * (posY - ent.cy)));
            distance = util.distSq(posX, posY, ent.cx, ent.cy);   
            //Fæ ekki radius og halfwidth inn svo ég setti gildin bara inn manually
            //til að sjá hvort þetta virkar.
            lim = util.square(radius + halfwidth*2);
            // check if the circles overlap (wire ball(the small dot) and bubbles)
            if(distance < lim){
                // console.log("collision");
                return ent;
            }
        }
   }
}
// This compares every bubble to every wire. If ent is usued above instead then that compares also to the player and 
// they collide and the player is killed becouse of the wire or wire ball.
// what's a better way to do this?
for(var j = 0; j < entityManager._bubbles.length; j++){
            for(var k = 0; k < entityManager._Wires.length; k++){
                
                var  dist3 = util.distSq(entityManager._bubbles[j].cx, 
                                        entityManager._bubbles[j].cy, 
                                        entityManager._Wires[k].cx, 
                                        entityManager._bubbles[j].cy);
                // big bubble limit
                if(entityManager._bubbles[j].scale === 1){
                    var  lim3 = util.square(entityManager._bubbles[j].radius);
                }                
                //medium bubble limit, adjust to scale
                if(entityManager._bubbles[j].scale === 0.5){
                     var  lim3 = util.square(entityManager._bubbles[j].radius*entityManager._bubbles[j].scale);
                }
                //small bubble limit, adjust to scale
                if(entityManager._bubbles[j].scale === 0.25){
                    var  lim3 = util.square(entityManager._bubbles[j].radius*entityManager._bubbles[j].scale);
                }
                //Check if the bubble has collided with the wire
                if(dist3 < lim3 &&  entityManager._bubbles[j].cy > entityManager._Wires[k].cy){
                    return entityManager._bubbles[j];
                }
            }
        }

// just return false and do nothing if no collision was found
return false;
},*/

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    // Special drawing for the "tail" of the wire
    var wires = entityManager.getWires();
    for (var i = 0; i<wires.length; i += 1) {
        var wire = wires[i];
        var halfwidth = wire.getRadius()/2;
        ctx.rect(wire.cx - halfwidth, wire.cy, halfwidth*2, g_groundEdge-wire.cy);
        ctx.stroke();
    }
    ctx.strokeStyle = oldStyle;
}

}
