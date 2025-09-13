/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun á lyklaborðsatburðum til að hreyfa spaða
//
//    Hjálmtýr Hafsteinsson, september 2025
/////////////////////////////////////////////////////////////////
var canvas;
var gl;
var vPosition;
var score = 0;
var vertices = [vec2(-0.1, -0.95), vec2(0.0, -0.65), vec2(0.1, -0.95)];
var verticesCar1 = [
  vec2(-0.85, -0.55),
  vec2(-0.85, -0.30),
  vec2(-0.65, -0.55),
  vec2(-0.65, -0.30),
];
var verticesCar2 = [
  vec2(-0.85, -0.15),
  vec2(-0.85, 0.1),
  vec2(-0.65, -0.15),
  vec2(-0.65, 0.1),
];
var verticesCar3 = [
  vec2(-0.85, 0.50),
  vec2(-0.85, 0.25),
  vec2(-0.65, 0.50),
  vec2(-0.65, 0.25),
];
var bufferIdFrog;
var bufferCarId1;
var bufferCarId2;
var atTop = false;
var atBottom = false;
var pointingUp = true;
var pointingDown = false;
var car1Direction = 1;
var car2Direction = 1;
var car3Direction = 1;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 0.9);

  //
  //  Load shaders and initialize attribute buffers
  //
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Load the data into the GPU
  bufferIdFrog = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdFrog);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

  bufferCarId1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarId1);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar1), gl.DYNAMIC_DRAW);

  bufferCarId2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarId2);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar2), gl.DYNAMIC_DRAW);

  bufferCarId3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarId3);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesCar3), gl.DYNAMIC_DRAW);

  // Associate out shader variables with our data buffer
  vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Event listener for keyboard
  window.addEventListener("keydown", function (e) {
    var newYMove = 0.0;
    var newXMove = 0.0;
    switch (e.keyCode) {
      case 40: // niður ör
        newYMove = -0.4;
        break;
      case 39: //hægri ör
        newXMove = 0.25;
        break;
      case 38: // upp ör
        newYMove = 0.4;
        break;
      case 37: // vinstri ör
        newXMove = -0.25;
        break;
    }
    var canMove = true;
    for (i = 0; i < 3; i++) {
      var newX = vertices[i][0] + newXMove;
      console.log(newX);
      var newY = vertices[i][1] + newYMove;
      console.log(newY);
      if (newX < -1.0 || newX > 1.0 || newY < -1.0 || newY > 1.0) {
        canMove = false;
        break;
      }
    }
    if (canMove) {
      for (i = 0; i < 3; i++) {
        vertices[i][0] += newXMove;
        vertices[i][1] += newYMove;
      }

      if (vertices[1][1] >= 0.94) {
        if (!atTop) {
          atTop = true;
          keepScore();
          var tempY = vertices[1][1];
          vertices[1][1] = vertices[0][1];
          vertices[0][1] = tempY;
          vertices[2][1] = tempY;
          pointingDown = true;
          pointingUp = false;
        }
      } else {
        atTop = false;
      }

      if (vertices[1][1] <= -0.94) {
        if (!atBottom) {
          atBottom = true;
          keepScore();
          var tempY = vertices[1][1];
          vertices[1][1] = vertices[0][1];
          vertices[0][1] = tempY;
          vertices[2][1] = tempY;
          pointingUp = true;
          pointingDown = false;
        }
      } else {
        atBottom = false;
      }
      console.log("atTop:", atTop);
      console.log("atBottom:", atBottom);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdFrog);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
  });

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdFrog);
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  if(verticesCar1[2][0] >= 0.95) {
    car1Direction = -1;
  }
  else if(verticesCar1[0][0] <= -0.95) {
    car1Direction = 1;
  } 

  for(i = 0; i < 4; i++) {
    verticesCar1[i][0] += 0.003 * car1Direction;
  }

  if(verticesCar2[2][0] >= 0.95) {
    car2Direction = -1;
  }
  else if(verticesCar2[0][0] <= -0.95) {
    car2Direction = 1;
  } 

  for(i = 0; i < 4; i++) {
    verticesCar2[i][0] += 0.004 * car2Direction;
  }

  if(verticesCar3[2][0] >= 0.95) {
    car3Direction = -1;
  }
  else if(verticesCar3[0][0] <= -0.95) {
    car3Direction = 1;
  } 

  for(i = 0; i < 4; i++) {
    verticesCar3[i][0] += 0.009 * car3Direction;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarId1);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(verticesCar1));
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarId2);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(verticesCar2));
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCarId3);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(verticesCar3));
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  if(checkIntersect()) {
    reset();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdFrog);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
  }


  window.requestAnimFrame(render);
}

