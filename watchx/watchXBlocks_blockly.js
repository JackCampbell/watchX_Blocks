/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview watchXBlocks JavaScript for the Blockly resources and bindings.
 */
'use strict';

/** Create a namespace for the application. */
var watchXBlocks = watchXBlocks || {};

/**
 * Blockly main workspace.
 * @type Blockly.WorkspaceSvg
 */
watchXBlocks.workspace = null;

/**
 * Blockly workspace toolbox XML.
 * @type Element
 */
watchXBlocks.xmlTree = null;

/**
 * Injects Blockly into a given HTML element. Toolbox XMl has to be a string.
 * @param {!Element} blocklyEl Element to inject Blockly into.
 * @param {!string} toolboxXml String containing the toolbox XML content.
 * @param {!string} blocklyPath String containing the Blockly directory path.
 */
watchXBlocks.injectBlockly = function(blocklyEl, toolboxXml, blocklyPath) {
  // Remove any trailing slashes in the blockly path
  if (blocklyPath.substr(-1) === '/') {
    blocklyPath = blocklyPath.slice(0, -1);
  }
  watchXBlocks.xmlTree = Blockly.Xml.textToDom(toolboxXml);
  // The Toolbox menu language is edited directly from the XML nodes.
  watchXBlocks.updateToolboxLanguage();
  watchXBlocks.workspace = Blockly.inject(blocklyEl, {
      collapse: true,
      comments: true,
      css: true,
      disable: true,
      maxBlocks: Infinity,
      media: blocklyPath + '/media/',
      rtl: false,
      scrollbars: true,
      sounds: true,
      toolbox: watchXBlocks.xmlTree,
      trashcan: true,
      /*grid: false,
      zoom: {
        controls: true,
        wheel: false,
        startScale: 1.0,
        maxScale: 2,
        minScale: 0.2,
        scaleSpeed: 1.2
      }, */
      // new
      // horizontalLayout: false,
      grid: {
        spacing : 20,
        length : 1,
        colour : '#888',
        snap : true
      },
      zoom : {
        controls : true,
        wheel : true,
        startScale : 1,
        maxScale : 3,
        minScale : 0.3,
        scaleSpeed : 1.2
      }
  });
  // On language change the blocks have been stored in session storage
  watchXBlocks.loadSessionStorageBlocks();
};

/** Binds the event listeners relevant to Blockly. */
watchXBlocks.bindBlocklyEventListeners = function() {
  watchXBlocks.workspace.addChangeListener(function(event) {
    if (event.type != Blockly.Events.UI) {
      watchXBlocks.renderContent();
    }
  });
  // Ensure the Blockly workspace resizes accordingly
  window.addEventListener('resize',
      function() { Blockly.asyncSvgResize(watchXBlocks.workspace); }, false);
};

/** @return {!string} Generated Arduino code from the Blockly workspace. */
watchXBlocks.generateArduino = function() {
  return Blockly.Arduino.workspaceToCode(watchXBlocks.workspace);
};

/** @return {!string} Generated XML code from the Blockly workspace. */
watchXBlocks.generateXml = function() {
  var xmlDom = Blockly.Xml.workspaceToDom(watchXBlocks.workspace);
  return Blockly.Xml.domToPrettyText(xmlDom);
};

/**
 * Loads an XML file from the server and replaces the current blocks into the
 * Blockly workspace.
 * @param {!string} xmlFile XML file path in a reachable server (no local path).
 * @param {!function} cbSuccess Function to be called once the file is loaded.
 * @param {!function} cbError Function to be called if there is a connection
 *     error to the XML server.
 */
watchXBlocks.loadXmlBlockFile = function(xmlFile, cbSuccess, cbError) {
  var request = watchXBlocks.ajaxRequest();
  var requestCb = function() {
    if (request.readyState == 4) {
      if (request.status == 200) {
        var success = watchXBlocks.replaceBlocksfromXml(request.responseText);
        cbSuccess(success);
      } else {
        cbError();
      }
    }
  };
  try {
    request.open('GET', xmlFile, true);
    request.onreadystatechange = requestCb;
    request.send(null);
  } catch (e) {
    cbError();
  }
};

/**
 * Parses the XML from its argument input to generate and replace the blocks
 * in the Blockly workspace.
 * @param {!string} blocksXml String of XML code for the blocks.
 * @return {!boolean} Indicates if the XML into blocks parse was successful.
 */
watchXBlocks.replaceBlocksfromXml = function(blocksXml) {
  var xmlDom = null;
  try {
    xmlDom = Blockly.Xml.textToDom(blocksXml);
  } catch (e) {
    return false;
  }
  watchXBlocks.workspace.clear();
  var sucess = false;
  if (xmlDom) {
    sucess = watchXBlocks.loadBlocksfromXmlDom(xmlDom);
  }
  return sucess;
};

/**
 * Parses the XML from its argument to add the blocks to the workspace.
 * @param {!string} blocksXmlDom String of XML DOM code for the blocks.
 * @return {!boolean} Indicates if the XML into blocks parse was successful.
 */
