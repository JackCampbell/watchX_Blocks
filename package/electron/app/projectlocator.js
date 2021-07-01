/**
 * @author    carlosperate
 * @copyright 2015 carlosperate https://github.com/carlosperate
 * @license   Licensed under the The MIT License (MIT), a copy can be found in
 *            the electron project directory LICENSE file.
 *
 * @fileoverview Finds the Ardublockly Project directory and files.
 */
const jetpack = require('fs-jetpack');

// Name of the folder containing the electron executable, needs to be synced
// with the name set in the Python server and Electron build files.
const execFolderName = 'watchx_exec';
const serverExecFolderName = 'server';
const serverExecName = 'start';
module.exports.watchXBlocksExecFolderName = execFolderName;

const tag = '[ProjectLocator] ';

var projectWatchXRootDir = null;

function ardublocklyNotFound(working_dir) {
    const dialog = require('dialog');
    dialog.showMessageBox({
        type: 'warning',
        title: 'Unable to locate watchXBlockly folder',
        buttons: ['ok'],
        message: 'The watchXBlockly folder could not be found within the execution directory:\n' +
                 '\t' + working_dir + '\n' +
                 'The application will not be able to function properly.'
    });
}

module.exports.getProjectRootJetpack = function() {
    if (projectWatchXRootDir === null) {
        // Cannot use relative paths in build, so let's try to find the
        // ardublockly folder in a node from the executable file path tree
        projectWatchXRootDir = jetpack.dir(__dirname);
        var projectLastWatchXRootDir = '';
        while (projectWatchXRootDir.path() != projectLastWatchXRootDir) {
            // Check if /ardublokly/index.html exists within current path
            if (jetpack.exists(projectWatchXRootDir.path('watchx', 'index.html'))) {
                // Found the right folder, break with this dir loaded
                break;
            }
            projectLastWatchXRootDir = projectWatchXRootDir.path();
            projectWatchXRootDir = projectWatchXRootDir.dir('../');
        }

        if (projectWatchXRootDir.path() == projectLastWatchXRootDir) {
            projectWatchXRootDir = jetpack.dir('.');
            ardublocklyNotFound(projectWatchXRootDir.path('.'));
        }
    }
    return projectWatchXRootDir;
};

module.exports.getProjectRootPath = function() {
    return module.exports.getProjectRootJetpack().path();
};

module.exports.getExecDirJetpack = function() {
    return module.exports.getProjectRootJetpack().cwd(execFolderName);
};

module.exports.getExecDirPath = function() {
    return module.exports.getProjectRootJetpack().path(execFolderName);
};

module.exports.getServerExecDirJetpack = function() {
    return module.exports.getProjectRootJetpack().cwd(execFolderName, serverExecFolderName);
};

module.exports.getServerExecDirPath = function() {
    return module.exports.getProjectRootJetpack().path(execFolderName, serverExecFolderName);
};

module.exports.getServerExecPath = function() {
    var finalServerExecName = serverExecName;
    if (process.platform == 'win32') {
        finalServerExecName += '.exe';
    }
    return module.exports.getServerExecDirJetpack().path(finalServerExecName);
};
