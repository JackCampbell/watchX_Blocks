/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Ajax calls to the Ardublockly Server python program.
 */
'use strict';

/** Create a name space for the application. */
var watchXBlocksServer = {};

/**
 * Reads JSON data from the server and forwards formatted JavaScript object.
 * @param {!string} url Location for the JSON data.
 * @param {!function} jsonDataCb Callback with JSON object or null for error.
 */
watchXBlocksServer.getJson = function (url, callback) {
    watchXBlocksServer.sendRequest(url, 'GET', 'application/json', null, callback);
};

/**
 * Sends JSON data to the watchXBlocksServer.
 * @param {!string} url Requestor URL.
 * @param {!string} json JSON string.
 * @param {!function} callback Request callback function.
 */
watchXBlocksServer.putJson = function (url, json, callback) {
    watchXBlocksServer.sendRequest(url, 'PUT', 'application/json', json, callback);
};

/**
 * Sends a request to the Ardubloockly Server that returns a JSON response.
 * @param {!string} url Requestor URL.
 * @param {!string} method HTTP method.
 * @param {!string} contentType HTTP content type.
 * @param {string} jsonObjSend JavaScript object to be parsed into JSON to send.
 * @param {!function} cb Request callback function, takes a single input for a
 *     parsed JSON object.
 */
watchXBlocksServer.sendRequest = function (
    url, method, contentType, jsonObjSend, cb) {
    var request = watchXBlocksServer.createRequest();

    // The data received is JSON, so it needs to be converted into the right
    // format to be displayed in the page.
    var onReady = function () {
        if (request.readyState == 4) {
            if (request.status == 200) {
                var jsonObjReceived = null;
                try {
                    jsonObjReceived = JSON.parse(request.responseText);
                } catch (e) {
                    console.error('Incorrectly formatted JSON data from ' + url);
                    throw e;
                }
                cb(jsonObjReceived);
            } else {
                // return a null element which will be dealt with in the front end
                cb(null);
            }
        }
    };

    try {
        request.open(method, url, true);
        request.setRequestHeader('Content-type', contentType);
        request.onreadystatechange = onReady;
        request.send(JSON.stringify(jsonObjSend));
    } catch (e) {
        // Nullify callback to indicate error
        cb(null);
        throw e;
    }
};

