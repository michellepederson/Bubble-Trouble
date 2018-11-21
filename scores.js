"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function scores(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
};

// Initial, inheritable, default values
scores.prototype.points = 0;

scores.raisePoints = function() {
  scores.prototype.points += 2;
}

scores.prototype.update = function (du) {
 // ctx.fillText(scores.prototyp.points,500,560);
 // ctx.fillText(Player.prototype.lives,200,565);
};

scores.prototype.render = function (ctx) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: ",400,565);
    ctx.fillText(scores.prototype.points,500,565);
    ctx.fillText("Grenades:",185,565);
    for(var i = 0; i<g_grenades; i += 1) {
        g_sprites.grenade.drawCentredAt(ctx, 340+(g_sprites.grenade.width*1.5)*i, 555, 0)
    }
    var player = entityManager.getPlayers()[0];
    var lives = player ? player.lives : 0;
    ctx.fillText("Lives:",30,565);
    ctx.fillText(lives,120,565);
    ctx.fillStyle = "black";
};
