var demo = {
    scene: "Espilit",
    incremental: false,
    binary: true,
    doNotUseCDN: false,
    collisions: true,
    offline: false,
    onload: function() {
        scene.autoClear = true;
        scene.createOrUpdateSelectionOctree();
        scene.getMeshByName("Sol loin").useVertexColors = false;
        BABYLON.Mesh.checkCollisions = true;
        scene.gravity.scaleInPlace(0.5);
        let camera = scene.activeCamera;
        camera.checkCollisions = true;
        var cameraBox = BABYLON.Mesh.CreateBox("Box1", 1, scene);
        cameraBox.position = new BABYLON.Vector3(0, 2, 1);
        cameraBox.parent = camera;
        cameraBox.isPickable = false;
        camera.speed = 0.1;
        camera.ellipsoid = new BABYLON.Vector3(.4, .8, .4);
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.1;
        scene.fogColor = scene.clearColor;


        // Load the sound and play it automatically once ready
        var footsteps = new BABYLON.Sound("Footsteps", "./build/assets/footsteps.ogg", scene, null, {
            loop: true,
            autoplay: true,
            volume: 0
        });

        let meshNames = new Map();
        meshNames.set('Murs pans', 'Pillar/Stairs');
        meshNames.set('Verre table corbu', 'Glass Table');
        meshNames.set('Panneau1', 'Large downstairs sign in entrance hall');
        meshNames.set('Panneau2', 'Large downstairs poster in entrance hall');
        meshNames.set('Bouteille02', 'Wine bottle');
        meshNames.set('Bouteille01', 'Wine bottle');
        //meshNames.set('Sols', 'Floor');
        meshNames.set('Chaises coussins3', 'Chairs');
        meshNames.set('Chaises coussins2', 'Chairs');
        meshNames.set('Chaises coussins1', 'Chairs');
        meshNames.set('Tables bonetto', 'Stone tables');
        meshNames.set('Tapism', 'Carpet Rug');
        meshNames.set('Verres', 'Glass');
        meshNames.set('Bandes lum', 'Light');
        meshNames.set('line01', 'Glass partition upstairs');
        meshNames.set('Metal noir', 'Black metal');
        for (let i = 1; i < 45; i++) {
            meshNames.set('T' + i.toString(), 'Painting ' + i.toString());
        }

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var crosshair = new BABYLON.GUI.Image("crosshair", "./build/assets/crosshairWhite.png");
        crosshair.width = "40px";
        crosshair.height = "40px";
        advancedTexture.addControl(crosshair);

        camera.onCollide = function(colMesh) {
            if (colMesh.name != "Coll01") {
                console.log("Collision with:" + colMesh.name);
            }
        }

        function vecToLocal(vector, mesh) {
            var m = mesh.getWorldMatrix();
            var v = BABYLON.Vector3.TransformCoordinates(vector, m);
            return v;
        }

        let meshInCrosshair = '';

        function castRay() {
            var origin = camera.position;
            var forward = new BABYLON.Vector3(0, 0, 1);
            forward = vecToLocal(forward, camera);
            var direction = forward.subtract(origin);
            direction = BABYLON.Vector3.Normalize(direction);
            var length = 10;
            var ray = new BABYLON.Ray(origin, direction, length);
            let rayHelper = new BABYLON.RayHelper(ray);
            rayHelper.show(scene);
            var hit = scene.pickWithRay(ray);
            if (hit.pickedMesh) {
                //hit.pickedMesh.scaling.y += 0.01;
                //console.log(hit.pickedMesh.name);
                if (typeof(meshNames.get(hit.pickedMesh.name)) != 'undefined') {
                    if (meshNames.get(hit.pickedMesh.name) === 'Painting 29') {
                        //console.log(hit.pickedMesh.position);
                    }
                    meshInCrosshair = meshNames.get(hit.pickedMesh.name);
                }
            }
        }



        var postProcess = new BABYLON.RefractionPostProcess("Refraction", "/scenes/customs/refMap.jpg", new BABYLON.Color3(1.0, 1.0, 1.0), 0.5, 0.5, 1.0, scene.cameras[1]);

        scene.onKeyboardObservable.add((kbInfo) => {
            console.log(kbInfo.event.keyCode);
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                if (kbInfo.event.keyCode === 'UpArrow' || kbInfo.event.keyCode == 87) {
                    footsteps.setVolume(1);
                    console.log("KEY DOWN: ", kbInfo.event.key);
                    console.log('Player Position X:', camera.position.x.toFixed(2), 'Y:', camera.position.y.toFixed(2), 'Z:', camera.position.z.toFixed(2));
                } else if (kbInfo.event.keyCode == 32) {
                    console.log(meshInCrosshair);
                }
            } else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                if (kbInfo.event.keyCode === 'UpArrow' || kbInfo.event.keyCode == 87) {
                    footsteps.setVolume(0);
                    console.log("KEY UP: ", kbInfo.event.key);
                }
            }

        });
        scene.onBeforeRenderObservable.add(() => {
            castRay();
        });

    }

};
// ArrowUp
// ArrowDown
// ArrowLeft
// ArrowRight

// (90); // Z
// (87); // W
// (83); // S
// (65); // A
// (81); // Q
// (69); // E
// (68); // D