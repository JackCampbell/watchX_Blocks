/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
'use strict';

/** Create a namespace for the application. */
var watchXBlocks = watchXBlocks || {};

/** Initialize function for watchXBlocks, to be called on page load. */
watchXBlocks.init = function () {
    watchXBlocks.initExampleList();
    watchXBlocks.initWatchFaceList();
    watchXBlocks.initGameList();
    watchXBlocks.initLanguage();

    // Inject Blockly into content_blocks and fetch additional blocks
    watchXBlocks.injectBlockly(document.getElementById('content_blocks'), watchXBlocks.TOOLBOX_XML, '../blockly/');
    watchXBlocks.importExtraBlocks();

    watchXBlocks.designJsInit();
    watchXBlocks.initialiseIdeButtons();

    watchXBlocks.bindDesignEventListeners();
    watchXBlocks.bindActionFunctions();
    watchXBlocks.bindBlocklyEventListeners();

    // Hackish way to check if not running locally
    if (document.location.hostname != 'localhost') {
        watchXBlocks.openNotConnectedModal();
        console.log('Offline app modal opened as non localhost host name found: ' + document.location.hostname)
    }
    watchXBlocks.setSketchFileName(null);
    watchXBlocks.renderDefault();
};

/** Binds functions to each of the buttons, nav links, and related. */
watchXBlocks.bindActionFunctions = function () {
    // Navigation buttons
    watchXBlocks.bindClickEx('button_load', watchXBlocks.openSketchFile);
    watchXBlocks.bindClickEx('button_save', watchXBlocks.saveSketchFile);
    watchXBlocks.bindClickEx('button_delete', watchXBlocks.discardAllBlocks);

    // Side menu buttons, they also close the side menu
    watchXBlocks.bindClickEx('menu_new', function () {
        watchXBlocks.newSketchFile();
        $('.button-collapse').sideNav('hide');
    });
    watchXBlocks.bindClickEx('menu_load', function () {
        watchXBlocks.openSketchFile();
        $('.button-collapse').sideNav('hide');
    });
    watchXBlocks.bindClickEx('menu_save', function () {
        watchXBlocks.saveSketchFile();
        $('.button-collapse').sideNav('hide');
    });
    watchXBlocks.bindClickEx('menu_delete', function () {
        watchXBlocks.discardAllBlocks();
        $('.button-collapse').sideNav('hide');
    });
    watchXBlocks.bindClickEx('menu_settings', watchXBlocks.openSettings );
    watchXBlocks.bindClickEx('menu_example', watchXBlocks.openExampleDialog );
    watchXBlocks.bindClickEx('menu_faces', watchXBlocks.openWatchFaceDialog );
    watchXBlocks.bindClickEx('menu_games', watchXBlocks.openGamesDialog );
    watchXBlocks.bindClickEx('menu_about', watchXBlocks.openAboutUs );
    watchXBlocks.bindClickEx('menu_doc', watchXBlocks.openDocumentDialog );
    // Floating buttons
    watchXBlocks.bindClickEx('button_upload', watchXBlocks.ideSendUpload );
    watchXBlocks.bindClickEx('button_verify', watchXBlocks.ideSendVerify );
    // -
    watchXBlocks.bindClickEx('button_load_xml', watchXBlocks.XmlTextareaToBlocks);
    watchXBlocks.bindClickEx('button_toggle_toolbox', watchXBlocks.toggleToolbox);


    watchXBlocks.bindSettingsPathInputs();
    watchXBlocks.settingsPathInputListeners( 'settings_compiler_location', watchXBlocks.setCompilerLocation, watchXBlocks.setCompilerLocationHtml );
    watchXBlocks.settingsPathInputListeners( 'settings_sketch_location', watchXBlocks.setSketchLocation, watchXBlocks.setSketchLocationHtml );

    watchXBlocks.bindClickEx("menu_lms", (event) => {
        $('.button-collapse').sideNav('hide');
        window.open("http://lms.watchx.io", "blank");
    });
};



watchXBlocks.setSketchLocation = function(value, callback) {
    watchXBlocks.sendAsync("set-settings", { name: "sketch", new_value:value });
}

