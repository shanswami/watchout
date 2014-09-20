// start slingin' some d3 here.

/////////////////////////////////////////


/////////////////////////////////////////
var radius = 8;
var enemyRadius = 20;
var gameOptions = {
  height: 600,
  width: 1000,
  nEnemies: 10,
  padding: 10
}

var gameStats = {
  highScore: 0,
  currentScore: 0,
  collisions: 0
}
// lets create a board.
var board = d3.select(".container").append("div").selectAll("svg")
    .data([{x: gameOptions.width/2, y: gameOptions.height/2}])
  .enter().append("svg")
    .attr("width", gameOptions.width)
    .attr("height", gameOptions.height)
    .attr("padding", gameOptions.padding);
  // build algorithm to make them move about randomly

// Define enemy class
var Enemy = function(){
  this.x = null;
  this.y = null;

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
  var enemies = d3.select('.container svg').selectAll('.enemy').data(data)
  .enter()
  .append("circle")
  .attr("r", enemyRadius)
  .attr("cx", function(d) {
    d.setCoordinates(gameOptions.width, gameOptions.height);
    return d.x;
  })
  .attr("cy", function(d) {
    return d.y;
  })
  .attr('class', 'enemy')

  setInterval(function() {
    enemies.transition()
    .duration(3000)
    .attr("cx", function(d) { return Math.random() * gameOptions.width })
    .attr("cy", function(d) { return Math.random() * gameOptions.height });
  }, 4000)
};

// detect collisions with enemies
// in one instance
// calculates player poisition as well as every single enemy position
// using pythagorean eq, store distance from every single enemy to the player
// if collision : do something
// wrap everything in set interval of 10 ms





// create a player

  // make this player draggable using d3 and svg
var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", dragmove);

board.append("circle")
  .attr('class', 'player')
  .attr("r", radius)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .call(drag);

function dragmove(d) {
  d3.select(this)
      .attr("cx", d.x = Math.max(radius, Math.min(gameOptions.width - radius, d3.event.x)))
      .attr("cy", d.y = Math.max(radius, Math.min(gameOptions.height - radius, d3.event.y)));
}

// Function calls!
updateEnemies(buildEnemyList(40));
