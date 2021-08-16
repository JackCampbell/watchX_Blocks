/**
 * @author    carlosperate
 * @copyright 2015 carlosperate https://github.com/carlosperate
 * @license   Licensed under the The MIT License (MIT), a copy can be found in
 *            the electron project directory LICENSE file.
 *
 * @fileoverview Generates the application menu bar.
 */
const { app, Menu, shell, dialog, MenuItem, BrowserWindow } = require("electron");

const server = require('./servermgr.js');

module.exports.setWatchXBlocksMenu = function(devMode = false) {
    var menu = [];
    if (process.platform == 'darwin') {
        menu.push(getMacMenuData());
    }
    menu.push(getFileMenuData());
    menu.push(getEditMenuData());
    menu.push(getProgramMenuData());
    menu.push(getExamplesMenuData());
    if (process.platform == 'darwin') {
        menu.push(getWindowMenuData());
    }
    menu.push(getHelpMenuData());
    if (devMode) {
        menu.push(getDevMenuData());
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
};

var getMacMenuData = function() {
    return {
        label: 'watchXBlocks',
        submenu: [
            {
                label: 'About',
                accelerator: 'F1',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.openAboutUs()');
                }
            }, {
                type: 'separator'
            }, {
                label: 'Preferences',
                accelerator: 'CmdOrCtrl+,',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.openSettings()');
                }
            }, {
                type: 'separator'
            }, {
                label: 'Services',
                submenu: []
            }, {
                type: 'separator'
            }, {
                label: 'Hide watchXBlocks',
                accelerator: 'Command+H',
                selector: 'hide:'
            }, {
                label: 'Hide Others',
                accelerator: 'Command+Shift+H',
                selector: 'hideOtherApplications:'
            }, {
                label: 'Show All',
                selector: 'unhideAllApplications:'
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: function() {
                    app.quit();
                }
            }
        ]
    };
};

var getFileMenuData = function () {
    var fileMenu = {
        label: 'File',
        submenu: [
            {
                label: 'New',
                accelerator: 'CmdOrCtrl+N',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.newSketchFile()', true);
                }
            }, {
                type: 'separator'
            }, {
                label: 'Open',
                accelerator: 'CmdOrCtrl+O',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.openSketchFile()', true);
                }
            }, {
                label: 'Save',
                accelerator: 'CmdOrCtrl+S',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.saveSketchFile()');
                }
            }, {
                label: 'Save As',
                accelerator: 'Shift+CmdOrCtrl+S',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.saveAsSketchFile()');
                }
            }, {
                type: 'separator'
            }, {
                label: 'Export as Arduino Sketch',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.exportArduinoFile()');
                }
            }
        ]
    };

    // On MacOS the Quit option is in the app menu, so only add it if not mac
    if (process.platform != 'darwin') {
        fileMenu.submenu.push(
            {
                type: 'separator'
            }, {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: function () {
                    app.quit();
                }
            }
        );
    }

    return fileMenu;
};

var getEditMenuData = function () {
    var editMenud = {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.workspace.undo(false)');
                }
            }, {
                label: 'Redo',
                accelerator: 'CmdOrCtrl+Y',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.workspace.undo(true)');
                }
            }, {
                type: 'separator'
            }, {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.blocklyCut()');
                }
            }, {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.blocklyCopy()');
                }
            }, {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.blocklyPaste()');
                }
            }, {
                label: 'Delete',
                accelerator: 'Delete',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.blocklyDelete()');
                }
            }, {
                label: 'Delete All',
                accelerator: 'CmdOrCtrl+Delete',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.discardAllBlocks()');
                }
            }
        ]
    };

    // On MacOS Preferences is in the app menu, so only add it if not mac
    if (process.platform != 'darwin') {
        editMenud.submenu.push(
            {
                type: 'separator'
            }, {
                label: 'Preferences',
                accelerator: 'CmdOrCtrl+,',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.openSettings()');
                }
            }
        );
    }

    return editMenud;
};

