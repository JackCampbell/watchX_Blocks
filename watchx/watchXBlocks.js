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
watchXBlocks.init = function() {
  // Lang init must run first for the rest of the page to pick the right msgs
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
};

/** Binds functions to each of the buttons, nav links, and related. */
watchXBlocks.bindActionFunctions = function() {
  // Navigation buttons
  watchXBlocks.bindClick_('button_load', watchXBlocks.loadUserXmlFile);
  watchXBlocks.bindClick_('button_save', watchXBlocks.saveXmlFile);
  watchXBlocks.bindClick_('button_delete', watchXBlocks.discardAllBlocks);

  // Side menu buttons, they also close the side menu
  watchXBlocks.bindClick_('menu_load', function() {
    watchXBlocks.loadUserXmlFile();
    $('.button-collapse').sideNav('hide');
  });
  watchXBlocks.bindClick_('menu_save', function() {
    watchXBlocks.saveXmlFile();
    $('.button-collapse').sideNav('hide');
  });
  watchXBlocks.bindClick_('menu_delete', function() {
    watchXBlocks.discardAllBlocks();
    $('.button-collapse').sideNav('hide');
  });
  watchXBlocks.bindClick_('menu_settings', function() {
    watchXBlocks.openSettings();
    $('.button-collapse').sideNav('hide');
  });
  watchXBlocks.bindClick_('menu_example_1', function() {
    watchXBlocks.loadServerXmlFile('../examples/blink.xml');
    $('.button-collapse').sideNav('hide');
  });
  watchXBlocks.bindClick_('menu_example_2', function() {
    watchXBlocks.loadServerXmlFile('../examples/serial_print_ascii.xml');
    $('.button-collapse').sideNav('hide');
  });
  watchXBlocks.bindClick_('menu_example_3', function() {
    watchXBlocks.loadServerXmlFile('../examples/serial_repeat_game.xml');
    $('.button-collapse').sideNav('hide');
  });
  watchXBlocks.bindClick_('menu_example_4', function() {
    watchXBlocks.loadServerXmlFile('../examples/servo_knob.xml');
    $('.button-collapse').sideNav('hide');
  });
  watchXBlocks.bindClick_('menu_example_5', function() {
    watchXBlocks.loadServerXmlFile('../examples/stepper_knob.xml');
    $('.button-collapse').sideNav('hide');
  });

  // Floating buttons
  watchXBlocks.bindClick_('button_ide_large', function() {
    watchXBlocks.ideButtonLargeAction();
  });
  watchXBlocks.bindClick_('button_ide_middle', function() {
      watchXBlocks.ideButtonMiddleAction();
  });
  watchXBlocks.bindClick_('button_ide_left', function() {
    watchXBlocks.ideButtonLeftAction();
  });
  watchXBlocks.bindClick_('button_load_xml', watchXBlocks.XmlTextareaToBlocks);
  watchXBlocks.bindClick_('button_toggle_toolbox', watchXBlocks.toogleToolbox);

  // Settings modal input field listeners only if they can be edited
  var settingsPathInputListeners = function(elId, setValFunc, setHtmlCallback) {
    var el = document.getElementById(elId);
    if (el.readOnly === false) {
      // Event listener that send the data when the user presses 'Enter'
      el.onkeypress = function(e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
          setValFunc(el.value, function(jsonObj) {
            setHtmlCallback(watchXBlocksServer.jsonToHtmlTextInput(jsonObj));
          });
          return false;
        }
      };
      // Event listener that send the data when moving out of the input field
      el.onblur = function() {
        setValFunc(el.value, function(jsonObj) {
          setHtmlCallback(watchXBlocksServer.jsonToHtmlTextInput(jsonObj));
        });
      };
    }
  };
  settingsPathInputListeners('settings_compiler_location',
                             watchXBlocksServer.setCompilerLocation,
                             watchXBlocks.setCompilerLocationHtml);
  settingsPathInputListeners('settings_sketch_location',
                             watchXBlocksServer.setSketchLocationHtml,
                             watchXBlocks.setSketchLocationHtml);
};