watchXBlocks.loadBlocksfromXmlDom = function(blocksXmlDom) {
  try {
    Blockly.Xml.domToWorkspace(blocksXmlDom, watchXBlocks.workspace);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Save blocks into session storage. Note that MSIE 11 does not support
 * sessionStorage on file:// URLs.
 */
watchXBlocks.saveSessionStorageBlocks = function() {
  if (window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(watchXBlocks.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }
};

/** Load blocks saved on session storage and deletes them from storage. */
watchXBlocks.loadSessionStorageBlocks = function() {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch (e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if (loadOnce) {
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, watchXBlocks.workspace);
  }
};

/** Discard all blocks from the workspace. */
watchXBlocks.discardAllBlocks = function() {
  var blockCount = watchXBlocks.workspace.getAllBlocks().length;
  if (blockCount == 1) {
    watchXBlocks.workspace.clear();
    watchXBlocks.renderContent();
  } else if (blockCount > 1) {
    watchXBlocks.alertMessage(
        watchXBlocks.getLocalStr('discardBlocksTitle'),
        watchXBlocks.getLocalStr('discardBlocksBody')
            .replace('%1', blockCount),
        true,
        function() {
          watchXBlocks.workspace.clear();
          watchXBlocks.renderContent();
        });
  }
};

/** @return {!boolean} Indicates if the Blockly workspace has blocks. */
watchXBlocks.isWorkspaceEmpty = function() {
  return watchXBlocks.workspace.getAllBlocks().length ? false : true;
};

/**
 * Changes the Arduino board profile if different from the currently set one.
 * @param {string} newBoard Name of the new profile to set.
 */
watchXBlocks.changeBlocklyArduinoBoard = function(newBoard) {
  if (Blockly.Arduino.Boards.selected !== Blockly.Arduino.Boards[newBoard]) {
    Blockly.Arduino.Boards.changeBoard(watchXBlocks.workspace, newBoard);
  }
};

/** Update the toolbox categories language. */
watchXBlocks.updateToolboxLanguage = function() {
  var categories = ['catLogic', 'catLoops', 'catMath', 'catText',
                    'catVariables', 'catFunctions', 'catInputOutput',
                    'catTime', 'catAudio', 'catMotors', 'catComms'];
  var categoryNodes = watchXBlocks.xmlTree.getElementsByTagName('category');
  for (var i = 0, cat; cat = categoryNodes[i]; i++) {
    var catId = cat.getAttribute('id');
    var catText = watchXBlocks.getLocalStr(catId);
    if (catText) {
      cat.setAttribute('name', catText);
    }
  }
};

/**
 * Adds a category to the current toolbox.
 * @param {!string} categoryTitle Toolbox category title.
 * @param {!Element} categoryDom Toolbox category to add add the end of tree.
 */
watchXBlocks.addToolboxCategory = function(categoryTitle, categoryDom) {
  categoryDom.id = 'cat' + categoryTitle.replace(/\s+/g, '');
  categoryDom.setAttribute('name', categoryTitle);
  watchXBlocks.xmlTree.appendChild(document.createElement('sep'));
  watchXBlocks.xmlTree.appendChild(categoryDom);
  watchXBlocks.workspace.updateToolbox(watchXBlocks.xmlTree);
};

/**
 * Removes a category to the current toolbox.
 * @param {!String} categoryTitle Toolbox category name to remove from tree.
 */
watchXBlocks.removeToolboxCategory = function(categoryTitle) {
  var categoryId = 'cat' + categoryTitle.replace(/\s+/g, '');
  var categoryNodes = watchXBlocks.xmlTree.getElementsByTagName('category');
  for (var i = 0; i < categoryNodes.length; i++) {
    if (categoryNodes[i].getAttribute('id') === categoryId) {
      var previousNode = categoryNodes[i].previousElementSibling;
      watchXBlocks.xmlTree.removeChild(categoryNodes[i]);
      if (previousNode && previousNode.nodeName == 'sep') {
        watchXBlocks.xmlTree.removeChild(previousNode);
      }
    }
  }
  watchXBlocks.workspace.updateToolbox(watchXBlocks.xmlTree);
};

/** Closes the toolbox block container sub-menu. */
watchXBlocks.blocklyCloseToolbox = function() {
  watchXBlocks.workspace.toolbox_.flyout_.hide();
};

/** @return {!integer} The width of the blockly workspace toolbox. */
watchXBlocks.blocklyToolboxWidth = function() {
  return watchXBlocks.workspace.toolbox_.width;
};

/** @return {!boolean} Indicates if a block is currently being dragged. */
watchXBlocks.blocklyIsDragging = function() {
  return (Blockly.dragMode_ != 0) ? true : false;
};

/** Wraps the blockly 'cut' functionality. */
watchXBlocks.blocklyCut = function() {
  if (Blockly.selected) {
    Blockly.copy_(Blockly.selected);
    Blockly.selected.dispose(true, true);
  }
};

/** Wraps the blockly 'copy' functionality. */
watchXBlocks.blocklyCopy = function() {
  if (Blockly.selected) {
    Blockly.copy_(Blockly.selected);
  }
};

/** Wraps the blockly 'paste' functionality. */
watchXBlocks.blocklyPaste = function() {
  if (Blockly.clipboardXml_) {
    Blockly.hideChaff();
    Blockly.clipboardSource_.paste(Blockly.clipboardXml_);
  }
};

/** Wraps the blockly 'delete' functionality. */
watchXBlocks.blocklyDelete = function() {
  if (Blockly.selected && Blockly.selected.isDeletable()) {
    Blockly.hideChaff();
    Blockly.selected.dispose(true, true);
  }
};

/** @return {XMLHttpRequest} An XML HTTP Request multi-browser compatible. */
watchXBlocks.ajaxRequest = function() {
  var request;
  try {
    // Firefox, Chrome, IE7+, Opera, Safari
    request = new XMLHttpRequest();
  } catch (e) {
    try {
      // IE6 and earlier
      request = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      try {
        request = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {
        throw 'Your browser does not support AJAX';
        request = null;
      }
    }
  }
  return request;
};
