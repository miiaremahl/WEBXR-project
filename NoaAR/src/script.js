import './style.css';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let camera, scene, renderer;
let controller;

init();
animate();
let root = null;
function init() {

	const container = document.createElement('div');
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

	//
	const gltfLoader = new GLTFLoader();
	let mesh = null;

	gltfLoader.load(
		'CharacterArCloud.glb',
		(gltf) => {
			console.log(gltf.scene);
			root = gltf.scene.children[0].children[0].children[0].children[0].children[0];
			gltf.scene.children[0].scale.set(0.01, 0.01, 0.01);
			mesh = gltf.scene.children[0];
		}
	);


	function onSelect() {
		mesh.position.set(0, 0, -10).applyMatrix4(controller.matrixWorld);
		mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
		scene.add(mesh);

	}

	controller = renderer.xr.getController(0);
	controller.addEventListener('select', onSelect);
	scene.add(controller);

	//

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

function animation() {
	if (root !=null) {
		root.rotation.y += 0.001;
		console.log(root.rotation.y);
    }
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

	animation();

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
	if (startFrame) {
		startFrame = false;
	}
}

tick();