watchXBlocks.setCompilerLocation = function(value, callback) {
    watchXBlocks.sendAsync("set-settings", { name: "compiler", new_value:value });
}

// Settings modal input field listeners only if they can be edited
watchXBlocks.settingsPathInputListeners = function (elId, setValFunc, setHtmlCallback) {
    var el = document.getElementById(elId);
    if (el.readOnly === false) {
        // Event listener that send the data when the user presses 'Enter'
        el.onkeypress = function (e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == '13') {
                // setValFunc(el.value, setHtmlCallback);
                setValFunc(el.value, function (jsonObj) {
                    setHtmlCallback(watchXBlocks.jsonToHtmlTextInput(jsonObj));
                });
                return false;
            }
        };
        // Event listener that send the data when moving out of the input field
        el.onblur = function () {
            setValFunc(el.value, function (jsonObj) {
                setHtmlCallback(watchXBlocks.jsonToHtmlTextInput(jsonObj));
            });
        };
    }
};

/** Sets the watchXBlocks server IDE setting to upload and sends the code. */
watchXBlocks.ideSendUpload = function () {
    watchXBlocks.shortMessage(watchXBlocks.getLocalStr('uploadingSketch'));
    watchXBlocks.resetIdeOutputContent();
    watchXBlocks.sendCode("upload");
};

/** Sets the watchXBlocks server IDE setting to verify and sends the code. */
watchXBlocks.ideSendVerify = function () {
    watchXBlocks.shortMessage(watchXBlocks.getLocalStr('verifyingSketch'));
    watchXBlocks.resetIdeOutputContent();
    watchXBlocks.sendCode("verify");
};

/** Initialises the IDE buttons with the default option from the server. */
watchXBlocks.initialiseIdeButtons = function () {
    document.getElementById('button_verify').title = watchXBlocks.getLocalStr('verifySketch');
    document.getElementById('button_upload').title = watchXBlocks.getLocalStr('uploadSketch');
};

/**
 * Loads an XML file from the server and replaces the current blocks into the
 * Blockly workspace.
 * @param {!string} xmlFile Server location of the XML file to load.
 */
watchXBlocks.loadServerXmlFile = function (xmlFile) {
    var loadXmlfileAccepted = function () {
        // loadXmlBlockFile loads the file asynchronously and needs a callback
        var loadXmlCb = function (sucess) {
            if (sucess) {
                watchXBlocks.renderContent();
            } else {
                watchXBlocks.alertMessage( watchXBlocks.getLocalStr('invalidXmlTitle'), watchXBlocks.getLocalStr('invalidXmlBody'), false );
            }
        };
        var connectionErrorCb = function () {
            watchXBlocks.openNotConnectedModal();
        };
        watchXBlocks.loadXmlBlockFile(xmlFile, loadXmlCb, connectionErrorCb);
    };
    if (watchXBlocks.isWorkspaceEmpty()) {
        loadXmlfileAccepted();
    } else {
        watchXBlocks.alertMessage( watchXBlocks.getLocalStr('loadNewBlocksTitle'), watchXBlocks.getLocalStr('loadNewBlocksBody'), true, loadXmlfileAccepted );
    }
};

watchXBlocks.defaultBaseName = "New Code";

watchXBlocks.newSketchFile = function () {
    watchXBlocks.discardAllBlocks();
    watchXBlocks.setSketchFileName(null);
};

/**
 * Loads an XML file from the users file system and adds the blocks into the
 * Blockly workspace.
 */
watchXBlocks.openSketchFile = function () {
    var title = watchXBlocks.getLocalStr('open');
    var result = watchXBlocks.sendSync("editor-open", { title });
    if(result.filename == null) {
        return;
    }
    var success = watchXBlocks.replaceBlocksfromXml( result.content );
    if (success) {
        watchXBlocks.renderContent();
        watchXBlocks.setSketchFileName( result.filename );
    } else {
        watchXBlocks.alertMessage( watchXBlocks.getLocalStr('invalidXmlTitle'), watchXBlocks.getLocalStr('invalidXmlBody'), false );
    }
};

