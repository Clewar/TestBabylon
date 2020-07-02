var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var dome, tickCount = -240, zoomLevel = 1;

var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("arcR", Math.PI/2, Math.PI/2, 15, BABYLON.Vector3.Zero(), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

	camera.inputs.attached.mousewheel.detachControl(canvas);
	
	// Domo
    dome = new BABYLON.VideoDome(
        "testdome",
        ["Media/uptale360.mp4"],
        {
            resolution: 32,
            clickToPlay: false,
            useDirectMapping: false
        },
        scene
    );

    scene.registerAfterRender(function() {
        tickCount++;
        if(zoomLevel == 1) {
			if(tickCount >= 0) {
				dome.fovMultiplier = (Math.sin(tickCount / 100) * 0.5) + 1.0;
			}
		} else {
			dome.fovMultiplier = zoomLevel;
		}
    });

    scene.onPointerObservable.add(function(e) {
        if(dome === undefined) { return; }
        zoomLevel += e.event.wheelDelta * -0.0005;
        if(zoomLevel < 0){ zoomLevel = 0; }
        if(zoomLevel > 2){ zoomLevel = 2; }
        if(zoomLevel == 1) {
            tickCount = -60;
        }
    }, BABYLON.PointerEventTypes.POINTERWHEEL);
	// Fin Domo

	// Tv
   
    //console.log(ANote0Video);
    return scene;

};


var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});
