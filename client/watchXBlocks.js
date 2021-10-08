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
};

/** Binds functions to each of the buttons, nav links, and related. */
watchXBlocks.bindActionFunctions = function () {
    // Navigation buttons
    watchXBlocks.bindClick_('button_load', watchXBlocks.openSketchFile);
    watchXBlocks.bindClick_('button_save', watchXBlocks.saveSketchFile);
    watchXBlocks.bindClick_('button_delete', watchXBlocks.discardAllBlocks);

    // Side menu buttons, they also close the side menu
    watchXBlocks.bindClick_('menu_new', function () {
        watchXBlocks.newSketchFile();
        $('.button-collapse').sideNav('hide');
    });
    watchXBlocks.bindClick_('menu_load', function () {
        watchXBlocks.openSketchFile();
        $('.button-collapse').sideNav('hide');
    });
    watchXBlocks.bindClick_('menu_save', function () {
        watchXBlocks.saveSketchFile();
        $('.button-collapse').sideNav('hide');
    });
    watchXBlocks.bindClick_('menu_delete', function () {
        watchXBlocks.discardAllBlocks();
        $('.button-collapse').sideNav('hide');
    });
    watchXBlocks.bindClick_('menu_settings', watchXBlocks.openSettings );
    watchXBlocks.bindClick_('menu_example', watchXBlocks.openExampleDialog );
    watchXBlocks.bindClick_('menu_faces', watchXBlocks.openWatchFaceDialog );
    watchXBlocks.bindClick_('menu_games', watchXBlocks.openGamesDialog );
    watchXBlocks.bindClick_('menu_about', watchXBlocks.openAboutUs );
    watchXBlocks.bindClick_('menu_doc', watchXBlocks.openDocumentDialog );
    // Floating buttons
    watchXBlocks.bindClick_('button_upload', watchXBlocks.ideSendUpload );
    watchXBlocks.bindClick_('button_verify', watchXBlocks.ideSendVerify );
    // -
    watchXBlocks.bindClick_('button_load_xml', watchXBlocks.XmlTextareaToBlocks);
    watchXBlocks.bindClick_('button_toggle_toolbox', watchXBlocks.toogleToolbox);

    // Settings modal input field listeners only if they can be edited
    var settingsPathInputListeners = function (elId, setValFunc, setHtmlCallback) {
        var el = document.getElementById(elId);
        if (el.readOnly === false) {
            // Event listener that send the data when the user presses 'Enter'
            el.onkeypress = function (e) {
                if (!e) e = window.event;
                var keyCode = e.keyCode || e.which;
                if (keyCode == '13') {
                    setValFunc(el.value, function (jsonObj) {
                        setHtmlCallback(watchXBlocksServer.jsonToHtmlTextInput(jsonObj));
                    });
                    return false;
                }
            };
            // Event listener that send the data when moving out of the input field
            el.onblur = function () {
                setValFunc(el.value, function (jsonObj) {
                    setHtmlCallback(watchXBlocksServer.jsonToHtmlTextInput(jsonObj));
                });
            };
        }
    };
    settingsPathInputListeners( 'settings_compiler_location', watchXBlocksServer.setCompilerLocation, watchXBlocks.setCompilerLocationHtml );
    settingsPathInputListeners( 'settings_sketch_location', watchXBlocksServer.setSketchLocationHtml, watchXBlocks.setSketchLocationHtml );
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
    watchXBlocksServer.sendRequest("/editor/open", "POST", "application/json", { title }, (json) => {
        if(json.filename == null) {
            return;
        }
        var success = watchXBlocks.replaceBlocksfromXml( json.content );
        if (success) {
            watchXBlocks.renderContent();
            watchXBlocks.setSketchFileName( json.filename );
        } else {
            watchXBlocks.alertMessage( watchXBlocks.getLocalStr('invalidXmlTitle'), watchXBlocks.getLocalStr('invalidXmlBody'), false );
        }
    });
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
    watchXBlocksServer.sendRequest("/editor/save", "POST", "application/json", { filename, content, basename, title }, (json) => {
        if(json.filename == null) {
            return;
        }
        watchXBlocks.setSketchFileName( json.filename );
    });
};
watchXBlocks.saveAsSketchFile = function () {
    var content = watchXBlocks.generateXml();
    var filename = null;
    var basename = watchXBlocks.defaultBaseName;
    var title = watchXBlocks.getLocalStr('saveAs');
    watchXBlocksServer.sendRequest("/editor/save", "POST", "application/json", { filename, content, basename, title }, (json) => {
        if(json.filename == null) {
            return;
        }
        watchXBlocks.setSketchFileName( json.filename );
    });
};
watchXBlocks.exportArduinoFile = function() {
    var content = watchXBlocks.generateArduino();
    var title = watchXBlocks.getLocalStr('exportArduinoSketch');
    watchXBlocksServer.sendRequest("/editor/export", "POST", "application/json", { content, title }, (json) => {
        if(json.filename == null) {
            return;
        }
        console.log("exported ...");
    });
};
/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
watchXBlocks.saveXmlFile = function () {
    watchXBlocks.saveTextFileAs( document.getElementById('sketch_name').value + '.xml', watchXBlocks.generateXml() );
};

