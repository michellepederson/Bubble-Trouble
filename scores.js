
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
  ctx.fillText(scores.prototype.points,500,560);
};

scores.prototype.render = function (ctx) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Score: ",400,560);
    ctx.fillText(scores.prototype.points,500,560);
    ctx.fillStyle = "black";
};
