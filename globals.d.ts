declare global {
    namespace MapMaker {
        type ExtensionSettings = {
            enabled: boolean;
            debug: boolean;
        };

        type APIInstanceExtras = {
            myCustomMethod: () => void;
        };

        type GlobalInterface = TomatoLib.APIInstance & APIInstanceExtras;
    }
}

export {}