/** Sets the watchXBlocks server IDE setting to upload and sends the code. */
watchXBlocks.ideSendUpload = function() {
  // Check if this is the currently selected option before edit sever setting
  if (watchXBlocks.ideButtonLargeAction !== watchXBlocks.ideSendUpload) {
    watchXBlocks.showExtraIdeButtons(false);
    watchXBlocks.setIdeSettings(null, 'upload');
  }
  watchXBlocks.shortMessage(watchXBlocks.getLocalStr('uploadingSketch'));
  watchXBlocks.resetIdeOutputContent();
  watchXBlocks.sendCode();
};

/** Sets the watchXBlocks server IDE setting to verify and sends the code. */
watchXBlocks.ideSendVerify = function() {
  // Check if this is the currently selected option before edit sever setting
  if (watchXBlocks.ideButtonLargeAction !== watchXBlocks.ideSendVerify) {
    watchXBlocks.showExtraIdeButtons(false);
    watchXBlocks.setIdeSettings(null, 'verify');
  }
  watchXBlocks.shortMessage(watchXBlocks.getLocalStr('verifyingSketch'));
  watchXBlocks.resetIdeOutputContent();
  watchXBlocks.sendCode();
};

/** Sets the watchXBlocks server IDE setting to open and sends the code. */
watchXBlocks.ideSendOpen = function() {
  // Check if this is the currently selected option before edit sever setting
  if (watchXBlocks.ideButtonLargeAction !== watchXBlocks.ideSendOpen) {
    watchXBlocks.showExtraIdeButtons(false);
    watchXBlocks.setIdeSettings(null, 'open');
  }
  watchXBlocks.shortMessage(watchXBlocks.getLocalStr('openingSketch'));
  watchXBlocks.resetIdeOutputContent();
  watchXBlocks.sendCode();
};

/** Function bound to the left IDE button, to be changed based on settings. */
watchXBlocks.ideButtonLargeAction = watchXBlocks.ideSendUpload;

/** Function bound to the middle IDE button, to be changed based on settings. */
watchXBlocks.ideButtonMiddleAction = watchXBlocks.ideSendVerify;

/** Function bound to the large IDE button, to be changed based on settings. */
watchXBlocks.ideButtonLeftAction = watchXBlocks.ideSendOpen;

/** Initialises the IDE buttons with the default option from the server. */
watchXBlocks.initialiseIdeButtons = function() {
  document.getElementById('button_ide_left').title =
      watchXBlocks.getLocalStr('openSketch');
  document.getElementById('button_ide_middle').title =
      watchXBlocks.getLocalStr('verifySketch');
  document.getElementById('button_ide_large').title =
      watchXBlocks.getLocalStr('uploadSketch');
  watchXBlocksServer.requestIdeOptions(function(jsonObj) {
    if (jsonObj != null) {
      watchXBlocks.changeIdeButtons(jsonObj.selected);
    } // else Null: watchXBlocks server is not running, do nothing
  });
};

/**
 * Changes the IDE launch buttons based on the option indicated in the argument.
 * @param {!string} value One of the 3 possible values from the drop down select
 *     in the settings modal: 'upload', 'verify', or 'open'.
 */
watchXBlocks.changeIdeButtons = function(value) {
  var largeButton = document.getElementById('button_ide_large');
  var middleButton = document.getElementById('button_ide_middle');
  var leftButton = document.getElementById('button_ide_left');
  var openTitle = watchXBlocks.getLocalStr('openSketch');
  var verifyTitle = watchXBlocks.getLocalStr('verifySketch');
  var uploadTitle = watchXBlocks.getLocalStr('uploadSketch');
  if (value === 'upload') {
    watchXBlocks.changeIdeButtonsDesign(value);
    watchXBlocks.ideButtonLeftAction = watchXBlocks.ideSendOpen;
    watchXBlocks.ideButtonMiddleAction = watchXBlocks.ideSendVerify;
    watchXBlocks.ideButtonLargeAction = watchXBlocks.ideSendUpload;
    leftButton.title = openTitle;
    middleButton.title = verifyTitle;
    largeButton.title = uploadTitle;
  } else if (value === 'verify') {
    watchXBlocks.changeIdeButtonsDesign(value);
    watchXBlocks.ideButtonLeftAction = watchXBlocks.ideSendOpen;
    watchXBlocks.ideButtonMiddleAction = watchXBlocks.ideSendUpload;
    watchXBlocks.ideButtonLargeAction = watchXBlocks.ideSendVerify;
    leftButton.title = openTitle;
    middleButton.title = uploadTitle;
    largeButton.title = verifyTitle;
  } else if (value === 'open') {
    watchXBlocks.changeIdeButtonsDesign(value);
    watchXBlocks.ideButtonLeftAction = watchXBlocks.ideSendVerify;
    watchXBlocks.ideButtonMiddleAction = watchXBlocks.ideSendUpload;
    watchXBlocks.ideButtonLargeAction = watchXBlocks.ideSendOpen;
    leftButton.title = verifyTitle;
    middleButton.title = uploadTitle;
    largeButton.title = openTitle;
  }
};

