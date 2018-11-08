
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
  scores.prototype.points += 1;
  if (scores.prototype.points % 5 === 0) {
    entityManager.generateBalloon();
  }
}

scores.prototype.update = function (du) {
  ctx.fillText(scores.prototype.points,500,560);
  ctx.fillText(Player.prototype.lives,200,565);

};

scores.prototype.render = function (ctx) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: ",400,565);
    ctx.fillText(scores.prototype.points,500,565);
    ctx.fillText("Lives:",30,565);
    ctx.fillText(Player.prototype.lives,120,565);
    ctx.fillStyle = "black";
};