watchXBlocks.loadSketchFile = function(filename) {
    var result = watchXBlocks.sendSync("editor-load", { filename });
    if(result.content == null) {
        return;
    }
    var success = watchXBlocks.replaceBlocksfromXml( result.content );
    if (success) {
        watchXBlocks.renderContent();
        watchXBlocks.setSketchFileName( result.filename );
    } else {
        watchXBlocks.alertMessage( watchXBlocks.getLocalStr('invalidXmlTitle'), watchXBlocks.getLocalStr('invalidXmlBody'), false );
    }
};

/**
 * Creates an Arduino Sketch file containing the Arduino code generated from
 * the Blockly workspace and prompts the users to save it into their local file
 * system.
 */
watchXBlocks.saveSketchFile = function () {
    var filename = watchXBlocks.getSketchFileName();
    var basename = watchXBlocks.defaultBaseName;
    var content = watchXBlocks.generateXml();
    var title = watchXBlocks.getLocalStr('save');
    var result = watchXBlocks.sendSync("editor-save", { filename, content, basename, title });
    if(result.filename == null) {
        return;
    }
    watchXBlocks.setSketchFileName( result.filename );
};
watchXBlocks.saveAsSketchFile = function () {
    var basename = watchXBlocks.defaultBaseName;
    var content = watchXBlocks.generateXml();
    var title = watchXBlocks.getLocalStr('save');
    var result = watchXBlocks.sendSync("editor-save", { filename:null, content, basename, title });
    if(result.filename == null) {
        return;
    }
    watchXBlocks.setSketchFileName( result.filename );
};
watchXBlocks.exportArduinoFile = function() {
    var content = watchXBlocks.generateArduino();
    var title = watchXBlocks.getLocalStr('exportArduinoSketch');
    var result = watchXBlocks.sendSync('editor-export', { content, title });
    if(result.filename == null) {
        return;
    }
    console.log("exported ...:");
};
/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 * @deprecated
 */
watchXBlocks.saveXmlFile = function () {
    watchXBlocks.saveTextFileAs( document.getElementById('sketch_name').value + '.xml', watchXBlocks.generateXml() );
};

/**
 * Creates an text file with the input content and files name, and prompts the
 * users to save it into their local file system.
 * @param {!string} fileName Name for the file to be saved.
 * @param {!string} content Text datd to be saved in to the file.
 * @deprecated
 */
watchXBlocks.saveTextFileAs = function (fileName, content) {
    var blob = new Blob( [content], { type: 'text/plain;charset=utf-8' } );
    saveAs(blob, fileName);
};

/**
 * Retrieves the Settings from watchXBlocksServer to populates the form data
 * and opens the Settings modal dialog.
 */
watchXBlocks.openSettings = function () {
    var setting = document.getElementById("settings_dialog");
    if(setting) {
        watchXBlocks.setFormDisabledEx(setting, true);
        watchXBlocks.setupVisibleEx(setting, "#settings_check", true);
    }
    // Language menu only set on page load within watchXBlocks.initLanguage()
    watchXBlocks.openSettingsModal();
    watchXBlocks.sendAsync("all-settings", null);
};

watchXBlocks.openAboutUs = function () {
    watchXBlocks.openAboutDialog();
};

/**
 * Sets the compiler location form data retrieve from an updated element.
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setCompilerLocationHtml = function (newEl) {
    if (newEl === null) {
        return watchXBlocks.openNotConnectedModal();
    }
    var compLocIp = document.getElementById('settings_compiler_location');
    if (compLocIp != null) {
        compLocIp.value = newEl.value || compLocIp.value || 'Please enter the location of the Arduino IDE executable';
        compLocIp.style.cssText = newEl.style.cssText;
    }
};

/**
 * Sets the sketch location form data retrieve from an updated element.
 * @param {element} newEl JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setSketchLocationHtml = function (newEl) {
    if (newEl === null) {
        return watchXBlocks.openNotConnectedModal();
    }
    var sketchLocIp = document.getElementById('settings_sketch_location');
    if (sketchLocIp != null) {
        sketchLocIp.value = newEl.value || sketchLocIp.value || 'Please enter a folder to store the Arduino Sketch';
        sketchLocIp.style.cssText = newEl.style.cssText;
    }
};

/**
 * Replaces the Arduino Boards form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} newEl JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setArduinoBoardsHtml = function (newEl) {
    if (newEl === null) {
        return watchXBlocks.openNotConnectedModal();
    }

    var boardDropdown = document.getElementById('board');
    if (boardDropdown !== null) {
        // Restarting the select elements built by materialize
        $('select').material_select('destroy');
        newEl.name = 'settings_board';
        newEl.id = 'board';
        newEl.onchange = watchXBlocks.setBoard;
        boardDropdown.parentNode.replaceChild(newEl, boardDropdown);
        // Refresh the materialize select menus
        $('select').material_select();
    }
};

/**
 * Sets the Arduino Board type with the selected user input from the drop down.
 */