/**
 * Loads an XML file from the server and replaces the current blocks into the
 * Blockly workspace.
 * @param {!string} xmlFile Server location of the XML file to load.
 */
watchXBlocks.loadServerXmlFile = function(xmlFile) {
  var loadXmlfileAccepted = function() {
    // loadXmlBlockFile loads the file asynchronously and needs a callback
    var loadXmlCb = function(sucess) {
      if (sucess) {
        watchXBlocks.renderContent();
      } else {
        watchXBlocks.alertMessage(
            watchXBlocks.getLocalStr('invalidXmlTitle'),
            watchXBlocks.getLocalStr('invalidXmlBody'),
            false);
      }
    };
    var connectionErrorCb = function() {
      watchXBlocks.openNotConnectedModal();
    };
    watchXBlocks.loadXmlBlockFile(xmlFile, loadXmlCb, connectionErrorCb);
  };

  if (watchXBlocks.isWorkspaceEmpty()) {
    loadXmlfileAccepted();
  } else {
    watchXBlocks.alertMessage(
        watchXBlocks.getLocalStr('loadNewBlocksTitle'),
        watchXBlocks.getLocalStr('loadNewBlocksBody'),
        true, loadXmlfileAccepted);
  }
};

/**
 * Loads an XML file from the users file system and adds the blocks into the
 * Blockly workspace.
 */
watchXBlocks.loadUserXmlFile = function() {
  // Create File Reader event listener function
  var parseInputXMLfile = function(e) {
    var xmlFile = e.target.files[0];
    var filename = xmlFile.name;
    var extensionPosition = filename.lastIndexOf('.');
    if (extensionPosition !== -1) {
      filename = filename.substr(0, extensionPosition);
    }

    var reader = new FileReader();
    reader.onload = function() {
      var success = watchXBlocks.replaceBlocksfromXml(reader.result);
      if (success) {
        watchXBlocks.renderContent();
        watchXBlocks.sketchNameSet(filename);
      } else {
        watchXBlocks.alertMessage(
            watchXBlocks.getLocalStr('invalidXmlTitle'),
            watchXBlocks.getLocalStr('invalidXmlBody'),
            false);
      }
    };
    reader.readAsText(xmlFile);
  };

  // Create once invisible browse button with event listener, and click it
  var selectFile = document.getElementById('select_file');
  if (selectFile === null) {
    var selectFileDom = document.createElement('INPUT');
    selectFileDom.type = 'file';
    selectFileDom.id = 'select_file';

    var selectFileWrapperDom = document.createElement('DIV');
    selectFileWrapperDom.id = 'select_file_wrapper';
    selectFileWrapperDom.style.display = 'none';
    selectFileWrapperDom.appendChild(selectFileDom);

    document.body.appendChild(selectFileWrapperDom);
    selectFile = document.getElementById('select_file');
    selectFile.addEventListener('change', parseInputXMLfile, false);
  }
  selectFile.click();
};

/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
watchXBlocks.saveXmlFile = function() {
  watchXBlocks.saveTextFileAs(
      document.getElementById('sketch_name').value + '.xml',
      watchXBlocks.generateXml());
};

/**
 * Creates an Arduino Sketch file containing the Arduino code generated from
 * the Blockly workspace and prompts the users to save it into their local file
 * system.
 */
watchXBlocks.saveSketchFile = function() {
  watchXBlocks.saveTextFileAs(
      document.getElementById('sketch_name').value + '.ino',
      watchXBlocks.generateArduino());
};

/**
 * Creates an text file with the input content and files name, and prompts the
 * users to save it into their local file system.
 * @param {!string} fileName Name for the file to be saved.
 * @param {!string} content Text datd to be saved in to the file.
 */
