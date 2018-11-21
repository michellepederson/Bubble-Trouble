/*
Used for bubbles in levels
Gives position for bubble, time for wave and number of waves in a level
Can be used to add even more properties in each bubble

*/

var x = g_canvas.width/4;
var posX = [x*1,x*2,x*3];

g_bubblesDescr = {
    1 : [
        {cx : posX[0]}
    ],

    2 : [
        {cx : posX[0]}, {cx : posX[2], velX : 2}
    ],

    3 : [
        {cx : posX[0]}, {cx : posX[1]}, {cx : posX[2]}
    ]
}

g_waveTime = {
    1 : 6000,
    2 : 8000,
    3 : 8000,
    4 : 6000,
}

g_waves = {
    1 : 4,
    2 : 4,
    3 : 4,
    4 : 6,
}
