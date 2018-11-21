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
};

scores.prototype.render = function (ctx) {
    var stage = "Stage " + g_level;
    var player = entityManager.getPlayers()[0];
    var lives = player ? "Lives: " + player.lives : "Lives: 0";
    var score = "Score: " + scores.prototype.points;
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Grenades:",185,565);
    for(var i = 0; i<g_grenades; i += 1) {
        g_sprites.grenade.drawCentredAt(ctx, 340+(g_sprites.grenade.width*1.5)*i, 555, 0)
    }
    ctx.fillText(score,400,565);
    ctx.fillText(lives,30,565);
    ctx.fillText(stage,450,50);
    ctx.fillStyle = "black";
};