watchXBlocks.saveTextFileAs = function(fileName, content) {
  var blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, fileName);
};

/**
 * Retrieves the Settings from watchXBlocksServer to populates the form data
 * and opens the Settings modal dialog.
 */
watchXBlocks.openSettings = function() {
  watchXBlocksServer.requestCompilerLocation(function(jsonObj) {
    watchXBlocks.setCompilerLocationHtml(
        watchXBlocksServer.jsonToHtmlTextInput(jsonObj));
  });
  watchXBlocksServer.requestSketchLocation(function(jsonObj) {
    watchXBlocks.setSketchLocationHtml(
        watchXBlocksServer.jsonToHtmlTextInput(jsonObj));
  });
  watchXBlocksServer.requestArduinoBoards(function(jsonObj) {
    watchXBlocks.setArduinoBoardsHtml(
        watchXBlocksServer.jsonToHtmlDropdown(jsonObj));
  });
  watchXBlocksServer.requestSerialPorts(function(jsonObj) {
    watchXBlocks.setSerialPortsHtml(
        watchXBlocksServer.jsonToHtmlDropdown(jsonObj));
  });
  watchXBlocksServer.requestIdeOptions(function(jsonObj) {
    watchXBlocks.setIdeHtml(watchXBlocksServer.jsonToHtmlDropdown(jsonObj));
  });
  // Language menu only set on page load within watchXBlocks.initLanguage()
  watchXBlocks.openSettingsModal();
};

/**
 * Sets the compiler location form data retrieve from an updated element.
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setCompilerLocationHtml = function(newEl) {
  if (newEl === null) return watchXBlocks.openNotConnectedModal();

  var compLocIp = document.getElementById('settings_compiler_location');
  if (compLocIp != null) {
    compLocIp.value = newEl.value || compLocIp.value ||
        'Please enter the location of the Arduino IDE executable';
    compLocIp.style.cssText = newEl.style.cssText;
  }
};

/**
 * Sets the sketch location form data retrieve from an updated element.
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setSketchLocationHtml = function(newEl) {
  if (newEl === null) return watchXBlocks.openNotConnectedModal();

  var sketchLocIp = document.getElementById('settings_sketch_location');
  if (sketchLocIp != null) {
    sketchLocIp.value = newEl.value || sketchLocIp.value ||
        'Please enter a folder to store the Arduino Sketch';
    sketchLocIp.style.cssText = newEl.style.cssText;
  }
};

/**
 * Replaces the Arduino Boards form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} jsonObj JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setArduinoBoardsHtml = function(newEl) {
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
watchXBlocks.setBoard = function() {
  var el = document.getElementById('board');
  var boardValue = el.options[el.selectedIndex].value;
  watchXBlocksServer.setArduinoBoard(boardValue, function(jsonObj) {
    var newEl = watchXBlocksServer.jsonToHtmlDropdown(jsonObj);
    watchXBlocks.setArduinoBoardsHtml(newEl);
  });
  watchXBlocks.changeBlocklyArduinoBoard(
      boardValue.toLowerCase().replace(/ /g, '_'));
};

/**
 * Replaces the Serial Port form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setSerialPortsHtml = function(newEl) {
  if (newEl === null) return watchXBlocks.openNotConnectedModal();

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
watchXBlocks.setSerial = function() {
  var el = document.getElementById('serial_port');
  var serialValue = el.options[el.selectedIndex].value;
  watchXBlocksServer.setSerialPort(serialValue, function(jsonObj) {
    var newEl = watchXBlocksServer.jsonToHtmlDropdown(jsonObj);
    watchXBlocks.setSerialPortsHtml(newEl);
  });
};

/**
 * Replaces IDE options form data with a new HTMl element.
 * Ensures there is a change listener to call 'setIdeSettings' function
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
watchXBlocks.setIdeHtml = function(newEl) {
  if (newEl === null) return watchXBlocks.openNotConnectedModal();

  var ideDropdown = document.getElementById('ide_settings');
  if (ideDropdown !== null) {
    // Restarting the select elements built by materialize
    $('select').material_select('destroy');
    newEl.name = 'settings_ide';
    newEl.id = 'ide_settings';
    newEl.onchange = watchXBlocks.setIdeSettings;
    ideDropdown.parentNode.replaceChild(newEl, ideDropdown);
    // Refresh the materialize select menus
    $('select').material_select();
  }
};

/**
 * Sets the IDE settings data with the selected user input from the drop down.
 * @param {Event} e Event that triggered this function call. Required for link
 *     it to the listeners, but not used.
 * @param {string} preset A value to set the IDE settings bypassing the drop
 *     down selected value. Valid data: 'upload', 'verify', or 'open'.
 */
