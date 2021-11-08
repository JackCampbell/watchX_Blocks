/**
 * @author    carlosperate
 * @copyright 2015 carlosperate https://github.com/carlosperate
 * @license   Licensed under the The MIT License (MIT), a copy can be found in
 *            the electron project directory LICENSE file.
 *
 * @fileoverview Electron entry point continues here. Creates windows and
 *               handles system events.
 */
const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron');
const appMenu = require('./server/appmenu.js');
const server = require('./server/servermgr.js');
const startup = require("./server/startupmgr.js");
const jetpack = require("fs-jetpack");
const nconf = require('nconf');

const projectLocator = require('./server/projectlocator.js');
const createWindow = require('./server/window.js');

const winston = require('winston');
const path = require("path");
const fs = require("fs");
const os = require("os");
const config = require("./server/cfgconst");
const helper = require("./server/cfghelper"); // TEST

const tag = '[watchXElec] ';

// Global reference of the window object must be maintain, or the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var splashWindow = null;
var arg_filename = null;


// Set up the app data directory within the watchX root directory
(function setAppData() {
    var projectRootPath = projectLocator.getVacJetPack();
    const user_path = os.homedir();
    const app_name = app.getName();
    if(process.platform == "win32") {
        app.setPath('userData', path.join(user_path, "AppData", "Roaming", app_name));
        app.setPath('userCache', path.join(user_path, "AppData", "Roaming", app_name));
        // app.setPath('appData', path.join(user_path, "AppData", "Roaming"));
        // app.setPath('cache', path.join(user_path, "AppData", "Roaming"));
    } else if(process.platform == "darwin") {
        app.setPath('userData', path.join(user_path, "Library", "Application Support", app_name));
        app.setPath('userCache', path.join(user_path, "Library", "Caches", app_name));
        // app.setPath('appData', path.join(user_path, "Library", "Application Support"));
        // app.setPath('cache', path.join(user_path, "Library", "Caches"));
    }
    app.setPath('temp', os.tmpdir()); // default
    var configPath = path.join( user_path, "Library", "Application Support", app_name, "config.json");
    var logfile = path.join( user_path, "Library", "Application Support", app_name, "watchxblocks.log" )

    nconf.file({ file: configPath });
    winston.add(winston.transports.File, { json: false, filename: logfile, maxsize: 10485760, maxFiles: 2 });
    winston.info(tag + 'Starting watchXBlocks version: ' + app.getVersion());
    winston.info(tag + 'watchXBlocks root dir: ' + projectRootPath.path());
    winston.info(tag + "Logs: " + logfile);
    winston.info(tag + "Config: " + configPath);
    winston.info(tag + "userData: " + app.getPath("userData"));
    winston.info(tag + "userCache: " + app.getPath("userCache"));
    winston.info(tag + "temp: " + app.getPath("temp"));
    // Relevant OS could be win32, linux, darwin
    winston.info(tag + 'OS detected: ' + process.platform + " arch:" + process.arch);
})();

// Ensure this is a single instance application
/*
const shouldQuit = app.makeSingleInstance(function(cmdLine, workingDirectory) {
    // User tried to run a second instance, focus existing window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});
*/
var app_lock = app.requestSingleInstanceLock();
if(!app_lock) {
    app.quit();
    process.exit(0);
}
app.on('second-instance', (event, argv, cwd) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
});
// Electron application entry point
app.on('ready', function() {
    /*if (shouldQuit) {
        app.quit();
        return;
    }*/
    server.startServer(8000, (port) => {
        createSplashWindow(() => {
            startup.initializeCore(observerSplashWindow, (code) => {
                createMainWindow(8000, code);
            });
        });
    });

    if (process.platform.startsWith('win') && process.argv.length >= 2) {
        arg_filename = (process.argv[1]).replaceAll('\\', '/');
    }
});
app.on('will-finish-launching', () => {
    app.on('open-file', (event, path) => {
        arg_filename = path.replaceAll('\\', '/');
        event.preventDefault();
    });
    app.on('open-url', (event, path) => {
        event.preventDefault();
    });
});
app.on('window-all-closed', function() {
    server.stopServer();
    app.quit();
});

