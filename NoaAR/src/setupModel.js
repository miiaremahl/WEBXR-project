import { AnimationMixer } from 'three';
import * as THREE from 'three';

function setupModel(data) {
    const model = data;
    console.log (model);
    const clip = data.animations[0];
    const mixer = new AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce);
    action.timeScale = 0.01;
    action.play();
    model.tick = (delta) => mixer.update(delta);
    return model;
}

export { setupModel };