watchXBlocks.setIdeSettings = function(e, preset) {
  if (preset !== undefined) {
    var ideValue = preset;
  } else {
    var el = document.getElementById('ide_settings');
    var ideValue = el.options[el.selectedIndex].value;
  }
  watchXBlocks.changeIdeButtons(ideValue);
  watchXBlocksServer.setIdeOptions(ideValue, function(jsonObj) {
    watchXBlocks.setIdeHtml(watchXBlocksServer.jsonToHtmlDropdown(jsonObj));
  });
};

/**
 * Send the Arduino Code to the watchXBlocksServer to process.
 * Shows a loader around the button, blocking it (unblocked upon received
 * message from server).
 */
watchXBlocks.sendCode = function() {
  watchXBlocks.largeIdeButtonSpinner(true);

  /**
   * Receives the IDE data back to be displayed and stops spinner.
   * @param {element} jsonResponse JSON data coming back from the server.
   * @return {undefined} Might exit early if response is null.
   */
  var sendCodeReturn = function(jsonObj) {
    watchXBlocks.largeIdeButtonSpinner(false);
    if (jsonObj === null) return watchXBlocks.openNotConnectedModal();
    var dataBack = watchXBlocksServer.jsonToIdeModal(jsonObj);
    watchXBlocks.arduinoIdeOutput(dataBack);
  };

  watchXBlocksServer.sendSketchToServer(
      watchXBlocks.generateArduino(), sendCodeReturn);
};

/** Populate the workspace blocks with the XML written in the XML text area. */
watchXBlocks.XmlTextareaToBlocks = function() {
  var success = watchXBlocks.replaceBlocksfromXml(
      document.getElementById('content_xml').value);
  if (success) {
    watchXBlocks.renderContent();
  } else {
    watchXBlocks.alertMessage(
        watchXBlocks.getLocalStr('invalidXmlTitle'),
        watchXBlocks.getLocalStr('invalidXmlBody'),
        false);
  }
};

/**
 * Private variable to save the previous version of the Arduino Code.
 * @type {!String}
 * @private
 */
watchXBlocks.PREV_ARDUINO_CODE_ = 'void setup() {\n\n}\n\n\nvoid loop() {\n\n}';

/**
 * Populate the Arduino Code and Blocks XML panels with content generated from
 * the blocks.
 */
