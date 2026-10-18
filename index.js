export {
    // ...
};


// * MARK:Type Definitions


/** @typedef {ExtensionTemplate.GlobalInterface} GlobalInterface */
/** @typedef {ExtensionTemplate.APIInstanceExtras} APIInstanceExtras */

/**
 * @typedef {Object} ExtensionSettings
 * @property {boolean} enabled
 * @property {boolean} debug
 */


// * MARK:variables


const context = () => SillyTavern.getContext();

const {
    extensionSettings: extension_settings,
    eventSource,
    eventTypes
} = context();

const {
    // ...
} = SillyTavern.libs;


const extensionName = "Extension-Template";
const extensionFullName = 'SillyTavern-Extension-Template';
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


// ...


// * MARK:Interface


/** @type {APIInstanceExtras} */
const InterfaceExtras = {
    myCustomMethod() {
        ExtensionTemplate.log('Hi');
    }
}

/** @type {GlobalInterface} */
globalThis.ExtensionTemplate = null;


// * MARK:Settings


const settingsCallbacks = {
    /**	Triggers on enabled setting change. */
    enabled: () => {
        // ...
    }
}

/** Append settings menu on ST and set listeners. */
async function loadSettingsMenu() {
    const settingsHtml = await ExtensionTemplate.templates.get('settings');

    // The ID extensions_settings2 is an alternative
    $('#extensions_settings').append(settingsHtml);

    $(`#${htmlSuffix}-enabled`).on('input', ExtensionTemplate.settings.global.onBoolean);
    $(`#${htmlSuffix}-debug`).on('input', ExtensionTemplate.settings.global.onBoolean);
    $(`#${htmlSuffix}-check-configuration`).on('click', ExtensionTemplate.settings.global.printSettings);

    ExtensionTemplate.log('Settings menu created');

    $(`#${htmlSuffix}-enabled`).prop('checked', extensionSettings.enabled).trigger('input');
    $(`#${htmlSuffix}-debug`).prop('checked', extensionSettings.debug).trigger('input');

    ExtensionTemplate.log('Settings values initialized', extensionSettings);
}


// * MARK:Initialize


eventSource.once(eventTypes.APP_INITIALIZED, async function() {
    if (!context().extensionSettings[extensionName]) {
        context().extensionSettings[extensionName] = structuredClone(defaultSettings);
    }

    for (const key of Object.keys(defaultSettings)) {
        if (context().extensionSettings[extensionName][key] === undefined) {
            context().extensionSettings[extensionName][key] = defaultSettings[key];
        }
    }

    globalThis.ExtensionTemplate = {
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