watchXBlocks.setBoard = function () {
    var el = document.getElementById('board');
    var board_value = el.options[el.selectedIndex].value;
    // ...
    //watchXBlocks.changeBlocklyArduinoBoard( board_value.toLowerCase().replace(/ /g, '_') );
    watchXBlocks.changeBlocklyArduinoBoard( board_value.replace(/ /g, '_') );
    watchXBlocks.sendAsync("set-settings", { name:"board", new_value:board_value });
};

/**
 * Replaces the Serial Port form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} newEl JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setSerialPortsHtml = function (newEl) {
    if (newEl === null) {
        return watchXBlocks.openNotConnectedModal();
    }
    var serialDropdown = document.getElementById('serial_port');
    if (serialDropdown !== null) {
        // Restarting the select elements built by materialize
        $('select').material_select('destroy');
        newEl.name = 'settings_serial';
        newEl.id = 'serial_port';
        newEl.onchange = watchXBlocks.setSerial;
        serialDropdown.parentNode.replaceChild(newEl, serialDropdown);
        // Refresh the materialize select menus
        $('select').material_select();
    }
};

/** Sets the Serial Port with the selected user input from the drop down. */
watchXBlocks.setSerial = function () {
    var el = document.getElementById('serial_port');
    var serial_value = el.options[el.selectedIndex].value;
    watchXBlocks.sendAsync("set-settings", { name:"serial", new_value:serial_value });
};



/**
 * Send the Arduino Code to the watchXBlocksServer to process.
 * Shows a loader around the button, blocking it (unblocked upon received
 * message from server).
 */
watchXBlocks.sendCode = function (action) {
    watchXBlocks.largeIdeButtonSpinner(true);
    var sketch_code = watchXBlocks.generateArduino();
    watchXBlocks.sendAsync("code", { sketch_code, action });
};

watchXBlocks.sendCodeReturn = function(result) {
    watchXBlocks.largeIdeButtonSpinner(false);
    if (result == null) {
        return watchXBlocks.openNotConnectedModal();
    }
    var dataBack = watchXBlocks.jsonToIdeModal(result);
    watchXBlocks.arduinoIdeOutput(dataBack);
}

/** Populate the workspace blocks with the XML written in the XML text area. */
watchXBlocks.XmlTextareaToBlocks = function () {
    var success = watchXBlocks.replaceBlocksfromXml( document.getElementById('content_xml').value );
    if (success) {
        watchXBlocks.renderContent();
    } else {
        watchXBlocks.alertMessage( watchXBlocks.getLocalStr('invalidXmlTitle'), watchXBlocks.getLocalStr('invalidXmlBody'), false );
    }
};

/**
 * Private variable to save the previous version of the Arduino Code.
 * @type {!String}
 * @private
 */
watchXBlocks.PREV_ARDUINO_CODE_ =
'// watchX Arduino Code\n' +
'void update_env() {\n}\n\n' +
'void setup() {\n}\n\n' +
'void loop() {\n\tupdate_env();\n}';

watchXBlocks.renderDefault = function() {
    var present = prettyPrintOne(watchXBlocks.PREV_ARDUINO_CODE_, 'cpp', false);
    document.getElementById('content_arduino').innerHTML = present;
}
/**
 * Populate the Arduino Code and Blocks XML panels with content generated from
 * the blocks.
 */