function keepScore() {
  if(atTop || atBottom) {
    score++;
    updateScore();
    console.log(score);
  }
}

function updateScore() {
  var scoreElement = document.getElementById("score");
  if(scoreElement) {
    scoreElement.textContent = score;
  }
}

function checkIntersect() {
  var frogMinX = Math.min(vertices[0][0], vertices[1][0], vertices[2][0]);
  var frogMaxX = Math.max(vertices[0][0], vertices[1][0], vertices[2][0]);
  var frogMinY = Math.min(vertices[0][1], vertices[1][1], vertices[2][1]);
  var frogMaxY = Math.max(vertices[0][1], vertices[1][1], vertices[2][1]);


  var car1MinX = Math.min(verticesCar1[0][0], verticesCar1[1][0], verticesCar1[2][0], verticesCar1[3][0]);
  var car1MaxX = Math.max(verticesCar1[0][0], verticesCar1[1][0], verticesCar1[2][0], verticesCar1[3][0]);
  var car1MinY = Math.min(verticesCar1[0][1], verticesCar1[1][1], verticesCar1[2][1], verticesCar1[3][1]);
  var car1MaxY = Math.max(verticesCar1[0][1], verticesCar1[1][1], verticesCar1[2][1], verticesCar1[3][1]);
  
  var car2MinX = Math.min(verticesCar2[0][0], verticesCar2[1][0], verticesCar2[2][0], verticesCar2[3][0]);
  var car2MaxX = Math.max(verticesCar2[0][0], verticesCar2[1][0], verticesCar2[2][0], verticesCar2[3][0]);
  var car2MinY = Math.min(verticesCar2[0][1], verticesCar2[1][1], verticesCar2[2][1], verticesCar2[3][1]);
  var car2MaxY = Math.max(verticesCar2[0][1], verticesCar2[1][1], verticesCar2[2][1], verticesCar2[3][1]);

  var car3MinX = Math.min(verticesCar3[0][0], verticesCar3[1][0], verticesCar3[2][0], verticesCar3[3][0]);
  var car3MaxX = Math.max(verticesCar3[0][0], verticesCar3[1][0], verticesCar3[2][0], verticesCar3[3][0]);
  var car3MinY = Math.min(verticesCar3[0][1], verticesCar3[1][1], verticesCar3[2][1], verticesCar3[3][1]);
  var car3MaxY = Math.max(verticesCar3[0][1], verticesCar3[1][1], verticesCar3[2][1], verticesCar3[3][1]);

  var car1Collision = !(frogMaxX < car1MinX || frogMinX > car1MaxX || frogMaxY < car1MinY || frogMinY > car1MaxY);
  var car2Collision = !(frogMaxX < car2MinX || frogMinX > car2MaxX || frogMaxY < car2MinY || frogMinY > car2MaxY);
  var car3Collision = !(frogMaxX < car3MinX || frogMinX > car3MaxX || frogMaxY < car3MinY || frogMinY > car3MaxY);

  if(car1Collision) {
    console.log("Árekstur: Bíll 1");
    return true;
  }
  if(car2Collision) {
    console.log("Árekstur: Bíll 2");
    return true;
  }
  if(car3Collision) {
    console.log("Árekstur: Bíll 3");
    return true;
  }
  return false;
}

function reset() {
  vertices = [vec2(-0.1, -0.95), vec2(0.0, -0.65), vec2(0.1, -0.95)];
  score = 0;
  pointingUp = true;
  pointingDown = false;
  atTop = false;
  atBottom = false;
  updateScore();
  
}
