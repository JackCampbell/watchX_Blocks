/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Front end code relevant only to the Desktop version of
 *                watchXBlocks.
 */
//'use strict';
var electron = require('electron');
window.Hammer = require("./js_libs/hammer.min.js");
window.JsDiff = require('./js_libs/diff.js');
// window.$ = window.jQuery = require('./js_libs/jquery-2.1.3.min.js');

/** Create a namespace for the application. */
var watchXBlocks = watchXBlocks || {};

// watchXBlocks.app_version = electron.remote.app.getVersion();

watchXBlocks.bindClickEx = function (el, func) {
	if (typeof el == 'string') {
		el = document.getElementById(el);
	}
	// Need to ensure both, touch and click, events don't fire for the same thing
	var propagateOnce = function (e) {
		e.stopPropagation();
		e.preventDefault();
		func();
	};
	el.addEventListener('ontouchend', propagateOnce);
	el.addEventListener('click', propagateOnce);
};

/**
 * Checks if the current JavaScript is loaded in the rendered process of
 * Electron. Works even if the node integration is turned off.
 * @return {!boolean} True if watchXBlocks running in Electron application
 */
watchXBlocks.isRunningElectron = function() {
	return navigator.userAgent.toLowerCase().indexOf('electron') != -1;
};
/**
 * Because the Node integration causes conflicts with the way JavaScript
 * libraries are declared as modules, this declares them in the window context.
 * This function is to be executed as soon as this file is loaded, and because
 * of that this file must be called in the HTML before the Materialize library
 * is loaded.
 */
function loadJsInElectron() { // no call
	// if(watchXBlocks.isRunningElectron())
	{
		var projectLocator = require('electron').remote.require('./projectlocator.js');
		var projectRoot = projectLocator.getServerPath();
		window.$ = window.jQuery = require(projectRoot + '/watchx/js_libs/jquery-2.1.3.min.js');
		window.Hammer = require(projectRoot + '/watchx/js_libs/hammer.min.js');
		window.JsDiff = require(projectRoot + '/watchx/js_libs/diff.js');
	}
}

/** Sets all the elements using the container class to have a width of 100%. */
watchXBlocks.containerFullWidth = function() {
	var containers = $('.container');
	for(var i = 0; i < containers.length; i++) {
		containers[i].style.width = '100%';
	}
};

/** Hides the side menu button. */
watchXBlocks.hideSideMenuButton = function() {
	var sideMenuButton = document.getElementById('button-collapse');
	sideMenuButton.style.setProperty('display', 'none', 'important');
};

/**
 * Launches a materialize modal as a text prompt
 * @param {string} message Main text message for the window prompt.
 * @param {string=} defaultValue Input string to be displayed by default.
 * @param {function} callback To process the user input.
 */
watchXBlocks.htmlPrompt = function(message, defaultValue, callback) {
	$('#gen_prompt_message').text('');
	$('#gen_prompt_message').append(message);
	$('#gen_prompt_input').val(defaultValue);
	// Bind callback events to buttons
	$('#gen_prompt_ok_link').bind('click', function() {
		callback($('#gen_prompt_input').val());
	});
	$('#gen_prompt_cancel_link').bind('click', function() {
		callback(null);
	});
	$('#gen_prompt').openModal();
	window.location.hash = '';
};

/**
 * Add click listeners to the Compiler and Sketch input fields to launch the
 * Electron file/folder browsers.
 */
