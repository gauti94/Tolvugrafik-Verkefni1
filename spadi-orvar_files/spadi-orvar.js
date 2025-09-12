/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun á lyklaborðsatburðum til að hreyfa spaða
//
//    Hjálmtýr Hafsteinsson, september 2025
/////////////////////////////////////////////////////////////////
var canvas;
var gl;


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 0.9 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var vertices = [
        vec2( -0.1, -1.0 ),
        vec2( 0.0, -0.85),
        vec2( 0.1, -1.0)
    ];
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        var newYMove = 0.0;
        var newXMove = 0.0;
        switch( e.keyCode ) {
            case 40:	// niður ör
                newYMove = -0.4;
                break;
            case 39: //hægri ör
                newXMove = 0.25;
                break;
            case 38:	// upp ör
                newYMove = 0.4;
                break;
            case 37: // vinstri ör
                newXMove = -0.25;
                break;
        }
        var canMove = true;
        for(i = 0; i < 3; i++) {
            var newX = vertices[i][0] + newXMove;
            var newY = vertices[i][1] + newYMove;
            if (newX < -1.0 || newX > 1.0 || newY< -1.0 || newY> 1.0) {
                canMove = false;
                break;
            }
        }
        if (canMove) {
            for( i = 0; i < 3; i++) {
                vertices[i][0] += newXMove;
                vertices[i][1] += newYMove;

            }
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    } );

    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    window.requestAnimFrame(render);
}