/**
 * Creates an text file with the input content and files name, and prompts the
 * users to save it into their local file system.
 * @param {!string} fileName Name for the file to be saved.
 * @param {!string} content Text datd to be saved in to the file.
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
    watchXBlocksServer.requestCompilerLocation(function (jsonObj) {
        watchXBlocks.setCompilerLocationHtml( watchXBlocksServer.jsonToHtmlTextInput(jsonObj) );
    });
    watchXBlocksServer.requestSketchLocation(function (jsonObj) {
        watchXBlocks.setSketchLocationHtml( watchXBlocksServer.jsonToHtmlTextInput(jsonObj) );
    });
    watchXBlocksServer.requestArduinoBoards(function (jsonObj) {
        watchXBlocks.setArduinoBoardsHtml( watchXBlocksServer.jsonToHtmlDropdown(jsonObj) );
    });
    watchXBlocksServer.requestSerialPorts(function (jsonObj) {
        watchXBlocks.setSerialPortsHtml( watchXBlocksServer.jsonToHtmlDropdown(jsonObj) );
    });
    // Language menu only set on page load within watchXBlocks.initLanguage()
    watchXBlocks.openSettingsModal();
};

var once_version = false;
watchXBlocks.openAboutUs = function () {
    if(once_version == true) {
        watchXBlocks.openAboutDialog();
        return;
    }
    watchXBlocksServer.sendRequest("/version", "GET", "application/json", null, json => {
        var element = document.getElementById("watchx_version");
        if(element && json.version) {
            element.innerHTML = json.version;
        }
        watchXBlocks.openAboutDialog();
        once_version = true;
    });
};

/**
 * Sets the compiler location form data retrieve from an updated element.
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setCompilerLocationHtml = function (newEl) {
    if (newEl === null) return watchXBlocks.openNotConnectedModal();

    var compLocIp = document.getElementById('settings_compiler_location');
    if (compLocIp != null) {
        compLocIp.value = newEl.value || compLocIp.value || 'Please enter the location of the Arduino IDE executable';
        compLocIp.style.cssText = newEl.style.cssText;
    }
};

/**
 * Sets the sketch location form data retrieve from an updated element.
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setSketchLocationHtml = function (newEl) {
    if (newEl === null) return watchXBlocks.openNotConnectedModal();

    var sketchLocIp = document.getElementById('settings_sketch_location');
    if (sketchLocIp != null) {
        sketchLocIp.value = newEl.value || sketchLocIp.value || 'Please enter a folder to store the Arduino Sketch';
        sketchLocIp.style.cssText = newEl.style.cssText;
    }
};

/**
 * Replaces the Arduino Boards form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} jsonObj JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setArduinoBoardsHtml = function (newEl) {
    if (newEl === null) return watchXBlocks.openNotConnectedModal();

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
    var boardValue = el.options[el.selectedIndex].value;
    watchXBlocksServer.setArduinoBoard(boardValue, function (jsonObj) {
        var newEl = watchXBlocksServer.jsonToHtmlDropdown(jsonObj);
        watchXBlocks.setArduinoBoardsHtml(newEl);
    });
    watchXBlocks.changeBlocklyArduinoBoard( boardValue.toLowerCase().replace(/ /g, '_') );
};

/**
 * Replaces the Serial Port form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} jsonResponse JSON data coming back from the server.
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
    var serialValue = el.options[el.selectedIndex].value;
    watchXBlocksServer.setSerialPort(serialValue, function (jsonObj) {
        var newEl = watchXBlocksServer.jsonToHtmlDropdown(jsonObj);
        watchXBlocks.setSerialPortsHtml(newEl);
    });
};

/**
 * Send the Arduino Code to the watchXBlocksServer to process.
 * Shows a loader around the button, blocking it (unblocked upon received
 * message from server).
 */
