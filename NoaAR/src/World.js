import { loadModels } from '/src/models.js';


class World {
    constructor(container) {
        // Old


    }

    async init() {
        const { _baseLine, _detailLine, _smallDetail } = await loadModels();
        return {
            _baseLine,
            _detailLine,
            _smallDetail,
        };
    }
    
}

export { World };