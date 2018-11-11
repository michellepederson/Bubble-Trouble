
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// INITIALIZE GAME
function init() {

    var ground_y = 500;
    var cx = 300;
    // Returns y coordinate of the edge of the ground, its needed to place the player
    // on top of the ground edge

                                    //    cx           - cy       - g_canvas.width/2-   5
                                    //g_canvas.width/2 - ground_y - halfWidth   -     halfHeight
    g_groundEdge = entityManager.generateGround(g_canvas.width/2,ground_y,g_canvas.width/2, 5);
    entityManager.generateScores();
    entityManager.generatePlayer(cx, g_groundEdge);
    entityManager.generateBackground();

    var level = 2;
    addBalloons(level);
    g_numberOfWaves = g_waves[level] - 1;
    var time = g_waveTime[level];
    g_timeOuts = [
        setTimeout(function(){
        addBalloons(level);
    }, time)]

    /*
    var brickwidth = 60;
    var brickheight = 40;
    var brickOffsetTop = 100;
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
             entityManager.brick(j*brickwidth, (i*brickheight) + brickOffsetTop , 0);
        }
    }*/
}

// GATHER INPUTS

function gatherInputs() {
}
		
			
// GAME-SPECIFIC UPDATE LOGIC
			
function updateSimulation(du) {

    processDiagnostics();
    
    entityManager.update(du);

}

// GAME-SPECIFIC DIAGNOSTICS

var g_allowMixedActions = true;
var g_gravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;


var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');
var KEY_SPATIAL = keyCode('X');
var KEY_GRAVITY = keyCode('G');

function processDiagnostics() {


    if (eatKey(KEY_HALT)) entityManager.haltBubbles();

    if (eatKey(KEY_RESET)) entityManager.resetBubbles();

    if(eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if(eatKey(KEY_GRAVITY)) g_gravity = !g_gravity;

}

// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);
    // Blackhole would be object in entityManager if it has some behavior (features)
    if (g_gravity) drawBlackHole();
    if (g_renderSpatialDebug) spatialManager.render(ctx);
}