/** @return {XMLHttpRequest} An XML HTTP Request multi-browser compatible. */
watchXBlocksServer.createRequest = function () {
    var request = null;
    try {
        // Firefox, Chrome, IE7+, Opera, Safari
        request = new XMLHttpRequest();
    } catch (e) {
        // IE6 and earlier
        try {
            request = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            try {
                request = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {
                throw 'Your browser does not support AJAX. You will not be able to use all of watchX Blocks features.';
                request = null;
            }
        }
    }
    return request;
};

/**
 * Creates an HTML element based on the JSON data received from the server.
 * @param {!string} json_data A string containing the JSON data to be parsed.
 * @return {!element} An HTML element, which type depends on the JSON 'element'
 *                    key (currently only text input or drop down).
 */
watchXBlocksServer.jsonToIdeModal = function (jsonObj) {
    if (!jsonObj) return null;

    var elTitle = document.createElement('h4');
    elTitle.className = (jsonObj && jsonObj.success) ? 'arduino_dialog_success' : 'arduino_dialog_failure';
    var elStdOp = document.createElement('span');
    elStdOp.className = 'arduino_dialog_out';
    var elErrOp = document.createElement('span');
    elErrOp.className = 'arduino_dialog_out_error';

    // Add the Standard and Error outputs
    var ideData = jsonObj.ide_data;
    if (ideData && (ideData.std_output !== undefined) &&
        (ideData.err_output !== undefined)) {
        elStdOp.innerHTML = ideData.std_output.split('\n').join('<br />');
        elErrOp.innerHTML = ideData.err_output.split('\n').join('<br />');
    } else {
        // console.error(jsonObj);
        console.warn('The IDE out JSON response does not have valid "ide_data".');
    }
    if (jsonObj.errors) {
        // Prepare error message
        elTitle.innerHTML = watchXBlocks.getLocalStr('arduinoOpErrorTitle');
        var errStr = [];
        for (var i = 0; i < jsonObj.errors.length; i++) {
            var errorContext = 'Unrecognised error.';
            try {
                errorContext = watchXBlocks.getLocalStr('arduinoOpErrorIdContext_' + jsonObj.errors[i].id);
            } catch (e) {
                // Swallow the exception, could be expanded to try to figure out issue
            }
            errStr.push('\nError id ' + jsonObj.errors[i].id + ': ' + errorContext);
        }
        elErrOp.innerHTML += '<br />' + errStr.join('<br />');
    } else if (jsonObj.success && jsonObj.ide_mode) {
        // Format a successful response
        if (jsonObj.ide_mode == 'upload') {
            elTitle.innerHTML = watchXBlocks.getLocalStr('arduinoOpUploadedTitle');
        } else if (jsonObj.ide_mode == 'verify') {
            elTitle.innerHTML = watchXBlocks.getLocalStr('arduinoOpVerifiedTitle');
        } else {
            elTitle.innerHTML = watchXBlocks.getLocalStr('arduinoOpErrorTitle');
        }
    } else {
        // console.error(jsonObj);
        console.warn('Unexpected response format, printed above.');
    }

    var element = document.createElement('div');
    element.appendChild(elTitle);
    element.appendChild(elStdOp);
    element.appendChild(elErrOp);
    return element;
};

watchXBlocksServer.jsonToHtmlTextInput = function (jsonObj) {
    var element = null;
    if (jsonObj) {
        // Simple text input
        element = document.createElement('input');
        element.setAttribute('type', 'text');
        element.style.cssText = '';
        if (jsonObj.errors) {
            element.setAttribute('value', '');
            element.style.cssText = [
                'border-bottom: 1px solid #f75c51;',
                'box-shadow: 0 1px 0 0 #d73c30;'
            ].join('\n');
        } else {
            element.setAttribute('value', jsonObj.selected || '');
        }
    }
    return element;
};

watchXBlocksServer.jsonToHtmlDropdown = function (jsonObj) {
    var element = null;
    if (!jsonObj) {
        console.error('Invalid JSON received from server.');
    } else if (jsonObj.errors) {
        console.error('There are errors in the JSON response from server.');
        console.error(jsonObj);
    } else {
        // Drop down list of unknown length with a selected item
        element = document.createElement('select');
        element.name = jsonObj.settings_type;
        for (var i = 0; i < jsonObj.options.length; i++) {
            if (jsonObj.options[i].value && jsonObj.options[i].display_text) {
                var option = document.createElement('option');
                option.value = jsonObj.options[i].value;
                option.text = jsonObj.options[i].display_text;
                // Check selected option and mark it
                if (jsonObj.selected) {
                    option.selected = jsonObj.options[i].value == jsonObj.selected;
                }
                element.appendChild(option);
            } else {
                console.error('Missing required JSON keys for Drop Down conversion.');
            }
        }
    }
    return element;
};

/**
 * Gets the current Compiler location from the watchXBlocksServer settings.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.requestCompilerLocation = function (callback) {
    watchXBlocksServer.getJson('/settings/compiler', callback);
};

/**
 * Sends a string to the Ardublockly Server for a the Arduino IDE executable
 * path.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.setCompilerLocation = function (new_path, callback) {
    watchXBlocksServer.putJson('/settings/compiler', {"new_value": new_path}, callback);
};

/**
 * Gets the current Sketch location from the Ardublockly Server settings.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.requestSketchLocation = function (callback) {
    watchXBlocksServer.getJson('/settings/sketch', callback);
};

/**
 * Sends a string to the Ardublockly Server for a the Arduino sketch folder.
 * @param {!string} new_path New Sketch location path..
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.setSketchLocation = function (new_path, callback) {
    watchXBlocksServer.putJson('/settings/sketch', {"new_value": new_path}, callback);
};

/**
 * Request to the Ardublockly Server to return JSON data containing all
 * available target Arduino Boards, and the selected one in the settings.
 * The data is then processed into an HTML element and sent to the callback
 * function as an argument.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.requestArduinoBoards = function (callback) {
    watchXBlocksServer.getJson('/settings/board', callback);
};

/**
 * Sends the inputted Arduino Board type to the Ardublockly Server Settings.
 * The new settings menu for the Board type is then processed into an HTML
 * element and sent to the callback function as an argument.
 * @param {!string} new_board Indicates which board has been selected.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.setArduinoBoard = function (new_board, callback) {
    watchXBlocksServer.putJson('/settings/board', {"new_value": new_board}, callback);
};

/**
 * Request to the Ardublockly Server to return JSON data containing all
 * available serial ports in the computer, and the selected one in the
 * settings. The data is then processed into an HTML element and sent to the
 * callback function as an argument.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.requestSerialPorts = function (callback) {
    watchXBlocksServer.getJson('/settings/serial', callback);
};

/**
 * Sends the inputted Serial Port to the Ardublockly Server Settings. The new
 * settings menu for the Serial Port is then processed into an HTML element
 * and sent to the callback function as an argument.
 * @param {!string} new_port Indicates which port has been selected.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.setSerialPort = function (new_port, callback) {
    watchXBlocksServer.putJson('/settings/serial', {"new_value": new_port}, callback);
};

/**
 * Gets the current IDE setting from the Ardublockly Server settings. The new
 * settings menu for the IDE options is then processed into an HTML element
 * and sent to the callback function as an argument.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.requestIdeOptions = function (callback) {
    watchXBlocksServer.getJson('/settings/ide', callback);
};

/**
 * Sends the inputted IDE option to the Ardublockly Server Settings. The new
 * settings menu for the IDE options is then processed into an HTML element
 * and sent to the callback function as an argument.
 * @param {!string} ide_option Indicates which option has been selected.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.setIdeOptions = function (ide_option, callback) {
    watchXBlocksServer.putJson('/settings/ide', {"new_value": ide_option}, callback);
};


/**
 * Sends the Arduino code to the watchXBlocksServer to be processed as defined
 * by the settings.
 * @param {!string} code Arduino code in a single string format.
 * @param {!function} callback Callback function for the server request, must
 *     have one argument to receive the JSON response.
 */
watchXBlocksServer.sendSketchToServer = function (code, action, callback) {
    watchXBlocksServer.sendRequest('/code', 'POST', 'application/json', {"sketch_code": code, "action": action }, callback);
};