watchXBlocks.bindSettingsPathInputs = function() {
	var dialog = require('electron').remote.dialog;

	// Compiler path
	var compilerEl = document.getElementById('settings_compiler_location');
	compilerEl.readOnly = true;
	watchXBlocks.bindClickEx(compilerEl, function() {
		var files = dialog.showOpenDialogSync(null, {
			title: 'Select the arduini-cli executable',
			buttonLabel: 'Select',
			properties: ['openFile']
		});
		if(files == undefined) {
			return;
		}
		watchXBlocksServer.setCompilerLocation(files[0], function(jsonObj) {
			//watchXBlocks.setCompilerLocationHtml(watchXBlocksServer.jsonToHtmlTextInput(jsonObj));
			var newEl = watchXBlocksServer.jsonToHtmlTextInput(jsonObj);
			compilerEl.value = newEl.value;
			compilerEl.style.cssText = newEl.style.cssText;
		});
	});
	// Sketch path
	var sketchEl = document.getElementById('settings_sketch_location');
	sketchEl.readOnly = true;
	watchXBlocks.bindClickEx(sketchEl, function() {
		var folders = dialog.showOpenDialogSync(null, {
			title: 'Select the sketch folder',
			buttonLabel: 'Select',
			properties: ['openDirectory']
		});
		if(folders == undefined) {
			return;
		}
		watchXBlocksServer.setSketchLocation(folders[0], function(jsonObj) {
			//watchXBlocks.setSketchLocationHtml(watchXBlocksServer.jsonToHtmlTextInput(jsonObj));
			var newEl = watchXBlocksServer.jsonToHtmlTextInput(jsonObj);
			sketchEl.value = newEl.value;
			sketchEl.style.cssText = newEl.style.cssText;
		});
	});
};

/** Wraps the console.log warn and errors to send data to logging file. */
watchXBlocks.redirectConsoleLogging = function() {
	var winston = require('electron').remote.require('winston');
	var consoleLog = console.log;
	var consoleWarning = console.warning;
	var consoleError = console.error;

	// This is magic from Stack Overflow
	// http://stackoverflow.com/questions/14172455/get-name-and-line-of-calling-function-in-node-js
	Object.defineProperty(global, '__stack', {
		get: function() {
			var orig = Error.prepareStackTrace;
			Error.prepareStackTrace = function(_, stack) {
				return stack;
			};
			var err = new Error;
			Error.captureStackTrace(err, arguments.callee);
			var stack = err.stack;
			Error.prepareStackTrace = orig;
			return stack;
		}
	});
	Object.defineProperty(global, '__stackfilename', {
		get: function() {
			return __stack[2].getFileName();
		}
	});
	Object.defineProperty(global, '__line', {
		get: function() {
			return __stack[2].getLineNumber();
		}
	});
	Object.defineProperty(global, '__function', {
		get: function() {
			return __stack[2].getFunctionName();
		}
	});

	// Wrapping console logging
	console.log = function(logMessage) {
		consoleLog.apply(console, arguments);
		var tagRenderer = '[Renderer "' + __stackfilename + ':' + __function +
			'():L' + __line + '"] ';
		winston.info(tagRenderer + logMessage);
	};
	console.warning = function(warnMessage) {
		consoleWarning.apply(console, arguments);
		var tagRenderer = '[Renderer "' + __stackfilename + ':' + __function +
			'():L' + __line + '"] ';
		winston.warn(tagRenderer + warnMessage);
	};
	console.error = function(errMessage) {
		consoleError.apply(console, arguments);
		var tagRenderer = '[Renderer "' + __stackfilename + ':' + __function +
			'():L' + __line + '"] ';
		winston.error(tagRenderer + errMessage);
	};
};

/** Initialize watchXBlocks code required for Electron on page load. */
window.addEventListener('load', function load(event) {
	// window.removeEventListener('load', load, false);
	// if(watchXBlocks.isRunningElectron())
	{
		// Edit the page layout for better appearance on desktop
		watchXBlocks.containerFullWidth();
		// watchXBlocks.hideSideMenuButton();

		// Open the file or directory browsers when clicking on the Settings inputs
		watchXBlocks.bindSettingsPathInputs();

		// Prevent browser zoom changes like pinch-to-zoom
		var webFrame = require('electron').webFrame;
		webFrame.setVisualZoomLevelLimits(1, 1);

		watchXBlocks.redirectConsoleLogging();

		// Electron does not offer a prompt, so replace Blocks version with modal
		// Original signature: function(message, opt_defaultInput, opt_callback)
		Blockly.prompt = watchXBlocks.htmlPrompt;
	}
});
