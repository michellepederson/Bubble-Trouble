
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
    entityManager.generateBackground(g_level);
    makeBricks(g_level);
    addBubbles(g_level);
    g_numberOfWaves = g_waves[g_level] - 1;
    var time = g_waveTime[g_level];
    g_powerUpTimeOuts = []
    g_timeOuts = [
        setTimeout(function(){
        addBubbles(g_level);
    }, time)]
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
var g_bricks = false;
var g_bricksFlag = 1;

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');
var KEY_SPATIAL = keyCode('X');
var KEY_GRAVITY = keyCode('G');
var KEY_SHIELD = keyCode('C');
var KEY_BRICK = keyCode('M');

function processDiagnostics() {
    if (eatKey(KEY_HALT)) entityManager.haltBubbles();

    if (eatKey(KEY_RESET)) entityManager.resetBubbles();
    if(eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;

    if(eatKey(KEY_GRAVITY)) g_gravity = !g_gravity;

    if(eatKey(KEY_BRICK)) {
        g_bricks = !g_bricks;
        if(g_bricks) makeBricks(g_level);
        else killbricks();
    }

    if(eatKey(KEY_SHIELD)) g_shield = !g_shield;
}

// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);
    // Blackhole would be object in entityManager if it has some behavior (features)
    if (g_gravity) drawBlackHole();
    //if(g_bricks) makeBricks();

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}

// BLACKHOLE-DRAWING
function drawBlackHole() {
    g_sprites.sauron.drawCentredAt(ctx, planetX, planetY, 0);
}