watchXBlocks.renderContent = function() {
  // Render Arduino Code with latest change highlight and syntax highlighting
  var arduinoCode = watchXBlocks.generateArduino();
  if (arduinoCode !== watchXBlocks.PREV_ARDUINO_CODE_) {
    var diff = JsDiff.diffWords(watchXBlocks.PREV_ARDUINO_CODE_, arduinoCode);
    var resultStringArray = [];
    for (var i = 0; i < diff.length; i++) {
      if (!diff[i].removed) {
        var escapedCode = diff[i].value.replace(/</g, '&lt;')
                                       .replace(/>/g, '&gt;');
        if (diff[i].added) {
          resultStringArray.push(
              '<span class="code_highlight_new">' + escapedCode + '</span>');
        } else {
          resultStringArray.push(escapedCode);
        }
      }
    }
    document.getElementById('content_arduino').innerHTML =
        prettyPrintOne(resultStringArray.join(''), 'cpp', false);
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
watchXBlocks.toogleToolbox = function() {
  if (watchXBlocks.TOOLBAR_SHOWING_) {
    watchXBlocks.blocklyCloseToolbox();
    watchXBlocks.displayToolbox(false);
  } else {
    watchXBlocks.displayToolbox(true);
  }
  watchXBlocks.TOOLBAR_SHOWING_ = !watchXBlocks.TOOLBAR_SHOWING_;
};

/** @return {boolean} Indicates if the toolbox is currently visible. */
watchXBlocks.isToolboxVisible = function() {
  return watchXBlocks.TOOLBAR_SHOWING_;
};

/**
 * Lazy loads the additional block JS files from the ./block directory.
 * Initialises any additional watchXBlocks extensions.
 * TODO: Loads the examples into the examples modal
 */
watchXBlocks.importExtraBlocks = function() {
  /**
   * Parses the JSON data to find the block and languages js files.
   * @param {jsonDataObj} jsonDataObj JSON in JavaScript object format, null
   *     indicates an error occurred.
   * @return {undefined} Might exit early if response is null.
   */
  var jsonDataCb = function(jsonDataObj) {
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
        blocksGeneratorJsLoad.src = '../blocks/' + catDir +
            '/generator_arduino.js';
        head.appendChild(blocksGeneratorJsLoad);

        // Check if the blocks add additional watchXBlocks functionality
        var extensions = jsonDataObj.categories[catDir].extensions;
        if (extensions) {
          for (var i = 0; i < extensions.length; i++) {
            var blockExtensionJsLoad = document.createElement('script');
            blockExtensionJsLoad.src = '../blocks/' + catDir + '/extensions.js';
            head.appendChild(blockExtensionJsLoad);
            // Add function to scheduler as lazy loading has to complete first
            setTimeout(function(category, extension) {
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
  watchXBlocksServer.getJson('../blocks/blocks_data.json', jsonDataCb);
};

/** Opens a modal with a list of categories to add or remove to the toolbox */
watchXBlocks.openExtraCategoriesSelect = function() {
  /**
   * Parses the JSON data from the server into a list of additional categories.
   * @param {jsonDataObj} jsonDataObj JSON in JavaScript object format, null
   *     indicates an error occurred.
   * @return {undefined} Might exit early if response is null.
   */
  var jsonDataCb = function(jsonDataObj) {
    if (jsonDataObj === null) return watchXBlocks.openNotConnectedModal();
    var htmlContent = document.createElement('div');
    if (jsonDataObj.categories !== undefined) {
      for (var catDir in jsonDataObj.categories) {
        // Function required to maintain each loop variable scope separated
        (function(cat) {
          var clickBind = function(tickValue) {
            if (tickValue) {
              var catDom = (new DOMParser()).parseFromString(
                  cat.toolbox.join(''), 'text/xml').firstChild;
              watchXBlocks.addToolboxCategory(cat.toolboxName, catDom);
            } else {
              watchXBlocks.removeToolboxCategory(cat.toolboxName);
            }
          };
          htmlContent.appendChild(watchXBlocks.createExtraBlocksCatHtml(
              cat.categoryName, cat.description, clickBind));
        })(jsonDataObj.categories[catDir]);
      }
    }
    watchXBlocks.openAdditionalBlocksModal(htmlContent);
  };
  // Reads the JSON data containing all block categories from ./blocks directory
  // TODO: Now reading a local file, to be replaced by server generated JSON
  watchXBlocksServer.getJson('../blocks/blocks_data.json', jsonDataCb);
};

/** Informs the user that the selected function is not yet implemented. */
watchXBlocks.functionNotImplemented = function() {
  watchXBlocks.shortMessage('Function not yet implemented');
};

/**
 * Interface to display messages with a possible action.
 * @param {!string} title HTML to include in title.
 * @param {!element} body HTML to include in body.
 * @param {boolean=} confirm Indicates if the user is shown a single option (ok)
 *     or an option to cancel, with an action applied to the "ok".
 * @param {string=|function=} callback If confirm option is selected this would
 *     be the function called when clicked 'OK'.
 */
watchXBlocks.alertMessage = function(title, body, confirm, callback) {
  watchXBlocks.materialAlert(title, body, confirm, callback);
};

/**
 * Interface to displays a short message, which disappears after a time out.
 * @param {!string} message Text to be temporarily displayed.
 */
watchXBlocks.shortMessage = function(message) {
  watchXBlocks.MaterialToast(message);
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!function} func Event handler to bind.
 * @private
 */
watchXBlocks.bindClick_ = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  // Need to ensure both, touch and click, events don't fire for the same thing
  var propagateOnce = function(e) {
    e.stopPropagation();
    e.preventDefault();
    func();
  };
  el.addEventListener('ontouchend', propagateOnce);
  el.addEventListener('click', propagateOnce);
};