// BLACKHOLE-DRAWING
function drawBlackHole() {
    ctx.beginPath();
    ctx.arc(planetX,planetY,12,0,360, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
}

// BALLOON ADDING
function addBalloons(level) {
    var timeOut;
    g_timeOuts = [];
    var ballonsDescr = g_ballonsDescr[level];
    var time = g_waveTime[level];
    var numberOfBalloons = ballonsDescr.length;
    // Time between insertion of balloons for each wave
    var timeInterval = 2000;
    for(var i = 0; i<numberOfBalloons-1; i += 1) {
        // Make balloon after 2 secs
        timeOut = setTimeout(entityManager.addBalloon(new Balloon(ballonsDescr[i]), timeInterval));
        g_timeOuts.push(timeOut);
    }
    if (g_numberOfWaves > 0) {
        // Last timeout resest the global g_timeOuts back to its "original" value
        timeOut = setTimeout(function() {
            entityManager.addBalloon(new Balloon(ballonsDescr[numberOfBalloons-1]));
            // Rest g_timeOuts
            g_timeOuts = [
                setTimeout(function() {
                    addBalloons(level)
                }, time)
            ];
        }, timeInterval*numberOfBalloons-1);
        g_timeOuts.push(timeOut);
        g_numberOfWaves -= 1;
    }
}

// RESETTING OF THE GAME
function resetGame() {
    // Clear all timeouts
    for(var i = 0; i<g_timeOuts.length; i += 1) {
        clearTimeout(g_timeOuts[i]);
    }
}


/// PRELOAD

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        bubble : "img/bubbles/bubble_2.png",

        //Background One
        bkgBulkhead1 : "img/bkg-bulkhead/bulkhead-walls-back.png",
        bkgBulkhead2 : "img/bkg-bulkhead/bulkhead-walls-pipes.png",
        bkgBulkhead3 : "img/bkg-bulkhead/bulkhead-walls-platform.png",
        bkgBulkhead4 : "img/bkg-bulkhead/cols.png",

        //Background Two
        bkgIndustrial1 : "img/bkg-industrial/skill-desc_0003_bg.png",
        bkgIndustrial2 : "img/bkg-industrial/skill-desc_0002_far-buildings.png",
        bkgIndustrial3 : "img/bkg-industrial/skill-desc_0001_buildings.png",
        bkgIndustrial4 : "img/bkg-industrial/skill-desc_0000_foreground.png",

        //Spokes
        spike: "img/spike.png",

        //Wire and arrow
        wire : "img/player/chain.png",
        arrow : "img/player/arrow.png",

        //Platform
        platform : "img/tile_cave_platform.png",

        //Player Sprites
        idle : "img/player/idle-sheet.png",
        death : "img/player/deafeated-sheet.png",
        run : "img/player/run.png",
        shoot : "img/player/shoot-sheet.png",
        swipe : "img/player/swipe-sheet.png",
        jump : "img/player/jump.png",
        crouch : "img/player/crouch-sheet.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {}
var g_sprite_cycles;
var g_sprite_setup;


function preloadDone() {
    //Bubble
    g_sprites.bubble = new Sprite(g_images.bubble);

    //Background One
    g_sprites.bgkBulkhead1 = new Sprite(g_images.bkgBulkhead1);
    g_sprites.bgkBulkhead2 = new Sprite(g_images.bkgBulkhead2);
    g_sprites.bgkBulkhead3 = new Sprite(g_images.bkgBulkhead3);
    g_sprites.bgkBulkhead4 = new Sprite(g_images.bkgBulkhead4);

    //Background Two
    g_sprites.bgkIndustrial1 = new Sprite(g_images.bkgIndustrial1);
    g_sprites.bgkIndustrial2 = new Sprite(g_images.bkgIndustrial2);
    g_sprites.bgkIndustrial3 = new Sprite(g_images.bkgIndustrial3);
    g_sprites.bgkIndustrial4 = new Sprite(g_images.bkgIndustrial4);

    //Spikes
    g_sprites.spike = new Sprite (g_images.spike);

    //Wire and arrow
    g_sprites.wire = new Sprite(g_images.wire);
    g_sprites.arrow = new Sprite(g_images.arrow);

    //Platform tile
    g_sprites.platform = new Sprite(g_images.platform);

    //Player Animations
    g_sprite_cycles = [ [], [], [], [], [], [], [] ];
    var sprite, celWidth, celHeight, numCols, numRows, numCels, image, offsetX, offsetY;

    g_sprite_setup = [];
    g_sprite_setup[0] = {
            celWidth : 186,
            celHeight : 227,
            numCols : 7,
            numRows : 1,
            numCels : 7,
            spriteSheet : g_images.death
        };
    g_sprite_setup[1] = {
            celWidth : 196,
            celHeight : 207,
            numCols : 6,
            numRows : 1,
            numCels : 6,
            spriteSheet : g_images.idle
    };
        g_sprite_setup[2] = {
            celWidth : 196,
            celHeight : 207,
            numCols : 9,
            numRows : 1,
            numCels : 10,
            spriteSheet : g_images.run
    };
        g_sprite_setup[3] = {
            celWidth : 196,
            celHeight : 268,
            numCols : 3,
            numRows : 1,
            numCels : 3,
            spriteSheet : g_images.shoot,
            offsetY : -25
    };
        g_sprite_setup[4] = {
            celWidth : 251,
            celHeight : 268,
            numCols : 4,
            numRows : 1,
            numCels : 4,
            spriteSheet : g_images.swipe,
            offsetX : -45,
            offsetY : -25
    
            
    };
            g_sprite_setup[5] = {
            celWidth : 196,
            celHeight : 268,
            numCols : 1,
            numRows : 1,
            numCels : 1,
            spriteSheet : g_images.jump
    };

            g_sprite_setup[6] = {
            celWidth : 137,
            celHeight : 162,
            numCols : 2,
            numRows : 1,
            numCels : 2,
            spriteSheet : g_images.crouch,
            offsetY: 12
    };


    
    for(var i = 0; i < g_sprite_setup.length; i++){

         celWidth  = g_sprite_setup[i].celWidth;
         celHeight = g_sprite_setup[i].celHeight;
         numCols = g_sprite_setup[i].numCols;
         numRows = g_sprite_setup[i].numRows;
         numCels = g_sprite_setup[i].numCels;
         image = g_sprite_setup[i].spriteSheet;
         offsetX = g_sprite_setup[i].offsetX;
         offsetY = g_sprite_setup[i].offsetY;

    for (var row = 0; row < numRows; ++row) {

        for (var col = 0; col < numCols; ++col) {

            sprite = new Sprite(image, col * celWidth, row * celHeight,
                                celWidth, celHeight, offsetX, offsetY) 
            g_sprite_cycles[i].push(sprite);
            g_sprite_cycles[i].splice(numCels);
          //  console.log(sprite);     

        }
    }
}

    entityManager.init();
    init();

    main.init();
}

requestPreloads();