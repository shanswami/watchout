// start slingin' some d3 here.

var radius = 15;
var theColor = d3.scale.category10();
var gameOptions = {
  height: 600,
  width: 1000,
  nEnemies: 100,
  padding: 10
}


var gameStats = {
  highScore: 0,
  currentScore: 0,
  collisions: d3.select(".collisions span").data([0]).enter().append(".counter")
}
// lets create a board.
var board = d3.select(".container")
  .append("div").selectAll("svg")
  .data([{x: gameOptions.width/2, y: gameOptions.height/2}])
  .enter()
  .append("svg")
  .attr("width", gameOptions.width)
  .attr("height", gameOptions.height)
  .attr("padding", gameOptions.padding);
  // build algorithm to make them move about randomly

// Define enemy class
var Enemy = function(){
  this.x = null;
  this.y = null;
  this.radius = Math.random() * 12 + 6;
  this.color = theColor;

  this.setCoordinates = function(width, height){
    this.x = Math.random() * width;
    this.y = Math.random() * height;
  }

}
var buildEnemyList = function(num) {
  var list = [];
  for(var i = 0; i< num; i++) {
    list.push(new Enemy());
  }
  return list;
}

// populate board with enemies

var updateEnemies = function(data) {
  // var enemies = d3.select('.container svg').selectAll('.enemy').data(data)
  var enemies = d3.select('.container svg').selectAll('.enemy').data(data)
  .enter()
  .append("circle")
  .attr("r", function(d) {
    return d.radius;
  })
  .attr("cx", function(d) {
    d.setCoordinates(gameOptions.width, gameOptions.height);
    return d.x;
  })
  .attr("cy", function(d) {
    return d.y;
  })
  .attr("class", "enemy")
  .attr("fill", function(d, i) {
    return d.color(i % 4);
  })
  // .attr("xlink:href", "ani_wasp.gif")

  setInterval(function() {
    enemies.transition()
    .duration(5000)
    .tween('.enemy', customTween);
  }, 4000)
};

// detect collisions with enemies
// in one instance
// calculates player poisition as well as every single enemy position
// using pythagorean eq, store distance from every single enemy to the player
// if collision : do something
// wrap everything in set interval of 10 ms

var checkCollision = function(enemy, callback) {

  var player = d3.select(".player");
  _.each(player, function() {
    var threshold = player.attr('r') ;
    var xDiff = parseFloat(enemy.attr('cx')) - player.attr('cx');
    var yDiff = parseFloat(enemy.attr('cy')) - player.attr('cy');

    var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
    // console.log(separation);
    if(separation < threshold){
      callback(player, enemy);
    }
  });
}

var onCollision = function() {
  console.log("this is working, probably");
  gameStats.collisions++;
}

var customTween = function() {
  var enemy = d3.select(this);
  var StartPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  };
  // console.log(StartPos.x, StartPos.y)
  var endPos = {
    x: Math.random() * gameOptions.width,
    y: Math.random() * gameOptions.height
  }
  return function(t) {
    checkCollision(enemy, onCollision)
    var enemyNextPos = {
      x: StartPos.x + (endPos.x - StartPos.x)*t,
      y: StartPos.y + (endPos.y - StartPos.y)*t
    }
    // console.log(dNextPos)
    enemy.attr('cx', enemyNextPos.x);
    enemy.attr('cy', enemyNextPos.y);
  }


}


// create a player

  // make this player draggable using d3 and svg
var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on("drag", dragmove);

board.append("circle")
  .attr('class', 'player')
  .attr('r', radius)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .call(drag);

function dragmove(d) {
  d3.select(this)
    .attr("cx", d.x = Math.max(radius, Math.min(gameOptions.width - radius, d3.event.x)))
    .attr("cy", d.y = Math.max(radius, Math.min(gameOptions.height - radius, d3.event.y)));
}

// Function calls!
updateEnemies(buildEnemyList(gameOptions.nEnemies));
