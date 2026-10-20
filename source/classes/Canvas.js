/** @typedef {MapMaker.Sprite} Sprite */

/**
 * @param {number} time
 * @returns {number}
 */
function getDelta(time) {
    return Number(document.timeline.currentTime) - time;
}

export class Canvas {

    /** @type {HTMLCanvasElement} */ canvas;
    /** @type {CanvasRenderingContext2D} */ context;
    /** @type {number} */ fps;
    /** @type {number} */ frameDuration;
    /** @type {number} */ zero;
    /** @type {number} */ lastTimestamp;
    /** @type {boolean} */ continueAnimation;
    /** @type {number|null} */ animationID;
    /** @type {Sprite[]} */ renderingQueue;

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} [options]
     * @param {number} [options.fps]
     */
    constructor(canvas, {fps = 60} = {}) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.fps = fps;
        this.frameDuration = 1000 / fps;
        this.firstTimestamp = 0;
        this.lastTimestamp = 0;
        this.continueAnimation = false;
        this.animationID = null;
        this.renderingQueue = [];
    }

    /**
     * @param {number} [fps]
     */
    setFps(fps = 60) {
        this.fps = fps;
        this.frameDuration = 1000 / fps;
    }

    step() {
        this.firstTimestamp = Number(document.timeline.currentTime);
        this.lastTimestamp = this.firstTimestamp;
        this.continueAnimation = false;
        this.animationID = requestAnimationFrame(this.animate.bind(this));
    }

    start() {
        this.firstTimestamp = Number(document.timeline.currentTime);
        this.lastTimestamp = this.firstTimestamp;
        this.continueAnimation = true;
        this.animationID = requestAnimationFrame(this.animate.bind(this));
    }

    stop() {
        this.continueAnimation = false;
        cancelAnimationFrame(this.animationID);
        this.animationID = null;
    }

    /**
     * @param {number} timestamp
     */
    async animate(timestamp) {
        const timeElapsed = timestamp - this.firstTimestamp;
        const frame = Math.round(timeElapsed / this.frameDuration);

        this.lastTimestamp = timestamp;

        if (getDelta(timestamp) < this.frameDuration) {
            await TomatoLib.delay(this.frameDuration - getDelta(timestamp));
        }

        MapMaker.log({frame, time: timeElapsed, deltaTime: getDelta(timestamp)});

        if (this.continueAnimation) {
            this.animationID = requestAnimationFrame(this.animate.bind(this));
        }
    }
}