class OneShotCollisionSound {
    constructor(args) {
        //Simple crate
        this.y = (typeof args.y === 'undefined' ? 1 : args.y);
        this.w = (typeof args.w === 'undefined' ? .3 : args.w);
        this.h = (typeof args.h === 'undefined' ? .7 : args.h);
        this.delay = (typeof args.delay === 'undefined' ? 0 : args.delay);
        this.spatialSound = (typeof args.spatialSound === 'undefined' ? false : args.spatialSound);
        this.distanceModel = (typeof args.distanceModel === 'undefined' ? "exponential" : args.distanceModel);
        this.rolloffFactor = (typeof args.rolloffFactor === 'undefined' ? 1 : args.rolloffFactor);
        this.polyphony = (typeof args.polyphony === 'undefined' ? true : args.polyphony);
        this.singlePlay = (typeof args.singlePlay === 'undefined' ? false : args.singlePlay);
        this.playCount = 0;
        //console.log(this.spatialSound);
        this.visible = (typeof args.visible === 'undefined' ? true : args.visible);
        this.name = (typeof args.name === 'undefined' ? args.file : args.name);
        this.volume = (typeof args.volume === 'undefined' ? 0.5 : args.volume);
        this.timeBetweenPlays = (typeof args.timeBetweenPlays === 'undefined' ? 2000 : args.secondsBeforeNextPlay * 1000);
        this.enabled = true;
        this.position = new BABYLON.Vector3(args.x, this.y, args.z);
        this.box = BABYLON.Mesh.CreateBox(this.name, 3, scene);
        this.box.material = new BABYLON.StandardMaterial("Mat", scene);
        if (this.visible)
            this.box.material.wireframe = true;
        else
            this.box.material.alpha = 0;

        this.box.scaling = new BABYLON.Vector3(this.w, this.h, this.w);
        this.box.position = new BABYLON.Vector3(args.x, this.y, args.z);
        // Create and load the sound async

        if (this.spatialSound) {
            this.sound = new BABYLON.Sound(this.name, args.file, scene, function() {
                // Call with the sound is ready to be played (loaded & decoded)
                // TODO: add your logic
                console.log("Sound ready to be played!");
            }, {
                loop: false,
                autoplay: false,
                spatialSound: this.spatialSound,
                distanceModel: this.distanceModel,
                rolloffFactor: this.rolloffFactor,
                volume: this.volume
            });
        } else {
            this.sound = new BABYLON.Sound(this.name, args.file, scene, function() {
                // Call with the sound is ready to be played (loaded & decoded)
                // TODO: add your logic
                console.log("Sound ready to be played!");
            }, {
                loop: false,
                autoplay: false,
                volume: this.volume
            });
        }

        // Sound will now follow the mesh position
        this.sound.attachToMesh(this.box);
        this.canPlay = true;
    }

    play() {
        var that = this;
        if (this.canPlay === true && this.playCount == 0 && this.enabled == true) {
            if (this.polyphony == false) {
                if (this.sound.isPlaying == false) {
                    this.sound.play(this.delay);
                }
            } else {
                this.sound.play(this.delay);
            }
            if (this.singlePlay == true)
                this.playCount++;

            this.canPlay = false;
        }
    }
    
    stop(){
        this.sound.stop();
    }
};