function createMainWindow(port, code) {
    var projectJetPath = projectLocator.getServerJetpack();
    mainWindow = createWindow('main', {
        width: 1200,
        height: 765,
        title: 'watchX Blocks',
        transparent: false,
        backgroundColor: '#EEEEEE',
        frame: true,
        show: false,
        webPreferences: {
            "nodeIntegration": true,
            "webSecurity": true,
            "allowDisplayingInsecureContent": false,
            "allowRunningInsecureContent": false,
            "java": false,
            "webgl": false,
            "webaudio": true,
            "plugins": false,
            "experimentalFeatures": false,
            "experimentalCanvasFeatures": false,
            "overlayScrollbars": true,
            "textAreasAreResizable": false,
            "directWrite": true,
            "preload": path.join(__dirname, "client", "watchXBlocks_desktop.js"),
            "contextIsolation": false,
            "enableRemoteModule": true,
            "nativeWindowOpen": true
        }
    });

    mainWindow.on('close', function() {
        mainWindow = null;
    });

    mainWindow.webContents.on("did-fail-load", function(event, errorCode, errorDescription) {
        winston.warn(tag + 'Page failed to load (' + errorCode + '). The server is probably not yet running. Trying again in 200 ms.');
        setTimeout(function() {
            mainWindow.webContents.reload();
        }, 350);
    });

    // mainWindow.webContents.on("did-finish-load", function()
    mainWindow.webContents.on("ready-to-show", function()
    {
        if (splashWindow !== null) {
            splashWindow.close();
            splashWindow = null;
        }
        // mainWindow.focus();
        mainWindow.maximize();
        mainWindow.show();

        if(arg_filename != null) {
            winston.info(tag + " load page " + arg_filename);
            mainWindow.webContents.executeJavaScript(`watchXBlocks.loadSketchFile('${arg_filename}');`);
        }
    });
    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    if (process.env.NODE_ENV === "development") {
        appMenu.setWatchXBlocksMenu(true);
    } else {
        appMenu.setWatchXBlocksMenu(false);
    }
    // Set the download directory to the home folder
    mainWindow.webContents.session.setDownloadPath(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']);
    mainWindow.loadURL('http://localhost:' + port + '/watchx');
}

function createSplashWindow(callback) {
    if (splashWindow !== null) {
        return;
    }
    var projectJetPath = projectLocator.getServerJetpack();
    // var imagePath = 'file://' + projectJetPath.path('watchx', 'img', 'watchxblocks_splash.png');
    var splash_path = 'file://' + projectJetPath.path('client', 'splash.html');
    splashWindow = new BrowserWindow({
        width: 450,
        height: 350,
        frame: false,
        show: false,
        transparent: true,
        images: true,
        center: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        useContentSize: true,
        webPreferences: {
            "nodeIntegration": true,
            "webSecurity": true,
            "allowDisplayingInsecureContent": false,
            "allowRunningInsecureContent": false,
            "java": false,
            "webgl": false,
            "webaudio": true,
            "plugins": false,
            "experimentalFeatures": false,
            "experimentalCanvasFeatures": false,
            "overlayScrollbars": true,
            "textAreasAreResizable": false,
            "directWrite": true,
            "contextIsolation": false,
            "enableRemoteModule": true,
            "nativeWindowOpen": true,
            preload: path.join(__dirname, "client", "watchXBlocks_splash.js")
        }
    });
    splashWindow.webContents.on("ready-to-show", callback);
    splashWindow.loadURL(splash_path);
    splashWindow.show();
}

function observerSplashWindow(message, progress) {
    if(splashWindow == null) {
        return;
    }
    if(progress == null) {
        progress = 100;
    }
    splashWindow.webContents.send("set-progress", { message, progress });
}
