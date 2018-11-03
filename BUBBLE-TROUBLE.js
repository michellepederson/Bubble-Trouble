
"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// INITIALIZE GAME
function init() {

    var ground_y = 500;
    var cx = 300;
    // Returns y coordinate of the edge of the ground, its needed to place the player
    // on top of the ground edge
    var ground_edge = entityManager.generateGround(ground_y, 5);

    entityManager.generatePlayer(cx, ground_edge);
    entityManager.generateBackground();
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
var g_useGravity = false;
var g_useAveVel = true;
var g_renderSpatialDebug = false;


var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');
var KEY_SPATIAL = keyCode('X');

function processDiagnostics() {


    if (eatKey(KEY_HALT)) entityManager.haltBubbles();

    if (eatKey(KEY_RESET)) entityManager.resetBubbles();

    if(eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

}

// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// PRELOAD

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        bubble : "https://notendur.hi.is/~map56/T%C3%B6l308/images/bubble_2.png",

        //Background One
        bkgBulkhead1 : "https://notendur.hi.is/~map56/T%C3%B6l308/images/bkg-bulkhead/bulkhead-walls-back.png",
        bkgBulkhead2 : "https://notendur.hi.is/~map56/T%C3%B6l308/images/bkg-bulkhead/bulkhead-walls-pipes.png",
        bkgBulkhead3 : "https://notendur.hi.is/~map56/T%C3%B6l308/images/bkg-bulkhead/bulkhead-walls-platform.png",
        bkgBulkhead4 : "https://notendur.hi.is/~map56/T%C3%B6l308/images/bkg-bulkhead/cols.png",

        //Background Two
        bkgIndustrial1 : "https://notendur.hi.is/~map56/T%C3%B6l308/images/bkg-industrial/skill-desc_0003_bg.png",
        bkgIndustrial2 : "https://notendur.hi.is/~map56/T%C3%B6l308/images/bkg-industrial/skill-desc_0002_far-buildings.png",
        bkgIndustrial3 : "https://notendur.hi.is/~map56/T%C3%B6l308/images/bkg-industrial/skill-desc_0001_buildings.png",
        bkgIndustrial4 : "https://notendur.hi.is/~map56/T%C3%B6l308/images/bkg-industrial/skill-desc_0000_foreground.png",

        //Player Sprites
        idle : "https://notendur.hi.is/map56/T%C3%B6l308/images/player/idle-sheet.png",
        defeated : "https://notendur.hi.is/map56/T%C3%B6l308/images/player/deafeated-sheet.png",
        run : "https://notendur.hi.is/map56/T%C3%B6l308/images/player/run.png",
        shoot : "https://notendur.hi.is/map56/T%C3%B6l308/images/player/shoot-sheet.png",
        swipe : "https://notendur.hi.is/map56/T%C3%B6l308/images/player/swipe-sheet.png"
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

    //Player Sprites



    g_sprite_cycles = [ [], [], [], [], [], [] ];
    var sprite;
    var celWidth;
    var celHeight;
    var numCols;
    var numRows;
    var numCels;
    var image;

    g_sprite_setup = [];
    g_sprite_setup[0] = {
            celWidth : 186,
            celHeight : 227,
            numCols : 7,
            numRows : 1,
            numCels : 7,
            spriteSheet : g_images.defeated
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
            spriteSheet : g_images.shoot
    };
        g_sprite_setup[4] = {
            celWidth : 251,
            celHeight : 268,
            numCols : 4,
            numRows : 1,
            numCels : 4,
            spriteSheet : g_images.swipe
    };
            g_sprite_setup[5] = {
            celWidth : 196,
            celHeight : 268,
            numCols : 1,
            numRows : 1,
            numCels : 1,
            spriteSheet : g_images.jump
    };
    
    for(var i = 0; i < g_sprite_setup.length; i++){

         celWidth  = g_sprite_setup[i].celWidth;
         celHeight = g_sprite_setup[i].celHeight;
         numCols = g_sprite_setup[i].numCols;
         numRows = g_sprite_setup[i].numRows;
         numCels = g_sprite_setup[i].numCels;
         image = g_sprite_setup[i].spriteSheet;

    for (var row = 0; row < numRows; ++row) {

        for (var col = 0; col < numCols; ++col) {

            sprite = new Sprite(image, col * celWidth, row * celHeight,
                                celWidth, celHeight) 
            g_sprite_cycles[i].push(sprite);
            g_sprite_cycles[i].splice(numCels);
            console.log(sprite);     

        }
    }
}


    entityManager.init();
    init();

    main.init();
}

requestPreloads();