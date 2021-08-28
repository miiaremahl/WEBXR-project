import './style.css';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { AnimationMixer, AnimationClip, NumberKeyframeTrack } from 'three';
import { World } from '/src/World.js';
import { loadModels } from '/src/models.js';

let rotationSpeedBaseLine = [];
let rotationSpeedSmallDetail = [];
let rotationSpeedDetailLine = [];

let models = null;


let camera, scene, renderer;
let controller;
let rotationSpeed = [];

// animation stuff
let mixer = null;
let action = null;
const opacityTime = [0, 1];
const opacityValue = [0, 1];
const opacityKF = new NumberKeyframeTrack(
    'material.opacity',
    opacityTime,
    opacityValue
);
const tracks = [opacityKF];
const length = -1;
const clip = new AnimationClip('fadeIn', length, tracks);

class LOAD {
    async modelLoader(){
        // complete async tasks
        const {one,two,three} = await loadModels();
        scene.add(one,two,three);
    }
}

async function main() {

    // Get a reference to the container element
    const container = document.createElement('div');

    //// create a new world
    const world = new World(container);

    document.body.appendChild(container);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);
    document.body.appendChild(ARButton.createButton(renderer));

    const Load = new LOAD;
    await Load.modelLoader();


    function onSelect() {

        console.log("touched");  
        scene.add(models[0]);
        scene.add(models[1]);
        scene.add(models[2]);

	}

    controller = renderer.xr.getController(0);
	controller.addEventListener('select', onSelect);
	scene.add(controller);
	window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
	renderer.setAnimationLoop(render);
}

function render() {

	renderer.render(scene, camera);

}

//Time
const clock = new THREE.Clock()
var startFrame = true;
let previousTime = 0;
let timeToUpdate = 1;
const tick = () => {
    //get time
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;


    if (mixer) mixer.update(deltaTime);
    //animation();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    if (startFrame) {
        startFrame = false;
    }
}

// function animation() {

    

//     // DetailLine Random Animation
//     if (baseLine != null) {
//         for (let i = 0; i < 51; i++) {
//             baseLine.children[0].children[i].rotation.y += rotationSpeedBaseLine[i];   
//         }  
//     }
//     // DetailLine Random Animation
//     if (detailLine != null) {
//         for (let i = 0; i < 52; i++) {
//             detailLine.children[0].children[i].rotation.y += rotationSpeedDetailLine[i];
//         }
//     }
//     // DetailLine Random Animation
//     if (smallDetail != null) {
//         for (let i = 0; i < 38; i++) {
//             smallDetail.children[0].children[i].rotation.y += rotationSpeedSmallDetail[i];
//         }
//     }
// }


main();
tick();
animate();
