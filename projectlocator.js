/**
 * @author    carlosperate
 * @copyright 2015 carlosperate https://github.com/carlosperate
 * @license   Licensed under the The MIT License (MIT), a copy can be found in
 *            the electron project directory LICENSE file.
 *
 * @fileoverview Finds the Ardublockly Project directory and files.
 */
const jetpack = require('fs-jetpack');
const os = require('os');
// Name of the folder containing the electron executable, needs to be synced
// with the name set in the Python server and Electron build files.
const execFolderName = 'cache';
const serverExecFolderName = 'server';
const serverExecName = 'start';

const tag = '[ProjectLocator] ';

var projectWatchXRootDir = null;

function ProjectNotFound(working_dir) {
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

function find_criteria(relative, callback) {
    var root_dir = jetpack.dir(__dirname);
    var last_dir = '';
    while( root_dir.path() != last_dir ) {
        var criteria = jetpack.exists( root_dir.path(relative) );
        if(criteria) {
            break;
        }
        last_dir = root_dir.path();
        root_dir = root_dir.dir("../");
    }
    if( root_dir.path() == last_dir ) {
        root_dir = jetpack.dir(".");
        if(callback) {
            callback( root_dir.path(".") );
        }
    }
    return root_dir;
}

function find_criteria_nullable(relative) {
    var root_dir = jetpack.dir(__dirname);
    var last_dir = '';
    while( root_dir.path() != last_dir ) {
        var criteria = jetpack.exists( root_dir.path(relative) );
        if(criteria) {
            break;
        }
        last_dir = root_dir.path();
        root_dir = root_dir.dir("../");
    }
    if( root_dir.path() == last_dir ) {
        return null;
    }
    return root_dir;
}

function getArduinoCliName() {
    if (process.platform == 'win32') {
        return 'arduino-cli.exe';
    }
    return "arduino-cli";
}

function getHostArch() {
    // 'arm', 'arm64', 'ia32', 'mips','mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', 'x64'
    var arch = process.arch;
    if(arch == 'ia32') {
        arch = 'x32';
    }
    if(arch == 'amd64') {
        arch = 'x64';
    }
    return arch;
}
function getHostPlatform() {
    // 'aix' 'darwin' 'freebsd' 'linux' 'openbsd' 'sunos' 'win32'
    var platform = process.platform;
    if(platform == 'win32') {
        platform = 'windows';
    }
    return platform;
}

module.exports = {
    getServerJetpack: function() {
        return  find_criteria("watchx/index.html", ProjectNotFound);
    },
    getServerPath: function() {
        return find_criteria("watchx/index.html", ProjectNotFound).path();
    },
    getVacJetPack: function() {
        return find_criteria("watchxblocks.vac", ProjectNotFound);
    },
    getVacPath: function() {
        return find_criteria("watchxblocks.vac", ProjectNotFound).path();
    },
    getIncludeDir: function() {
        var absolute_path = find_criteria_nullable("watchxblocks.vac");
        if(absolute_path == null) {
            return null;
        }
        var include_dir = absolute_path.dir("include");
        if(jetpack.exists( include_dir.path("watchX.h") )) {
            return include_dir.path();
        }
        return null;
    },
    getBuildHexPath: function(filename, temp_dir = null) {
        var absolute_path = find_criteria_nullable("watchxblocks.vac");
        if(absolute_path != null) {
            var build_path = absolute_path.path("hex-data", filename);
            if(jetpack.exists( build_path )) {
                return build_path;
            }
        }
        if(temp_dir != null) {
            var build_path = jetpack.dir(temp_dir, filename);
            if(jetpack.exists( build_path )) {
                return build_path;
            }
        }
        return null;
    },
    getArduinoDir: function() {
        var base_path = find_criteria_nullable("watchxblocks.vac");
        if(base_path == null) {
            return null;
        }
        var criteria = getHostPlatform() + "-" + getHostArch();
        console.log("Find Criterial: " + criteria);
        var filename = getArduinoCliName();

        var relative = base_path.path("arduino-cli", criteria, filename);
        if(jetpack.exists(relative)) {
            return relative;
        }

        var relative = base_path.path(criteria, filename);
        if(jetpack.exists(relative)) {
            return relative;
        }
        ProjectNotFound(relative);
        return null;
    },
    getSketchPath: function() {
        return os.homedir();
    }
}

