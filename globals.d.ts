declare global {
    namespace MapMaker {
        type Canvas = import('./source/classes/Canvas.js').Canvas;
        type Sprite = import('./source/classes/Sprite.js').Sprite;

        type CanvasClass = typeof import('./source/classes/Canvas.js').Canvas;
        type SpriteClass = typeof import('./source/classes/Sprite.js').Sprite;

        type ExtensionSettings = {
            enabled: boolean;
            debug: boolean;
        };

        type APIInstanceExtras = {
            Sprite: SpriteClass;
            /** The canvas in charge of rendering the map. */
            mapCanvas: Canvas;
        };

        type GlobalInterface = TomatoLib.APIInstance & APIInstanceExtras;
    }
}

export {}