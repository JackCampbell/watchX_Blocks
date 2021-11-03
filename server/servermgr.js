/**
 * @author    carlosperate
 * @copyright 2015 carlosperate https://github.com/carlosperate
 * @license   Licensed under the The MIT License (MIT), a copy can be found in
 *            the electron project directory LICENSE file.
 *
 * @fileoverview Manages the Ardublockly server.
 */
const winston = require('winston');
// const childProcess = require('child_process');
const express = require('express');
const projectLocator = require('./projectlocator.js');
const config = require("./cfgconst");
const helper = require("./cfghelper");
const { dialog, BrowserWindow, app: capp } = require('electron');
const fs = require("fs");
const path = require("path");
const electron = require("electron");
const {download_core} = require("./cfghelper");

const event_manager = require("./eventmgr.js");


const tagMgr = '[watchXMgr] ';
const tagSrv = '[watchXSvr] ';

const server_path = projectLocator.getServerPath();

const app = express();
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-cache');
	//- res.set("X-Frame-Options", "Allow-From http://localhost:8000")
	//winston.info(tagSrv + 'Request.:[' + req.method + '] ' + req.url);
	return next();
});
app.use("/watchx", express.static(server_path + "/client"));
app.use("/blockly", express.static(server_path + "/blockly"));
app.use("/blocks", express.static(server_path + "/blocks"));
app.use("/examples", express.static(server_path + "/resources/examples"));
app.use("/closure-library", express.static(server_path + "/closure-library"));
app.use("/docs", express.static(server_path + "/resources/dictionary"));
app.get(["/", "/watchx"], (req, res, next) => {
	return res.redirect("/watchx/index.html");
});
app.use((req, res, next) => {
	return res.status(405).send('Not Allowed, code can only be sent: ' + req.url);
});
app.use((error, req, res, next) => {
	return res.status(500).send(error.message);
});

var cprocess = null;
var server = null;
module.exports.startServer = function(port, callback) {
	if(server !== null) {
		return;
	}
	server = app.listen(port, () =>  {
		winston.info(tagMgr + 'Path: ' + server_path + ' listening server on port 8000');
		if(callback) {
			callback(port);
		}
	});
}
module.exports.stopServer = function() {
	if (server !== null) {
		event_manager.kill_compiler_process();

		// Server executable needs to clean up (kill child), so no SIGKILL
		server.close();
		server = null;
		winston.info(tagMgr + 'Server stopped.');
	}
};
module.exports.restartServer = function() {
    module.exports.stopServer();
    setTimeout(function() {
        module.exports.startServer();
    }, 1000);
};