watchXBlocks.renderContent = function () {
    // Render Arduino Code with latest change highlight and syntax highlighting
    var arduinoCode = watchXBlocks.generateArduino();
    if (arduinoCode !== watchXBlocks.PREV_ARDUINO_CODE_) {
        var diff = JsDiff.diffWords(watchXBlocks.PREV_ARDUINO_CODE_, arduinoCode);
        var resultStringArray = [];
        for (var i = 0; i < diff.length; i++) {
            if (!diff[i].removed) {
                var escapedCode = diff[i].value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                if (diff[i].added) {
                    resultStringArray.push('<span class="code_highlight_new">' + escapedCode + '</span>');
                } else {
                    resultStringArray.push(escapedCode);
                }
            }
        }
        document.getElementById('content_arduino').innerHTML = prettyPrintOne(resultStringArray.join(''), 'cpp', false);
        watchXBlocks.PREV_ARDUINO_CODE_ = arduinoCode;
    }
    // Generate plain XML into element
    document.getElementById('content_xml').value = watchXBlocks.generateXml();
};

/**
 * Private variable to indicate if the toolbox is meant to be shown.
 * @type {!boolean}
 * @private
 */
watchXBlocks.TOOLBAR_SHOWING_ = true;

/**
 * Toggles the blockly toolbox and the watchXBlocks toolbox button On and Off.
 * Uses namespace member variable TOOLBAR_SHOWING_ to toggle state.
 */
watchXBlocks.toggleToolbox = function () {
    if (watchXBlocks.TOOLBAR_SHOWING_) {
        watchXBlocks.blocklyCloseToolbox();
        watchXBlocks.displayToolbox(false);
    } else {
        watchXBlocks.displayToolbox(true);
    }
    watchXBlocks.TOOLBAR_SHOWING_ = !watchXBlocks.TOOLBAR_SHOWING_;
};

/** @return {boolean} Indicates if the toolbox is currently visible. */
watchXBlocks.isToolboxVisible = function () {
    return watchXBlocks.TOOLBAR_SHOWING_;
};

/**
 * Lazy loads the additional block JS files from the ./block directory.
 * Initialises any additional watchXBlocks extensions.
 * TODO: Loads the examples into the examples modal
 */
watchXBlocks.importExtraBlocks = function () {
    /**
     * Parses the JSON data to find the block and languages js files.
     * @param {jsonDataObj} jsonDataObj JSON in JavaScript object format, null
     *     indicates an error occurred.
     * @return {undefined} Might exit early if response is null.
     */
    var jsonDataCb = function (jsonDataObj) {
        if (jsonDataObj === null) return watchXBlocks.openNotConnectedModal();
        if (jsonDataObj.categories !== undefined) {
            var head = document.getElementsByTagName('head')[0];
            for (var catDir in jsonDataObj.categories) {
                var blocksJsLoad = document.createElement('script');
                blocksJsLoad.src = '../blocks/' + catDir + '/blocks.js';
                head.appendChild(blocksJsLoad);

                var blocksLangJsLoad = document.createElement('script');
                blocksLangJsLoad.src = '../blocks/' + catDir + '/msg/' + 'messages.js';
                //'lang/' + watchXBlocks.LANG + '.js';
                head.appendChild(blocksLangJsLoad);

                var blocksGeneratorJsLoad = document.createElement('script');
                blocksGeneratorJsLoad.src = '../blocks/' + catDir + '/generator_arduino.js';
                head.appendChild(blocksGeneratorJsLoad);

                // Check if the blocks add additional watchXBlocks functionality
                var extensions = jsonDataObj.categories[catDir].extensions;
                if (extensions) {
                    for (var i = 0; i < extensions.length; i++) {
                        var blockExtensionJsLoad = document.createElement('script');
                        blockExtensionJsLoad.src = '../blocks/' + catDir + '/extensions.js';
                        head.appendChild(blockExtensionJsLoad);
                        // Add function to scheduler as lazy loading has to complete first
                        setTimeout(function (category, extension) {
                            var extensionNamespaces = extension.split('.');
                            var extensionCall = window;
                            var invalidFunc = false;
                            for (var j = 0; j < extensionNamespaces.length; j++) {
                                extensionCall = extensionCall[extensionNamespaces[j]];
                                if (extensionCall === undefined) {
                                    invalidFunc = true;
                                    break;
                                }
                            }
                            if (typeof extensionCall != 'function') {
                                invalidFunc = true;
                            }
                            if (invalidFunc) {
                                throw 'Blocks ' + category.categoryName + ' extension "' +
                                extension + '" is not a valid function.';
                            } else {
                                extensionCall();
                            }
                        }, 800, jsonDataObj.categories[catDir], extensions[i]);
                    }
                }
            }
        }
    };
    // Reads the JSON data containing all block categories from ./blocks directory
    // TODO: Now reading a local file, to be replaced by server generated JSON
    // watchXBlocks.getJson('/watchx/blocks_data.json', jsonDataCb);
};

