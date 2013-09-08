var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI") 
        .setup({ 
        width: 1500,
        height: 700}) 
        .controls().touch() 

var Pointer = {
  points: 0,
  draw: function () {
    console.log(this.points);
    $( "#points" ).text(this.points);
  }
};

var Lifer = {
  lives: 5,
  draw: function() {
    console.log(this.lives);
    $("#lives").text(this.lives);
    if (Lifer.lives < 1){
        Q.stageScene('endGame', 1, {
          label: "You're toast!!"
        });
    }

  }
};


$(document).ready(function() {
  Pointer.draw();
});

$(document).ready(function() {
  Lifer.draw();
});

var player;


Q.Sprite.extend("Player",{ //extends the sprite class to mean Player
  init: function(p) { //initializes function
    this._super(p, { sheet: "player", x: 410, y: 510, gravity: 0 , speed: 700, collisionMask: 2}); //says where the player starts and calls sprite's constuctor function. this._super is to override Q.Sprite functions
    this.add('2d, platformerControls');

  }
});

Q.Sprite.extend("FallingObject",{
  init: function(p) {
    this._super(Q._defaults(p, {sheet: 'tiger', vx: 0, gravity:0.025, collisionMask: 2}));
    this.add('2d');
    this.on("step", function() {
      if(this.p.y > 360) {
        this.p.collisionMask = 2;
      }
      else {
        this.p.collisionMask = 0;
      };
    });
    this.collided = false;

    this.on("bump.bottom", function(collision) {
      if(collision.obj.isA("Player") && this.collided == false){
        console.log(collision);
        this.collided = true;
        this.caught();
      }
      this.destroy();
    })  
  }
});

Q.FallingObject.extend("RegularOat",{
  init: function(p) {
    this._super(Q._defaults(p, { sheet: 'regularoat', vx: 0 })); //gets the sprite style sheet for the enemy 
  }, 
  caught: function() {
    Pointer.points = Pointer.points + 1;
    Pointer.draw();
  } 
});

Q.FallingObject.extend("Tiger",{
   init: function(p) {
    this._super(Q._defaults(p, { sheet: 'tiger', vx: 0 })); //gets the sprite style sheet for the enemy 
  }, 
  caught: function() {
    Lifer.lives = Lifer.lives - 1;
    Lifer.draw();
  }
});

Q.FallingObject.extend("FireBall",{
  init: function(p) {
    this._super(Q._defaults(p, { sheet: 'fireball', vx: 0 }));
   },
    caught: function() {
    Lifer.lives = Lifer.lives - 2;
    Lifer.draw();
  }
});

 Q.FallingObject.extend("PoisonOat",{
  init: function(p) {
    this._super(Q._defaults(p, { sheet: 'poisonoat', vx: 0 })); //gets the sprite style sheet for the enemy 
  },
  caught: function() {
    Pointer.points = Pointer.points - 5;
    Pointer.draw();
  }
});

Q.FallingObject.extend("DoubleOat",{
  init: function(p) {
    this._super(Q._defaults(p, { sheet: 'doubleoat', vx: 0 })); //gets the sprite style sheet for the enemy
    this.add('2d'); //aibounce makes them bounce off of walls
  },
  caught: function() {
    Pointer.points = Pointer.points + 5;
    Pointer.draw();
  }
});

Q.FallingObject.extend("Toast",{
  init: function(p) { 
    this._super(Q._defaults(p, { sheet: 'toast', vx: 0 })); //gets the sprite style sheet for the enemy
    this.add('2d'); 
  },
  caught: function() {
    Lifer.lives = Lifer.lives + 1;
    Lifer.draw();
  }
});

Q.FallingObject.extend("FrootLoop",{
  init: function(p) {
    this._super(Q._defaults(p, { sheet: 'doubleoat', vx: 0 }));
     this.add('2d');
  },
  caught: function() {
    Pointer.points = Pointer.points + 10;
    Pointer.draw();
  }
});


Q.scene("level1",function(stage) {
  stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level.json', sheet: 'tiles' }));
  player = stage.insert(new Q.Player());
  Lifer.lives = 5;
  Lifer.draw();
  Pointer.points = 0;
  Pointer.draw();
  
  // stage.add("viewport").follow(player);

  setInterval(function(){stage.insert(new Q.RegularOat({ x: Math.floor(Math.random()*1500), y: -500 }));}, Math.floor(Math.random()*6000));
  setInterval(function(){stage.insert(new Q.Tiger({ x: Math.floor(Math.random()*1500), y: -500 }));}, Math.floor(Math.random()*6000));
  setInterval(function(){stage.insert(new Q.PoisonOat({ x: Math.floor(Math.random()*1500), y: -500 }));}, Math.floor(Math.random()*6000));
  setInterval(function(){stage.insert(new Q.DoubleOat({ x: Math.floor(Math.random()*1500), y: -500 }));}, Math.floor(Math.random()*6000));
  setInterval(function(){stage.insert(new Q.FireBall({ x: Math.floor(Math.random()*1500), y: -500 }));}, Math.floor(Math.random()*6000));
  setInterval(function(){stage.insert(new Q.FrootLoop({ x: Math.floor(Math.random()*1500), y: -500 }));}, Math.floor(Math.random()*6000));
  setInterval(function(){stage.insert(new Q.Toast({ x: Math.floor(Math.random()*1500), y: -500 }));}, Math.floor(Math.random()*6000));
});

Q.scene('endGame',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
  player.destroy();

  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play Again" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  });
  box.fit(20);
});

Q.load("sprites.png, sprites.json, level.json, tiles.png", function() {
  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 }); 
  Q.compileSheets("sprites.png","sprites.json");
  Q.stageScene("level1"); 
});