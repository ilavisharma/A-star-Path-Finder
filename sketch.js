var cols = 25;
var rows = 25;
var grid = new Array(cols);

var openSet = []; // set of nodes already evaluated
var closedSet = []; // set of currently discovered nodes that are not evaluated yet

var start;
var end;

var w, h;
var path = [];

function removeFromArray(array, element) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] == element) {
      array.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j); // dist is p5 func. to calculate distance
  return d;
}

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.previous = undefined;
  this.neighbors = [];
  this.wall = false;
  // generate random objects/walls
  if (random(1) < 0.3) {
    this.wall = true;
  }
  this.show = function(col) {
    fill(col);
    if (this.wall) {
      fill(0);
    }
    noStroke();
    ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
  };
  //   add the surrounding neighbours
  this.addNeighbors = function(grid) {
    if (i < cols - 1) {
      this.neighbors.push(grid[this.i + 1][this.j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[this.i - 1][this.j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[this.i][this.j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[this.i][this.j - 1]);
    }
    // diagonal neighbors
    if (i > 0 && j < 0) {
      this.neighbors.push(grid[this.i - 1][this.j - 1]);
    }
    if (i < cols - 1 && j < 0) {
      this.neighbors.push(grid[this.i + 1][this.j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[this.i - 1][this.j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[this.i + 1][this.j + 1]);
    }
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

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];

  // start and end should never be a wall
  start.wall = false;
  end.wall = false;

  openSet.push(start);
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
      noLoop();
      alert("DONE");
    }

    // openSet.remove(current);
    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;
        var newPath = false; // assume that new path hasn't been found
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
  } else {
    alert("NO SOLUTION");
    // no solution
    noLoop();
    return;
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

  // Find the path
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  // TODO: remove this loop
  for (var i = 0; i < path.length; i++) {
    // path[i].show(color(0, 0, 255));
  }

  noFill();
  stroke(255);
  strokeWeight(w / 2);
  beginShape();

  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
  endShape();
}
