var demo = {
    scene: "Espilit",
    incremental: false,
    binary: true,
    doNotUseCDN: false,
    collisions: true,
    offline: false,
    onload: function() {
        scene.autoClear = true;
        scene.getMeshByName("Sol loin").useVertexColors = false;
        scene.gravity.scaleInPlace(0.5);
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.1;
        scene.fogColor = new BABYLON.Color3(0, 0, 0);

        var camera = scene.activeCamera;
        var cameraBox = BABYLON.Mesh.CreateBox("CameraBox", .1, scene);
        cameraBox.isVisible = false;
        cameraBox.position = new BABYLON.Vector3(0, 0, 0);
        cameraBox.parent = camera;

        //let ambientVolume = 0;
        //let ambientMusic = new BABYLON.Sound("ambientMusic", "./build/assets/Guitar1.wav", scene, null, { loop: true, autoplay: true, spatialSound: false, volume: ambientVolume });


        var gl = new BABYLON.GlowLayer("glow", scene, {
            mainTextureSamples: 4
        });
        gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
            if (mesh.name === "Bandes lum") {
                result.set(1, 1, 1, 1);
            } else {
                result.set(0, 0, 0, 0);
            }
        }

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        var VRHelper = scene.createDefaultVRExperience({ createDeviceOrientationCamera: false });
        VRHelper.enableTeleportation({ floorMeshName: "Sols" });


        scene.onKeyboardObservable.add((kbInfo) => {
            console.log(kbInfo.event.keyCode);
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                if (kbInfo.event.keyCode == 32) {
                    console.log(meshInCrosshair);
                } else {
                    console.log("KEY DOWN: ", kbInfo.event.key);
                    console.log('Player Position X:', camera.position.x.toFixed(2), 'Y:', camera.position.y.toFixed(2), 'Z:', camera.position.z.toFixed(2));
                }
            } else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                console.log("KEY UP: ", kbInfo.event.key);
            }
        });



        //sample trigger sounds....
        let triggerSounds = [];
        triggerSounds.push(new OneShotCollisionSound({ file: "./build/assets/collision1.wav", x: 2, z: 0.5 }));
        triggerSounds.push(new OneShotCollisionSound({ file: "./build/assets/collision1.wav", x: 4.8, z: -3 }));

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var crosshair = new BABYLON.GUI.Image("crosshair", "./build/assets/crosshairWhite.png");
        crosshair.width = "40px";
        crosshair.height = "40px";
        advancedTexture.addControl(crosshair);
        var textInfo = new BABYLON.GUI.TextBlock();
        textInfo.color = "white";
        textInfo.fontSize = 16;
        textInfo.height = "30px";
        textInfo.top = "100px";
        advancedTexture.addControl(textInfo);



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
            var hit = scene.pickWithRay(ray);
            if (hit.pickedMesh) {
                console.log(hit.pickedMesh.name);
                meshInCrosshair = hit.pickedMesh.name;
            }
        }

        scene.onBeforeRenderObservable.add(() => {
            textInfo.text = "Player's position X:" + (camera.position.x).toFixed(2) + " Y:" + (camera.position.y).toFixed(2) + " Z:" + (camera.position.z).toFixed(2) + "\nPicked Mesh: " + meshInCrosshair;
            castRay();
            if (cameraBox) {
                triggerSounds.forEach(oneShot => {
                    if (cameraBox.intersectsMesh(oneShot.box, false)) {
                        oneShot.play();
                    } else
                        oneShot.canPlay = true;
                });
            }
        });

    }
};