// Bubble ADDING
function addBubbles(level) {
    var timeOut;
    g_timeOuts = [];
    var bubblesDescr = g_bubblesDescr[level];
    var time = g_waveTime[level];
    var numberOfBubbles = bubblesDescr.length;
    // Time between insertion of bubbles for each wave
    var timeInterval = 2000;
    for(var i = 0; i<numberOfBubbles-1; i += 1) {
        // Make Bubble after 2 secs
        timeOut = setTimeout(entityManager.addBubble(new Bubble(bubblesDescr[i]), timeInterval));
        g_timeOuts.push(timeOut);
    }
    if (g_numberOfWaves > 0) {
        // Last timeout resets the global g_timeOuts back to its "original" value
        timeOut = setTimeout(function() {
            entityManager.addBubble(new Bubble(bubblesDescr[numberOfBubbles-1]));
            // Rest g_timeOuts
            g_timeOuts = [
                setTimeout(function() {
                    addBubbles(level)
                }, time)
            ];
        }, timeInterval*numberOfBubbles-1);
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
    for(var i = 0; i<g_powerUpTimeOuts; i += 1) {
        if(g_powerUpTimeOuts[i]) {
            clearTimeout(g_powerUpTimeOuts[i]);
        }
    }
    spatialManager.reset();
    entityManager.reset();
}

function playerKilled() {
    resetGame();
    g_playerIsDead = false;
    // Code to be placed elsewhere, here for debugging purposes only
    if (g_level < 3) g_level += 1;
    else g_level = 1;
    init();
    main.gameStart();
}

function levelComplete() {
    resetGame();
    g_playerIsDead = false;
    g_level += 1;
    init();
    main.gameStart();
}


function makeBricks(level){
    switch(level) {
        case 2:
        entityManager._bricks.push(new Brick ({cx:   0, cy: 400}));
        entityManager._bricks.push(new Brick ({cx: 120, cy: 300}));
        entityManager._bricks.push(new Brick ({cx: 300, cy: 200}));
        entityManager._bricks.push(new Brick ({cx: 360, cy: 200}));
        entityManager._bricks.push(new Brick ({cx: 420, cy: 200}));
        entityManager._bricks.push(new Brick ({cx: 480, cy: 200}));
        entityManager._bricks.push(new Brick ({cx: 540, cy: 200}));
        g_bricks = true;
        break;

        case 3:
        entityManager._bricks.push(new Brick ({cx: 300, cy: 100}));
        entityManager._bricks.push(new Brick ({cx: 360, cy: 100}));
        entityManager._bricks.push(new Brick ({cx: 420, cy: 100}));
        entityManager._bricks.push(new Brick ({cx: 480, cy: 100}));
        entityManager._bricks.push(new Brick ({cx: 540, cy: 100}));
        g_bricks = true;

        var height = Brick.prototype.Height;
        var deg90 = 90 * Math.PI / 180;
        entityManager._bricks.push(new Brick ({cx: 300, cy: 200 , rotation : deg90}));
        entityManager._bricks.push(new Brick ({cx: 300, cy: 200+height*1 ,rotation : deg90}));
        entityManager._bricks.push(new Brick ({cx: 300, cy: 200+height*2, rotation : deg90}));
        entityManager._bricks.push(new Brick ({cx: 300, cy: 200+height*3, rotation : deg90}));
        break;
        default:
        g_bricks = false;
        break;
    }
}

function killbricks(){
    for(var i = entityManager._bricks.length-1; i >= 0; i--){

        // didn't get KILL_ME_NOW to work so I use .pop(); for now.
        entityManager._bricks.pop();
    }
}


      //START SCREEN
function startScreen() {

    entityManager.init();
    init();
    main.init();
    document.getElementById('startScreen').style.display = "none";
    start.play();

    // Handle "down" and "move" events the same way.
    window.addEventListener("mousedown", handleMouse);
    window.addEventListener("mousemove", handleMouse);

}

/// PRELOAD

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        bubble : "img/bubbles/bubble_2.png",
        pop : "img/bubbles/pop/pop-sheet.png",


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

        //Background Three
        bkgUnderwater1 : "img/bkg-underwater/far.png",
        bkgUnderwater2 : "img/bkg-underwater/sand.png",
        bkgUnderwater3 : "img/bkg-underwater/foreground-merged.png",

        //Spikes
        spike: "img/spike.png",

        //Wire and arrow
        wire : "img/player/chain.png",
        arrow : "img/player/arrow.png",
        //Separate spike sprite because we change the scale for the wire/powerup arrows
        spike : "img/player/arrow.png",

        //Platform aka purple turds
        platform : "img/tile_cave_platform.png",

        //Powerups
        shield : "img/powerups/shield.png",
        powerupShield : "img/powerups/powerup-shield.png",
        powerupPotion : "img/powerups/powerup-potion.png",
        powerupOrb : "img/powerups/powerup-orb.png",
        powerupRing : "img/powerups/powerup-ring.png",
        duck : "img/powerups/duck.png",
        //gun : "img/powerups/gun.png",
        sword : "img/powerups/powerup-sword.png",
        //trap : "img/powerups/trap.png",
        grenade : "img/powerups/grenade.png",
        grenadeLive : "img/powerups/grenade-live.png",
        sauron : "img/powerups/sauron.png",

        //BOOOM
        explosion1 : "img/powerups/explosion/explosion1.png",
        explosion2 : "img/powerups/explosion/explosion2.png",
        explosion3 : "img/powerups/explosion/explosion3.png",
        explosion4 : "img/powerups/explosion/explosion4.png",
        explosion5 : "img/powerups/explosion/explosion5.png",
        explosion6 : "img/powerups/explosion/explosion6.png",

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
var g_sprites_explosion = [];


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

    //Background Three
    g_sprites.bkgUnderwater1 = new Sprite(g_images.bkgUnderwater1);
    g_sprites.bkgUnderwater2 = new Sprite(g_images.bkgUnderwater2);
    g_sprites.bkgUnderwater3 = new Sprite(g_images.bkgUnderwater3);

    //Spikes
    g_sprites.spike = new Sprite (g_images.spike);

    //Wire and arrow
    g_sprites.wire = new Sprite(g_images.wire);
    g_sprites.arrow = new Sprite(g_images.arrow);

    //Platform tile
    g_sprites.platform = new Sprite(g_images.platform);

    //Powerups
    g_sprites.shield = new Sprite(g_images.shield);
    g_sprites.powerupShield = new Sprite(g_images.powerupShield);
    g_sprites.powerupPotion = new Sprite(g_images.powerupPotion);
    g_sprites.powerupOrb = new Sprite(g_images.powerupOrb);
    g_sprites.powerupRing = new Sprite(g_images.powerupRing);
    g_sprites.duck = new Sprite(g_images.duck);
    //g_sprites.gun = new Sprite(g_images.gun);
    g_sprites.sword = new Sprite(g_images.sword);
    //g_sprites.trap = new Sprite(g_images.trap);
    g_sprites.grenade = new Sprite(g_images.grenade);
    g_sprites.grenadeLive = new Sprite(g_images.grenadeLive);
    g_sprites.sauron = new Sprite(g_images.sauron);

    //Explosion
    g_sprites_explosion[0] = new Sprite(g_images.explosion1);
    g_sprites_explosion[1] = new Sprite(g_images.explosion2);
    g_sprites_explosion[2] = new Sprite(g_images.explosion3);
    g_sprites_explosion[3] = new Sprite(g_images.explosion4);
    g_sprites_explosion[4] = new Sprite(g_images.explosion5);
    g_sprites_explosion[5] = new Sprite(g_images.explosion6);


    //Player Animations
    g_sprite_cycles = [ [], [], [], [], [], [], [], [] ];
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
            offsetY: 22
    };


            g_sprite_setup[7] = {
            celWidth : 172,
            celHeight : 168,
            numCols : 3,
            numRows : 1,
            numCels : 3,
            spriteSheet : g_images.pop

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
}

requestPreloads();