var getExamplesMenuData = function() {
    return {
        label: 'Examples',
        submenu: [
            {
                label: 'Blink',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/blink.xml");');
                }
            }, {
                label: 'Hello World',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/hello_world.xml");');
                }
            }, {
                label: 'Button Counter',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/button_counter.xml");');
                }
            }, {
                label: 'Drawing Lines',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/drawing_lines.xml");');
                }
            }, {
                label: 'Sensor - Movement',
                click: function() {
                     BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/sensor_read_movement.xml");');
                }
            }, {
                label: 'Sensor - Temp Prs',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/sensor_read_temp_pressure.xml");');
                }
            }, {
                label: 'Move the Dot',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/move_the_dot.xml");');
                }
            }, {
                label: 'Siren',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/siren.xml");');
                }
            }, {
                label: 'Watch Face',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/watch_face.xml");');
                }
            }, {
                label: 'Bounce',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.loadServerXmlFile("../examples/bounce.xml");');
                }
            }
        ]
    };
};

var getProgramMenuData = function() {
    return {
        label: 'Program',
        submenu: [
            {
                label: 'Verify',
                accelerator: 'CmdOrCtrl+R',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.ideSendVerify()');
                }
            }, {
                label: 'Upload program',
                accelerator: 'CmdOrCtrl+U',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.ideSendUpload()');
                }
            }
        ]
    };
};

var getWindowMenuData = function() {
    return {
        label: 'Window',
        submenu: [
            {
                label: 'Minimize',
                accelerator: 'Command+M',
                selector: 'performMiniaturize:'
            }, {
                label: 'Close',
                accelerator: 'Command+W',
                selector: 'performClose:'
           }, {
                type: 'separator'
            }, {
                label: 'Bring All to Front',
                selector: 'arrangeInFront:'
            }
        ]
    };
};

var getHelpMenuData = function() {
    var menu = {
        label: 'Help',
        submenu: [
            /*{
                label: 'Quick Start',
                click: function() {
                    shell.openExternal('http://localhost:8000/docs/Quick-Start');
                }
            }, {
                label: 'Manual',
                click: function() {
                    shell.openExternal('http://localhost:8000/docs/');
                }
            }, {
                type: 'separator'
            }, */{
                label: 'Website',
                click: function() {
                    shell.openExternal('http://watchx.io');
                }
            }, {
                label: 'Source code',
                click: function() {
                    shell.openExternal('https://github.com/JackCampbell/watchX_Blocks');
                }
            }, {
                label: 'Report a bug',
                click: function() {
                    shell.openExternal('https://github.com/JackCampbell/watchX_Blocks/issues');
                }
            }, {
                type: 'separator'
            }
        ]
    };
    if (process.platform != 'darwin') {
        menu.submenu.push({
            label: 'About',
                click: function() {
                // shell.openExternal('http://localhost:8000/docs/About');
                BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.openAboutUs()');
            }
        });
    }
    return menu;
};

var getDevMenuData = function() {
    return {
        label: 'Development',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+F5',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
                }
            }, {
                label: 'Toggle DevTools',
                accelerator: 'F12',
                click: function() {
                    BrowserWindow.getFocusedWindow().toggleDevTools();
                }
            }, {
                type: 'separator'
            }, {
                label: 'Stop server',
                accelerator: 'Shift+CmdOrCtrl+S',
                click: server.stopServer
            }, {
                label: 'Restart server',
                accelerator: 'Shift+CmdOrCtrl+R',
                click: server.restartServer
            }, {
                type: 'separator'
            }, {
                label: 'Open side menu',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('$(".button-collapse").sideNav("show")');
                }
            }, {
                label: 'Open extra blocks menu',
                click: function() {
                    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('watchXBlocks.openExtraCategoriesSelect()');
                }
            }, {
                type: 'separator'
            },  {
                label: 'Test menu item',
                click: testFunction
            }
        ]
    };
};

var functionNotImplemented = function() {
    dialog.showMessageBox({
        type: 'info',
        title: 'Dialog',
        buttons: ['ok',],
        message: 'This functionality has not yet been implemented.'
    });
};

var testFunction = function() {
    // Here you can place any test code you'd like to test on a menu click
    functionNotImplemented();
};
