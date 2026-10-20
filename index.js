import { Canvas } from "./source/classes/Canvas.js";
import { Sprite } from "./source/classes/Sprite.js";

export {
    // ...
};


// * MARK:Type Definitions


/** @typedef {MapMaker.GlobalInterface} GlobalInterface */
/** @typedef {MapMaker.APIInstanceExtras} APIInstanceExtras */
/** @typedef {MapMaker.ExtensionSettings} ExtensionSettings */


// * MARK:variables


const context = () => SillyTavern.getContext();

const {
    extensionSettings: extension_settings,
    eventSource,
    eventTypes,
    POPUP_TYPE,
    callGenericPopup,
} = context();

const {
    // ...
} = SillyTavern.libs;


const extensionName = "Map-Maker";
const extensionFullName = 'SillyTavern-Map-Maker';
const metadataName = extensionName.toLowerCase().replaceAll('-', '_');
const htmlSuffix = extensionName.toLowerCase();
const extensionFolderPath = `scripts/extensions/third-party/${extensionFullName}`;

/** @type {ExtensionSettings} */
const extensionSettings = extension_settings[extensionName];

/** @type {ExtensionSettings} */
const defaultSettings = {
    enabled: true,
    debug: false
};


// * MARK:Methods


async function runMapMaker() {
    const $mapCanvas = await MapMaker.templates.get('mapCanvas', { clone: true });

    if (!MapMaker.mapCanvas) {
        const $canvas = $mapCanvas.find(`#${htmlSuffix}-canvas`);
        const canvas = /** @type {HTMLCanvasElement} */($canvas[0]);

        MapMaker.mapCanvas = new Canvas(canvas);
        $canvas.toggleClass('d-none', false);
    }

    MapMaker.log({Canvas: MapMaker.mapCanvas});

    callGenericPopup($mapCanvas, POPUP_TYPE.DISPLAY, null, {
        allowEscapeClose: false,
        large: true,
        wide: true,
        wider: true,
    });
}


// * MARK:Interface


/** @type {APIInstanceExtras} */
const InterfaceExtras = {
    mapCanvas: null,
    Sprite,
};

/** @type {GlobalInterface} */
globalThis.MapMaker = null;


// * MARK:Settings


const settingsCallbacks = {};

/** Append settings menu on ST and set listeners. */
async function loadSettingsMenu() {
    const settingsHtml = await MapMaker.templates.get('settings');

    $('#extensions_settings2').append(settingsHtml);

    $(`#${htmlSuffix}-enabled`).on('input', MapMaker.settings.global.onBoolean);
    $(`#${htmlSuffix}-debug`).on('input', MapMaker.settings.global.onBoolean);
    $(`#${htmlSuffix}-run`).on('click', runMapMaker);
    $(`#${htmlSuffix}-check-configuration`).on('click', MapMaker.settings.global.printSettings);

    MapMaker.log('Settings menu created');

    $(`#${htmlSuffix}-enabled`).prop('checked', extensionSettings.enabled).trigger('input');
    $(`#${htmlSuffix}-debug`).prop('checked', extensionSettings.debug).trigger('input');

    MapMaker.log('Settings values initialized', extensionSettings);
}


// * MARK:Initialize


eventSource.once(eventTypes.APP_INITIALIZED, async function() {
    if (!context().extensionSettings[extensionName]) {
        context().extensionSettings[extensionName] = structuredClone(defaultSettings);
    }

    for (const key of Object.keys(defaultSettings)) {
        if (extensionSettings[key] === undefined) {
            extensionSettings[key] = structuredClone(defaultSettings[key]);
        }
    }

    for (const key of Object.keys(extensionSettings)) {
        const exists = key in defaultSettings;

        if (!exists) delete extensionSettings[key];
    }

    globalThis.MapMaker = {
        ...InterfaceExtras,
        ...TomatoLib.API.create({
            extensionName,
            extensionFolderPath,
            extensionMetadataName: metadataName,
            extensionSettings,
            extensionSettingsDefaults: defaultSettings,
            extensionCallbacks: settingsCallbacks,
        }),
    };

    await loadSettingsMenu();
});
