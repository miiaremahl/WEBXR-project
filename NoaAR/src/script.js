import './style.css';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//let limbs = 19;
let camera, scene, renderer;
let controller;
let rotationSpeed = [];


init();
animate();
let rootBaseLine = null;
let rootDetailLine = null;
let rootSmallDetail = null;
let texturePathBaseLine = "/Textures/BaseLine.png";
let texturePathDetailLine = "/Textures/DetailLine.png";
let texturePathSmallDetail = "/Textures/SmallDetail.png";

const texturelLoader = new THREE.TextureLoader();

const BaseLineMaterial = new THREE.MeshStandardMaterial({
    map: texturelLoader.load(texturePathBaseLine),
    premultipliedAlpha: true,
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
});
const DetailLineMaterial = new THREE.MeshStandardMaterial({
    map: texturelLoader.load(texturePathDetailLine),
    premultipliedAlpha: true,
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
});
const SmallDetailMaterial = new THREE.MeshStandardMaterial({
    map: texturelLoader.load(texturePathSmallDetail),
    premultipliedAlpha: true,
    transparent: true,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
});

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

	const gltfLoader = new GLTFLoader();
    let meshBaseLine = null;
    let meshDetailLine = null;
    let meshSmallDetail = null;
   
    ////// loading materials on the mesh
    // 51 BaseLine
	gltfLoader.load(
		'BaseLine.glb',
		(gltf) => {
			console.log(gltf.scene);
            rootBaseLine = gltf.scene.children[0].children[0];
			gltf.scene.children[0].scale.set(0.05, 0.05, 0.05);
            meshBaseLine = gltf.scene.children[0];
            for (let i = 0; i < 51; i++) {
                rotationSpeed.push(randomRotationIncrement());
                root.children[i].children[0].material = BaseLineMaterial;
            }
		}
    );

    // 52 DetailLine
    gltfLoader.load(
        'DetailLine.glb',
        (gltf) => {
            console.log(gltf.scene);
            rootDetailLine = gltf.scene.children[0].children[0];
            gltf.scene.children[0].scale.set(0.05, 0.05, 0.05);
            meshDetailLine = gltf.scene.children[0];
            for (let i = 0; i < 52; i++) {
                rotationSpeed.push(randomRotationIncrement());
                root.children[i].children[0].material = DetailLineMaterial;
            }
        }
    );

    // 38 SmallDetail
    gltfLoader.load(
        'SmallDetail.glb',
        (gltf) => {
            console.log(gltf.scene);
            rootSmallDetail = gltf.scene.children[0].children[0];
            gltf.scene.children[0].scale.set(0.05, 0.05, 0.05);
            meshSmallDetail = gltf.scene.children[0];
            for (let i = 0; i < 38; i++) {
                rotationSpeed.push(randomRotationIncrement());
                root.children[i].children[0].material = SmallDetailMaterial;
            }
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
    // DetailLine Random Animation
    if (rootBaseLine != null) {
        for (let i = 0; i < 51; i++) {
            rootBaseLine.children[i].rotation.y += rotationSpeed[i];
        }
    }
    // DetailLine Random Animation
    if (rootDetailLine != null) {
        for (let i = 0; i < 52; i++) {
            rootDetailLine.children[i].rotation.y += rotationSpeed[i];
        }
    }
    // DetailLine Random Animation
    if (rootSmallDetail != null) {
        for (let i = 0; i < 38; i++) {
            rootSmallDetail.children[i].rotation.y += rotationSpeed[i];
        }
    }
}


function randomRotationIncrement() {
    return Math.random(0, 9) * 0.01;
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

