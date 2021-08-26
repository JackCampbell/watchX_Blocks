/**
 * @author    carlosperate
 * @copyright 2015 carlosperate https://github.com/carlosperate
 * @license   Licensed under the The MIT License (MIT), a copy can be found in
 *            the electron project directory LICENSE file.
 *
 * @fileoverview Electron entry point continues here. Creates windows and
 *               handles system events.
 */
const { app, BrowserWindow, shell } = require('electron');
const appMenu = require('./appmenu.js');
const server = require('./servermgr.js');
const jetpack = require("fs-jetpack");
const nconf = require('nconf');

const projectLocator = require('./projectlocator.js');
const createWindow = require('./helpers/window');

const winston = require('winston');
// const packageData = require('fs-jetpack').cwd( app.getAppPath() ).read('package.json', 'json');
const packageData = require("./package.json");
const path = require("path"); // TEST

const tag = '[watchXElec] ';

// Global reference of the window object must be maintain, or the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var splashWindow = null;


// Set up the app data directory within the watchX root directory
(function setAppData() {
    var projectRootPath = projectLocator.getVacJetPack();
    var logfile = jetpack.dir( app.getPath("logs") ).dir("../watchXBlocks").path("watchxblocks.log");
    var appDataPath = jetpack.dir( app.getPath('appData') );
    var configPath = jetpack.dir( app.getPath("userData") ).path("config.json");

    /*
    app.setPath('appData', appDataPath.path());
    app.setPath('userData', appDataPath.path());
    app.setPath('cache', appDataPath.path('GenCache'));
    app.setPath('userCache', appDataPath.path('AppCache'));
    app.setPath('temp', appDataPath.path('temp'));
    */
    nconf.file({ file: configPath });
    winston.add(winston.transports.File, { json: false, filename: logfile, maxsize: 10485760, maxFiles: 2 });
    winston.info(tag + 'Starting watchXBlocks version: ' + packageData.version);
    winston.info(tag + 'watchXBlocks root dir: ' + projectRootPath.path());
    winston.info(tag + "Logs: " + logfile);
    winston.info(tag + "AppData: " + appDataPath.path());
    winston.info(tag + "Config: " + configPath);
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
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});
// Electron application entry point
app.on('ready', function() {
    /*if (shouldQuit) {
        app.quit();
        return;
    }*/
    createSplashWindow();
    server.startServer(8000, (port) => {
        // Set the download directory to the home folder
        mainWindow.webContents.session.setDownloadPath(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']);
        mainWindow.loadURL('http://localhost:' + port + '/watchx');
        setTimeout(() => {
            mainWindow.webContents.reload();
        }, 350);
    });

    var projectJetPath = projectLocator.getServerJetpack();
    // var imagePath = 'file://' + projectJetPath.path('watchx', 'img', 'watchxblocks_splash.png');
    var preload = projectJetPath.path('watchx', 'watchXBlocks_desktop.js');
    mainWindow = createWindow('main', {
        width: 1200,
        height: 765,
        title: 'watchX Blocks',
        transparent: false,
        backgroundColor: '#EEEEEE',
        frame: true,
        show: false,
        webPreferences: {
            'nodeIntegration': true,
            'webSecurity': true,
            'allowDisplayingInsecureContent': false,
            'allowRunningInsecureContent': false,
            'java': false,
            'webgl': false,
            'webaudio': true,
            'plugins': false,
            'experimentalFeatures': false,
            'experimentalCanvasFeatures': false,
            'overlayScrollbars': true,
            'textAreasAreResizable': false,
            'directWrite': true,
            'preload': preload,
            'contextIsolation': false,
            "enableRemoteModule": true,
        }
    });
    if (process.env.NODE_ENV === "development") {
        appMenu.setWatchXBlocksMenu(true);
    } else {
        appMenu.setWatchXBlocksMenu(false);
    }

    mainWindow.webContents.on('did-fail-load', function(event, errorCode, errorDescription) {
        winston.warn(tag + 'Page failed to load (' + errorCode + '). The server is probably not yet running. Trying again in 200 ms.');
        setTimeout(function() {
            mainWindow.webContents.reload();
        }, 350);
    });

    mainWindow.webContents.on('did-finish-load', function() {
        server.initializeCore((code) => {
            if (splashWindow !== null) {
                splashWindow.close();
                splashWindow = null;
            }
            mainWindow.show();
        });
    });
    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

    mainWindow.on('close', function() {
        mainWindow = null;
    });
});

app.on('window-all-closed', function() {
    server.stopServer();
    app.quit();
});

function createSplashWindow() {
    if (splashWindow === null) {
        var projectJetPath = projectLocator.getServerJetpack();
        // var imagePath = 'file://' + projectJetPath.path('watchx', 'img', 'watchxblocks_splash.png');
        var imagePath = 'file://' + projectJetPath.path('watchx', 'splash.html');

        splashWindow = new BrowserWindow({
            width: 450,
            height: 350,
            frame: false,
            show: true,
            transparent: true,
            images: true,
            center: true,
            alwaysOnTop: true,
            skipTaskbar: true,
            resizable: false,
            useContentSize: true
        });
        splashWindow.loadURL(imagePath);
    }
}