watchXBlocks.sendCode = function (action) {
    watchXBlocks.largeIdeButtonSpinner(true);
    /**
     * Receives the IDE data back to be displayed and stops spinner.
     * @param {element} jsonResponse JSON data coming back from the server.
     * @return {undefined} Might exit early if response is null.
     */
    var sendCodeReturn = function (jsonObj) {
        watchXBlocks.largeIdeButtonSpinner(false);
        if (jsonObj === null) {
            return watchXBlocks.openNotConnectedModal();
        }
        var dataBack = watchXBlocksServer.jsonToIdeModal(jsonObj);
        watchXBlocks.arduinoIdeOutput(dataBack);
    };
    watchXBlocksServer.sendSketchToServer( watchXBlocks.generateArduino(), action, sendCodeReturn );
};

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
watchXBlocks.toogleToolbox = function () {
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
    watchXBlocksServer.getJson('/watchx/blocks_data.json', jsonDataCb);
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
    watchXBlocksServer.getJson('/watchx/blocks_data.json', jsonDataCb);
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

watchXBlocks.openLearningCenter = function() {
    window.open("http://lms.watchx.io", "blank");
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!function} func Event handler to bind.
 * @private
 */
watchXBlocks.bindClick_ = function (el, func) {
    if (typeof el == 'string') {
        el = document.getElementById(el);
    }
    // Need to ensure both, touch and click, events don't fire for the same thing
    var propagateOnce = function (e) {
        e.stopPropagation();
        e.preventDefault();
        func(e);
    };
    el.addEventListener('ontouchend', propagateOnce);
    el.addEventListener('click', propagateOnce);
};

watchXBlocks.connectDevice = function(state) {
    var e = document.getElementById("usb-connected");
    if(!e) {
        return;
    }
    if(state) {
        e.style.color = '#7de224';
    } else {
        e.style.color = '#ff4646';
    }
};



watchXBlocks.exampleList = [
    { title: 'example_blink',                   cover: 'img/Blink.svg',  path: 'blink.wxb' },
    { title: 'example_hello_world',             cover: 'img/HelloWorld.svg',  path: 'hello_world.wxb' },
    { title: 'example_button_counter',          cover: 'img/ButtonCounter.svg',  path: 'button_counter.wxb' },
    { title: 'example_drawing_lines',           cover: 'img/DrawingLines.svg',  path: 'drawing_lines.wxb' },
    { title: 'example_sensor_movement',         cover: 'img/SensorMovement.svg',  path: 'sensor_read_movement.wxb' },
    { title: 'example_sensor_temp_and_press',   cover: 'img/SensorTempPress.svg',  path: 'sensor_read_temp_pressure.wxb' },
    { title: 'example_move_the_dot',            cover: 'img/MoveTheDot.svg',  path: 'move_the_dot.wxb' },
    { title: 'example_siren',                   cover: 'img/Siren.svg',  path: 'siren.wxb' },
    { title: 'example_watch_face',              cover: 'img/WatchFace.svg',  path: 'watch_face.wxb' },
    { title: 'example_bounce',                  cover: 'img/Bounce.svg',  path: 'bounce.wxb' }
];

watchXBlocks.initExampleList = function() {
    var container = document.getElementById('example-container');
    if(container == null) {
        return;
    }
    while (container.lastElementChild) {
        container.removeChild(container.lastElementChild);
    }
    for(var item of watchXBlocks.exampleList) {
        var template = document.getElementById("example_item");
        var clone = template.content.cloneNode(true);
        if(item.desc == null) {
            item.desc = item.title + "_desc";
        }
        watchXBlocks.setupImageEx(clone, ".media-cover", item.title, item.cover);
        watchXBlocks.setupTranslateEx(clone, ".media-title", item.title);
        watchXBlocks.setupTranslateEx(clone, ".media-desc", item.desc);
        var node = watchXBlocks.setupDataPathEx(clone, ".load-wxb", item.path);
        if(node) {
            watchXBlocks.bindClick_(node, function(e) {
                var footer = e.target.closest(".media-footer");
                var anchor = footer.querySelector("a.load-wxb");
                var data = anchor.getAttribute('data-wxb');
                if(!data) {
                    return;
                }
                watchXBlocks.loadServerXmlFile('/examples/' + data);
            });
        }
        container.appendChild(clone);
    }
};

watchXBlocks.watchFaceList = [
    { title: 'Tap Clock', cover: 'img/TapClock.svg', path: 'firmware/TapClock.hex', desc: 'by <a target="_blank" href="https://github.com/venice1200/TapClock/tree/master/TapClock">venice1200</a>' },
    { title: 'Word Clock', cover: 'img/WordClock.svg', path: 'firmware/WordClock.hex', desc: 'by <a target="_blank" href="https://github.com/venice1200/TapClock/tree/master/WordClock">venice1200</a>' },
    { title: 'Pacman', cover: 'img/Pacman.svg', path: 'firmware/Pacman.hex', desc: 'by <a target="_blank" href="https://github.com/mic159/Pong_Clock">0miker0 & mic159</a>' },
    { title: 'Pong', cover: 'img/Pong.svg', path: 'firmware/Pong.hex', desc: 'by <a target="_blank" href="https://github.com/mic159/Pong_Clock">0miker0 & mic159</a>' },
    { title: 'Tetris', cover: 'img/Tetris.svg', path: 'firmware/Tetris.hex', desc: 'by <a target="_blank" href="https://github.com/mic159/Pong_Clock">0miker0 & mic159</a>' },
    { title: 'Nwatch', cover: 'img/Nwatch.svg', path: 'firmware/Nwatch.hex', desc: 'by <a target="_blank" href="https://github.com/zkemble/NWatch">Zak Kemble</a> & <a target="_blank" href="https://www.reddit.com/r/watchX/comments/8wjh6j/porting_nwatch_source_code">sasapea3</a>' },
];
watchXBlocks.initWatchFaceList = function() {
    var container = document.getElementById('watch-face-container');
    if(container == null) {
        return;
    }
    while (container.lastElementChild) {
        container.removeChild(container.lastElementChild);
    }
    for(var item of watchXBlocks.watchFaceList) {
        var template = document.getElementById("watch_face_item");
        var clone = template.content.cloneNode(true);
        if(item.desc == null) {
            item.desc = "By argeX";
        }
        watchXBlocks.setupImageEx(clone, ".media-cover", item.title, item.cover);
        watchXBlocks.setTextEx(clone, ".media-title", item.title);
        watchXBlocks.setTextEx(clone, ".media-desc", item.desc);
        var node = watchXBlocks.setupDataPathEx(clone, ".upload-hex", item.path);
        if(node) {
            watchXBlocks.bindClick_(node, watchXBlocks.firmwareUpload);
        }
        container.appendChild(clone);
    }
};

watchXBlocks.gameList = [
    { title: 'ArduBreakout', cover: 'img/ArduBreakout.png', path: 'games/ArduBreakout for watchX.hex', desc: 'a classic brick breaking game<br/>developed by Arduboy', source: 'https://github.com/argeX-official/Game-ArduBreakout' },
    { title: 'ArduMan', cover: 'img/ArduMan.png', path: 'games/ArduMan for watchX.hex', desc: 're-imagination of a nostalgic game<br/>developed by Seth Robinson', source: 'https://github.com/argeX-official/Game-ArduMan' },
    { title: 'ArduSnake', cover: 'img/ArduSnake.png', path: 'games/ArduSnake for watchX.hex', desc: 're-imagination of the classic snake game<br/>developed by Initgraph', source: 'https://github.com/argeX-official/Game-ArduSnake' },
    { title: 'Arduboy3D', cover: 'img/Arduboy3D.png', path: 'games/Arduboy3D for watchX.hex', desc: 'explore mazes and fight with enemies<br/>developed by jhhoward', source: 'https://github.com/argeX-official/Game-Arduboy3D' },
    { title: 'Chie Magari Ita', cover: 'img/Chie_Magari_Ita.png', path: 'games/Chie Magari Ita for watchX.hex', desc: 'a placing puzzle game<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
    { title: 'Flappy Ball', cover: 'img/Flappy_Ball.png', path: 'games/Flappy Ball for watchX.hex', desc: 'a bird bouncing game<br/>developed by Scott Allen', source: 'https://github.com/argeX-official/Game-Flappy_Ball' },
    { title: 'Hollow Seeker', cover: 'img/Hollow_Seeker.png', path: 'games/Hollow Seeker for watchX.hex', desc: 'search for a hollow spot to survive<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
    { title: 'Hopper', cover: 'img/Hopper.png', path: 'games/Hopper for watchX.hex', desc: 'jump on hingher platforms to get more points<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
    { title: 'Knight Move', cover: 'img/Knight_Move.png', path: 'games/Knight Move for watchX.hex', desc: 'play chess by only using the knight<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
    { title: 'Lasers', cover: 'img/Lasers.png', path: 'games/Lasers for watchX.hex', desc: 'try to escape from the lasers<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
    { title: 'Micro Tank', cover: 'img/Micro_Tank.png', path: 'games/Micro Tank for watchX.hex', desc: 'use different types of tanks<br/>developed by hartmann1301', source: 'https://github.com/argeX-official/Game-Mirco_Tank' },
    { title: 'MicroCity', cover: 'img/MicroCity.png', path: 'games/MicroCity for watchX.hex', desc: 'build cities with roads and infrastructure<br/>developed by jhhoward', source: 'https://github.com/argeX-official/Game-MicroCity' },
    { title: 'Mystic Balloon', cover: 'img/Mystic_Balloon.png', path: 'games/Mystic Balloon for watchX.hex', desc: 'a platformer with balloon surfing dynamics<br/>developed by TEAM a.r.g.', source: 'https://github.com/argeX-official/Game-Mystic_Balloon' },
    { title: 'Picovaders', cover: 'img/Picovaders.png', path: 'games/Picovaders for watchX.hex', desc: 're-imagination of a nostalgic game<br/>developed by boochow', source: 'https://github.com/argeX-official/Game-Picovaders' },
    { title: 'Shadow Runner', cover: 'img/Shadow_Runner.png', path: 'games/Shadow Runner for watchX.hex', desc: 'evade enemies while running<br/>developed by TEAM a.r.g.', source: 'https://github.com/argeX-official/Game-Shadow_Runner' },
    { title: 'Squario', cover: 'img/Squario.png', path: 'games/Squario for watchX.hex', desc: 'a platformer with simple gameplay<br/>developed by arduboychris', source: 'https://github.com/argeX-official/Game-Squario' },
    { title: 'Stellar Impact', cover: 'img/Stellar_Impact.png', path: 'games/Stellar Impact for watchX.hex', desc: 'side scrolling space action game<br/>developed by Athene Allen', source: 'https://github.com/argeX-official/Game-Stellar_Impact' }
];

watchXBlocks.initGameList = function() {
    var container = document.getElementById('games-container');
    if(container == null) {
        return;
    }
    while (container.lastElementChild) {
        container.removeChild(container.lastElementChild);
    }
    for(var item of watchXBlocks.gameList) {
        var template = document.getElementById("game_item"); // duplicated
        var clone = template.content.cloneNode(true);
        if(item.desc == null) {
            item.desc = "By argeX";
        }
        watchXBlocks.setupImageEx(clone, ".media-cover", item.title, item.cover);
        watchXBlocks.setTextEx(clone, ".media-title", item.title);
        watchXBlocks.setTextEx(clone, ".media-desc", item.desc);
        watchXBlocks.setupAnchorEx(clone, ".media-link", item.source);
        var node = watchXBlocks.setupDataPathEx(clone, ".upload-hex", item.path);
        if(node) {
            watchXBlocks.bindClick_(node, watchXBlocks.firmwareUpload);
        }
        container.appendChild(clone);
    }
};

watchXBlocks.firmwareUpload = function(e) {
    var footer = e.target.closest(".media-footer");
    var anchor = footer.querySelector("a.upload-hex");
    var data = anchor.getAttribute('data-wxb');
    if(!data) {
        return;
    }
    footer.classList.add('media-active');
    watchXBlocks.resetIdeOutputContent();
    watchXBlocksServer.sendRequest('/upload-hex', 'POST', 'application/json', {"hex_path": data }, jsonObj => {
        footer.classList.remove('media-active');
        if (jsonObj === null) {
            return watchXBlocks.openNotConnectedModal();
        }
        var dataBack = watchXBlocksServer.jsonToIdeModal(jsonObj);
        watchXBlocks.arduinoIdeOutput(dataBack);
    });
};

watchXBlocks.setupImageEx = function(wrapper, selector, alt, src) {
    var e = wrapper.querySelector(selector);
    if(e) {
        e.setAttribute("alt", alt);
        e.setAttribute("src", src);
    }
    return e;
};
watchXBlocks.setupAnchorEx = function(wrapper, selector, src) {
    var e = wrapper.querySelector(selector);
    if(e) {
        e.setAttribute("href", src);
    }
    return e;
};
watchXBlocks.setupTranslateEx = function(wrapper, selector, string_id) {
    var e = wrapper.querySelector(selector);
    if(e) {
        e.classList.add("translatable_" + string_id);
    }
    return e;
};
watchXBlocks.setTextEx = function(wrapper, selector, string_id) {
    var e = wrapper.querySelector(selector);
    if(e) {
        e.innerHTML = string_id;
    }
    return e;
};
watchXBlocks.setupDataPathEx = function(wrapper, selector, data) {
    var e = wrapper.querySelector(selector);
    if(e) {
        e.setAttribute("data-wxb", data);
    }
    return e;
};