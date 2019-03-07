var cols = 5;
var rows = 5;
var grid = new Array(cols);

var openSet = []; // set of nodes already evaluated
var closedSet = []; // set of currently discovered nodes that are not evaluated yet

var start;
var end;

var w, h;

function removeFromArray(array, element) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] == element) {
      array.splice(i, 1);
    }
  }
}

function Spot(i, j) {
  this.x = i;
  this.y = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.show = function(col) {
    fill(col);
    noStroke();
    rect(this.x * w, this.y * h, w - 1, h - 1);
  };
}

function setup() {
  createCanvas(400, 400);
  console.log("A*");

  w = width / cols;
  h = height / rows;

  //   Making a 2d array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];

  openSet.push(start);

  console.log(grid);
}

// this draw loop acts as a while loop in p5 js
function draw() {
  if (openSet.length > 0) {
    // we can keep going
    var winner = 0; // has the lowset f
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }

    var current = openSet[winner];

    if (openSet[winner] === end) {
      console.log("DONE");
    }

    // openSet.remove(current);
    removeFromArray(openSet, current);
    closedSet.push(current);
  } else {
    // no solution
  }

  background(0);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }
}
