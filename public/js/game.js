var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI") 
        .setup({ maximize: true }) 
        .controls().touch() 

Q.Sprite.extend("Player",{ //extends the sprite class to mean Player
  init: function(p) { //initializes function
    this._super(p, { sheet: "player", x: 410, y: 90 }); //says where the player starts and calls sprite's constuctor function
    this.add('2d, platformerControls');
    this.p.gravity = 0
    
    this.on("hit.sprite",function(collision) {
      if(collision.obj.isA("Tower")) { //if the object the player collides into is a tower
        Q.stageScene("endGame",1, { label: "You Won!" }); // the game will end with a dialog box saying you won
        this.destroy(); //ends game
      }
    });
  }
});

Q.Sprite.extend("Tower", { //makes tower another extension of Sprite
  init: function(p) {
    this._super(p, { sheet: 'tower' });  
  }
});

Q.Sprite.extend("Enemy",{
  init: function(p) {
<<<<<<< HEAD
    this._super(p, { sheet: 'enemy', vx: 100 }); //gets the sprite style sheet for the enemy
    this.add('2d, aiBounce'); //aibounce makes them bounce off of walls
    
    this.on("bump.left,bump.right,bump.bottom",function(collision) { //if the enemy is bumped from any of the directions left right bottom
      if(collision.obj.isA("Player")) { //and the bumper is a player
        Q.stageScene("endGame",1, { label: "You Died" }); //the game over dialog pops up
        collision.obj.destroy(); //the sprite is destroyed
=======
    this._super(p, { sheet: 'enemy', vx: 0 });
    this.add('2d, aiBounce');
    
    this.on("bump.bottom",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("endGame",1, { label: "You Died" }); 
        collision.obj.destroy(); 
>>>>>>> c27d57e59723eaa670291ec86c0d5ea1ff053ab4
      }
    });
    
    this.on("bump.top",function(collision) { //if the player bumps the enemy on top it will destroy the enemy sprite
      if(collision.obj.isA("Player")) { 
        this.destroy(); 
        collision.obj.p.vy = -300; //reverses the direction of the player by 300
      }
    });
  }
});

Q.scene("level1",function(stage) {
  stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level.json', sheet: 'tiles' }));
  var player = stage.insert(new Q.Player());
  
  stage.add("viewport").follow(player);
  
  stage.insert(new Q.Enemy({ x: 700, y: -300 }));
  stage.insert(new Q.Enemy({ x: 800, y: -300 }));
  
//  stage.insert(new Q.Tower({ x: 0, y: 0 }));
});

Q.scene('endGame',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
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