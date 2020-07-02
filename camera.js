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
            clickToPlay: true,
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

	var ANote0 = BABYLON.MeshBuilder.CreateBox("ANote0", {width: 7.646700, height: 5.726200, depth: 0.100000 }, scene);
	ANote0.position = new BABYLON.Vector3(4,2,40);
	var mat = new BABYLON.StandardMaterial("ANote0Mat",scene);
	mat.diffuseColor = new BABYLON.Color4(0, 0, 0, 1);
	ANote0.material = mat;
	var planeOpts = {
			height: 5.4762, 
			width: 7.3967, 
			sideOrientation: BABYLON.Mesh.BACKSIDE
	};
	var ANote0Video = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, scene);
	var vidPos = (new BABYLON.Vector3(0,0,0.1)).addInPlace(ANote0.position);
    ANote0Video.position = vidPos;
	var ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
	var ANote0VideoVidTex = new BABYLON.VideoTexture("vidtex","textures/babylonjs.mp4", scene);
	ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
	ANote0VideoMat.roughness = 1;
	ANote0VideoMat.emissiveColor = new BABYLON.Color3.White();
	ANote0Video.material = ANote0VideoMat;
	scene.onPointerObservable.add(function(evt){
			if(evt.pickInfo.pickedMesh === ANote0Video){
                //console.log("picked");
					if(ANote0VideoVidTex.video.paused)
						ANote0VideoVidTex.video.play();
					else
						ANote0VideoVidTex.video.pause();
                    console.log(ANote0VideoVidTex.video.paused?"paused":"playing");
			}
	}, BABYLON.PointerEventTypes.POINTERPICK);


   
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
