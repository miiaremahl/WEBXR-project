import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setupModel } from '/src/setupModel.js';
import * as THREE from 'three';

let texturePathBaseLine = "/Textures/BaseLine.png";
let texturePathDetailLine = "/Textures/DetailLine.png";
let texturePathSmallDetail = "/Textures/SmallDetail.png";
const texturelLoader = new THREE.TextureLoader();

const modelSize = 0.05;

async function loadModels() {
    const gltfLoader = new GLTFLoader();

    //const [dataBaseLine, dataDetailLine, dataSmallDetail] = await Promise.all([
    //    gltfLoader.loadAsync('ReadyMeshes/baseLine.glb'),
    //    gltfLoader.loadAsync('ReadyMeshes/detailLine.glb'),
    //    gltfLoader.loadAsync('ReadyMeshes/smallDetail.glb'),

    //]);

    const dataBaseLine = await gltfLoader.loadAsync('ReadyMeshes/baseLine.glb');
    const dataDetailLine = await gltfLoader.loadAsync('ReadyMeshes/detailLine.glb');
    const dataSmallDetail = await gltfLoader.loadAsync('ReadyMeshes/smallDetail.glb');

    console.log('BaseLine', dataBaseLine);
    console.log('DetailLine', dataDetailLine);
    console.log('SmallDetail', dataSmallDetail);

    const meshBaseLine = setupModel(dataBaseLine);
    const meshDetailLine = setupModel(dataDetailLine);
    const meshSmallDetail = setupModel(dataSmallDetail);

    for (let i = 0; i < 51; i++) {
        //rotationSpeedBaseLine.push(randomRotationIncrement());
        meshBaseLine.children[0].children[i].children[0].material = BaseLineMaterial;
        console.log("attached material 1");
    }
    for (let i = 0; i < 52; i++) {
        //rotationSpeedDetailLine.push(randomRotationIncrement());
        meshDetailLine.children[0].children[i].children[0].material = DetailLineMaterial;
        console.log("attached material 2");
    }
    for (let i = 0; i < 38; i++) {
        //rotationSpeedSmallDetail.push(randomRotationIncrement());
        meshSmallDetail.children[0].children[i].children[0].material = SmallDetailMaterial;
        console.log("attached material 3");
    }
    
    meshBaseLine.scale.set(modelSize, modelSize, modelSize);
    meshBaseLine.scale.set(modelSize, modelSize, modelSize);
    meshBaseLine.scale.set(modelSize, modelSize, modelSize);


    return {
        meshBaseLine,
        meshDetailLine,
        meshSmallDetail,
    };
}

export { loadModels };

// MATERIALS
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

function randomRotationIncrement() {
    let direction = (Math.random(0, 1) > 0.5) ? 1 : -1;
    return Math.random(0, 1) * 0.005 * direction;
}