/** Opens a modal with a list of categories to add or remove to the toolbox */
watchXBlocks.openExtraCategoriesSelect = function () {
    /**
     * Parses the JSON data from the server into a list of additional categories.
     * @param {jsonDataObj} jsonDataObj JSON in JavaScript object format, null
     *     indicates an error occurred.
     * @return {undefined} Might exit early if response is null.
     */
    var jsonDataCb = function (jsonDataObj) {
        if (jsonDataObj === null) return watchXBlocks.openNotConnectedModal();
        var htmlContent = document.createElement('div');
        if (jsonDataObj.categories !== undefined) {
            for (var catDir in jsonDataObj.categories) {
                // Function required to maintain each loop variable scope separated
                (function (cat) {
                    var clickBind = function (tickValue) {
                        if (tickValue) {
                            var catDom = (new DOMParser()).parseFromString(cat.toolbox.join(''), 'text/xml').firstChild;
                            watchXBlocks.addToolboxCategory(cat.toolboxName, catDom);
                        } else {
                            watchXBlocks.removeToolboxCategory(cat.toolboxName);
                        }
                    };
                    htmlContent.appendChild(watchXBlocks.createExtraBlocksCatHtml(cat.categoryName, cat.description, clickBind));
                })(jsonDataObj.categories[catDir]);
            }
        }
        watchXBlocks.openAdditionalBlocksModal(htmlContent);
    };
    // Reads the JSON data containing all block categories from ./blocks directory
    // TODO: Now reading a local file, to be replaced by server generated JSON
    // watchXBlocks.getJson('/watchx/blocks_data.json', jsonDataCb);
};

/** Informs the user that the selected function is not yet implemented. */
watchXBlocks.functionNotImplemented = function () {
    watchXBlocks.shortMessage('Function not yet implemented');
};

/**
 * Interface to display messages with a possible action.
 * @param {!string} title HTML to include in title.
 * @param {!element} body HTML to include in body.
 * @param {boolean=} confirm Indicates if the user is shown a single option (ok) or an option to cancel, with an action applied to the "ok".
 * @param {string=|function=} callback If confirm option is selected this would be the function called when clicked 'OK'.
 */
watchXBlocks.alertMessage = function (title, body, confirm, callback) {
    watchXBlocks.materialAlert(title, body, confirm, callback);
};

/**
 * Interface to displays a short message, which disappears after a time out.
 * @param {!string} message Text to be temporarily displayed.
 */
watchXBlocks.shortMessage = function (message) {
    watchXBlocks.MaterialToast(message);
};



/**
 * Add click listeners to the Compiler and Sketch input fields to launch the
 * Electron file/folder browsers.
 */
watchXBlocks.bindSettingsPathInputs = function() {
    // Compiler path
    var compilerEl = document.getElementById('settings_compiler_location');
    compilerEl.readOnly = true;
    watchXBlocks.bindClickEx(compilerEl, function() {
        watchXBlocks.sendAsync("set-compiler", null);
    });
    // Sketch path
    var sketchEl = document.getElementById('settings_sketch_location');
    sketchEl.readOnly = true;
    watchXBlocks.bindClickEx(sketchEl, function() {
        watchXBlocks.sendAsync("set-sketch", null);
    });
};


watchXBlocks.initDebug = function() {
    watchXBlocks.sendSync = function() {};
    watchXBlocks.sendAsync = function() {};
    watchXBlocks.init();
};
