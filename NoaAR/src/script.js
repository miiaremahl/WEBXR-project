import './style.css';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';

let camera, scene, renderer;
let controller;
let rotationSpeed = [];
let rootBaseLine = null;
let rootDetailLine = null;
let rootSmallDetail = null;
let texturePathBaseLine = "/Textures/BaseLine.png";
let texturePathDetailLine = "/Textures/DetailLine.png";
let texturePathSmallDetail = "/Textures/SmallDetail.png";

const texturelLoader = new THREE.TextureLoader();

let mixerBase, actionBase,
    mixerDetail, actionDetail,
    mixerSmall, actionSmall;

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
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);

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


    let masterScale = 0.05;
    let masterPos = [0, 0, -20];

   
    ////// loading materials on the mesh
    // 51 BaseLine
	gltfLoader.load(
		'/ReadyMeshes/baseLine.glb',
		(gltf) => {
            console.log(gltf.scene);
            const model = gltf;
            rootBaseLine = gltf.scene.children[0].children[0];
            console.log(model);
            const clip = gltf.animations[0];
            mixerBase = new AnimationMixer(gltf.scene); 
            actionBase = mixerBase.clipAction(clip);
            actionBase.setLoop(THREE.LoopPingPong);
            actionBase.timeScale = 0.01;
            actionBase.play();
            gltf.scene.children[0].scale.set(masterScale, masterScale, masterScale);
            meshBaseLine = gltf.scene.children[0];
            for (let i = 0; i < 51; i++) {
                rotationSpeed.push(randomRotationIncrement());
                rootBaseLine.children[i].children[0].material = BaseLineMaterial;
            }
            meshBaseLine.position.set(masterPos[0],masterPos[1],masterPos[2]).applyMatrix4(controller.matrixWorld);
            meshBaseLine.quaternion.setFromRotationMatrix(controller.matrixWorld);
            scene.add(meshBaseLine);
		}
    );

    // 52 DetailLine
    gltfLoader.load(
        '/ReadyMeshes/detailLine.glb',
        (gltf) => {
            console.log(gltf.scene);
            rootDetailLine = gltf.scene.children[0].children[0];
            const clip = gltf.animations[0];
            mixerDetail = new AnimationMixer(gltf.scene);
            actionDetail = mixerDetail.clipAction(clip);
            actionDetail.setLoop(THREE.LoopPingPong);
            actionDetail.timeScale = 0.01;
            actionDetail.play();
            gltf.scene.children[0].scale.set(masterScale, masterScale, masterScale);
            meshDetailLine = gltf.scene.children[0];
            for (let i = 0; i < 52; i++) {
                rotationSpeed.push(randomRotationIncrement());
                rootDetailLine.children[i].children[0].material = DetailLineMaterial;
            }
            meshDetailLine.position.set(masterPos[0], masterPos[1], masterPos[2]).applyMatrix4(controller.matrixWorld);
            meshDetailLine.quaternion.setFromRotationMatrix(controller.matrixWorld);
            scene.add(meshDetailLine);

        }
    );

    // 38 SmallDetail
    gltfLoader.load(
        '/ReadyMeshes/smallDetail.glb',
        (gltf) => {
            console.log(gltf.scene);
            rootSmallDetail = gltf.scene.children[0].children[0];
            const clip = gltf.animations[0];
            mixerSmall = new AnimationMixer(gltf.scene);
            actionSmall = mixerSmall.clipAction(clip);
            actionSmall.setLoop(THREE.LoopPingPong);
            actionSmall.timeScale = 0.01;   
            actionSmall.play();   
            gltf.scene.children[0].scale.set(masterScale, masterScale, masterScale);
            meshSmallDetail = gltf.scene.children[0];
            for (let i = 0; i < 38; i++) {
                rotationSpeed.push(randomRotationIncrement());
                rootSmallDetail.children[i].children[0].material = SmallDetailMaterial;
            }
            meshSmallDetail.position.set(masterPos[0], masterPos[1], masterPos[2]).applyMatrix4(controller.matrixWorld);
            meshSmallDetail.quaternion.setFromRotationMatrix(controller.matrixWorld);
            scene.add(meshSmallDetail);
        }
    );



    function onSelect() {
        //place the objects
        meshSmallDetail.position.set(masterPos[0], masterPos[1], masterPos[2]).applyMatrix4(controller.matrixWorld);
        meshSmallDetail.quaternion.setFromRotationMatrix(controller.matrixWorld);
        scene.add(meshSmallDetail);
        meshDetailLine.position.set(masterPos[0], masterPos[1], masterPos[2]).applyMatrix4(controller.matrixWorld);
        meshDetailLine.quaternion.setFromRotationMatrix(controller.matrixWorld);
        scene.add(meshDetailLine);
        meshBaseLine.position.set(masterPos[0], masterPos[1], masterPos[2]).applyMatrix4(controller.matrixWorld);
        meshBaseLine.quaternion.setFromRotationMatrix(controller.matrixWorld);
        scene.add(meshBaseLine);
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
    let direction = (Math.random(0, 1) > 0.5) ? 1 : -1;
    return Math.random(0, 2) * 0.01 * direction;
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

	//animation();
    if (mixerBase != null) mixerBase.update(deltaTime);
    if (mixerSmall != null) mixerSmall.update(deltaTime);
    if (mixerDetail != null) mixerDetail.update(deltaTime);




	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
	if (startFrame) {
		startFrame = false;
	}
}


init();
animate();
tick();
