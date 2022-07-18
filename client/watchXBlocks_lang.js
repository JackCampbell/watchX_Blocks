/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Functions related to language and localisation.
 */
'use strict';

/** Create a namespace for the application. */
var watchXBlocks = watchXBlocks || {};

/** Lookup for names of supported languages. Keys in ISO 639 format. */
watchXBlocks.LANGUAGE_NAME = {
    // 'fr': 'Français',
    'en': 'English',
    'jp': 'Japan',
    // 'es': 'Español',
    // 'nl': 'Nederlands',
    // 'pt': 'Português',
    // 'it': 'Italiano',
    // 'ru': 'Русский'
};

/**
 * Selected language, default English.
 * @type {string}
 */
watchXBlocks.LANG = 'en';
/**
 * We keep a local copy of the default language in case translations cannot
 * be found in the injected language file.
 * @type {Object}
 */
watchXBlocks.DEFAULT_LANG_TEXT = {};



/** Initialize the page language. */
watchXBlocks.initLanguage = function () {
    // Save the current default language ID to check if it has been changed
    var defaultLang = watchXBlocks.LANG;
    // Check server settings and url language, url gets priority
    watchXBlocks.LANG = watchXBlocks.getUrlLanguage() || watchXBlocks.getLanguageSetting() || watchXBlocks.LANG;
    // watchXBlocks.populateLanguageMenu(watchXBlocks.LANG);
    // (defaultLang !== watchXBlocks.LANG)
    {
        watchXBlocks.duplicateDefaultLang();
        watchXBlocks.injectLanguageJsSources(watchXBlocks.LANG);
        watchXBlocks.updateLanguageText();
    }
};


/**
 * Get the language previously set by the user from the server settings.
 * @return {string} Language saved in the server settings.
 */
watchXBlocks.getLanguageSetting = function () {
    return watchXBlocks.sendSync("get-curr-lang", null);
};

/**
 * Get the language selected from the URL, format '?lang=en'.
 * @return {string} Selected language.
 */
watchXBlocks.getUrlLanguage = function () {
    var langKey = 'lang';
    var val = location.search.match(new RegExp('[?&]' + langKey + '=([^&]+)'));
    var language = val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : '';
    if (watchXBlocks.LANGUAGE_NAME[language] === undefined) {
        language = null;
    }
    return language;
};

/**
 * Populates the settings language selection menu.
 * @param {!string} selectedLang Language to be marked as selected.
 */
watchXBlocks.populateLanguageMenu = function (selectedLang) {
    var languageMenu = document.getElementById('language');
    if(languageMenu == null) {
        return;
    }
    languageMenu.options.length = 0;
    for (var lang in watchXBlocks.LANGUAGE_NAME) {
        var option = new Option(watchXBlocks.LANGUAGE_NAME[lang], lang);
        if (lang == selectedLang) {
            option.selected = true;
        }
        languageMenu.options.add(option);
    }
    languageMenu.onchange = watchXBlocks.changeLanguage;
};

/**
 * Because new languages are injected by overwriting watchXBlocks.LOCALISED_TEXT
 * we keep a local copy of the default language (included in the html header) so
 * that we can still retrieve these strings if the translation cannot be found.
 */
watchXBlocks.duplicateDefaultLang = function () {
    for (var textId in watchXBlocks.LOCALISED_TEXT) {
        watchXBlocks.DEFAULT_LANG_TEXT[textId] = watchXBlocks.LOCALISED_TEXT[textId];
    }
};

/** Updates the page text strings with the new language. */
watchXBlocks.updateLanguageText = function () {
    for (var textId in watchXBlocks.LOCALISED_TEXT) {
        var textStrings = document.getElementsByClassName('translatable_' + textId);
        for (var i = 0; i < textStrings.length; i++) {
            textStrings[i].innerHTML = watchXBlocks.getLocalStr(textId);
        }
    }
};

/**
 * Injects the language JavaScript files into the html head element.
 * @param {string} lang_key Dictionary key for the language to inject, must also
 *     be JS file name.
 */
watchXBlocks.injectLanguageJsSources = function (lang_key) {
    var { client, blockly } = watchXBlocks.sendSync("get-lang-data", { lang_key });
    var last = document.getElementById("client-lang");
    if(last) {
        var script = document.createElement('script');
        script.text = client;
        script.id = "client-lang";
        last.parentNode.replaceChild(script, last);
    }
    last = document.getElementById("blockly-lang");
    if(last) {
        var script = document.createElement('script');
        script.text = blockly;
        script.id = "blockly-lang";
        last.parentNode.replaceChild(script, last);
    }
};

watchXBlocks.injectLanguageJsSourcesOld = function (lang_key) {
    var head = document.getElementsByTagName('head')[0];
    var { client, blockly } = watchXBlocks.sendSync("get-lang-data", { lang_key });
    if(result != null) {
        // Retrieve and inject watchXBlocks translations synchronously
        var appLangJsLoad = document.createElement('script');
        appLangJsLoad.text = client;
        head.appendChild(appLangJsLoad);
    } else {
        // Display an alert to indicate we cannot load languages
        var title = watchXBlocks.getLocalStr('noServerTitle');
        var body = watchXBlocks.getLocalStr('noServerNoLangBody')
        watchXBlocks.alertMessage(title, body, false);
    }
    // Retrieve and inject Blockly translations asynchronously
    var blocklyLangJsLoad = document.createElement('script');
    blocklyLangJsLoad.src = '/blockly/msg/js/' + lang_key + '.js';
    head.appendChild(blocklyLangJsLoad);
};

/** Saves the blocks and reloads with a different language. */
watchXBlocks.changeLanguage = function () {
    // Store the blocks for the duration of the reload only
    watchXBlocks.saveSessionStorageBlocks();
    /*
    var languageMenu = document.getElementById('language');
    var newLang = encodeURIComponent( languageMenu.options[languageMenu.selectedIndex].value );
    var search = window.location.search;
    if (search.length <= 1) {
        search = '?lang=' + newLang;
    } else if (search.match(/[?&]lang=[^&]*\/)) {
        search = search.replace(/([?&]lang=)[^&]*\/, '$1' + newLang);
    } else {
        search = search.replace(/\?/, '?lang=' + newLang + '&');
    }
    window.location = window.location.protocol + '//' + window.location.host + window.location.pathname + search;
    */
};

/**
 * Finds and returns the requests string in the localised language.
 * If the translation is not returned, it fetches the original language string.
 * @param {string} stringId
 * @return {!string} The localised, original, or an empty string.
 */
watchXBlocks.getLocalStr = function (stringId) {
    var text = watchXBlocks.LOCALISED_TEXT[stringId];
    if (!text) {
        console.log('Localised text string ID "' + stringId + '" does not exists!');
    }
    return text || watchXBlocks.DEFAULT_LANG_TEXT[stringId] || '';
};
