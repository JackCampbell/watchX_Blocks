import os
import re
import sys
import subprocess
import platform


def find_watchx_dir(search_path):
    """Find the watchX project directory absolute path.

    Navigates within each node of given path and tries to find the Ardublockly
    project root directory. Assumes that the project root will have an folder
    name ardublockly with an index.html file inside.
    This function is required because this script can end up in executable form
    in different locations of the project folder depending on the platform.

    :param search_path: Path starting point to search the Ardublockly project
            root folder.
    :return: Path to the watchX root folder. If not found returns None.
    """
    path_to_navigate = os.path.normpath(search_path)
    # Navigate through each path node from the bottom up
    while path_to_navigate:
        # Check if file watchx/index.html exists within current path
        if os.path.isfile(os.path.join(path_to_navigate, 'watchx', 'index.html')):
            # Found the right folder
            return path_to_navigate
        path_to_navigate = os.path.dirname(path_to_navigate)
    # The right folder wasn't found, so return None to indicate failure
    return None


def get_arduino_cli_path():
    watch_dir = find_watchx_dir(__file__)
    if watch_dir is None:
        return None
    if sys.platform == "darwin" or sys.platform == "linux":
        absolute_path = os.path.join( watch_dir, "arduino-cli", "arduino-cli" )
        return check_filepath(absolute_path, False)
    elif sys.platform == "win32":
        absolute_path = os.path.join( watch_dir, "arduino-cli", "arduino-cli.exe" )
        return check_filepath(absolute_path, False)
    else:
        return None
    pass


def check_filepath(absolute_path, is_dir):
    if os.path.exists(absolute_path) is False:
        return None
    if is_dir is True and os.path.isdir(absolute_path) is False:
        return None
    if is_dir is False and os.path.isfile(absolute_path) is False:
        return None
    return absolute_path


def get_cpp_include_path():
    watch_dir = find_watchx_dir(__file__)
    if watch_dir is None:
        return None
    absolute_path = os.path.join(watch_dir, "include")
    return check_filepath(absolute_path, True)



def run_process(cli_command):
    print('PROCESS: %s' % ' '.join(cli_command))
    process = subprocess.Popen(cli_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=False)
    exit_code = process.returncode
    std_out, err_out = process.communicate()
    return exit_code, std_out, err_out


def arduino_cli_board_setup():
    compile_dir = get_arduino_cli_path()
    print("Arduino-cli board setup")
    # Check if CLI flags have been set
    if not compile_dir:
        print('Compiler directory not configured in the Settings.')
        return
    cli_command = [compile_dir, "core", "install", "arduino:avr"]
    exit_code, std_out, err_out = run_process(cli_command)
    print('Arduino-cli STDOUT:\n%s' % std_out.decode("utf-8").strip())
    print('Arduino-cli STDERR:\n%s' % err_out.decode("utf-8").strip())
    print('Arduino-cli Exit code: %s' % exit_code)
    return exit_code



def find_serial_port(fqbn):
    if not fqbn:
        fqbn = "arduino:avr:leonardo"
    serial_ports = []
    compile_dir = get_arduino_cli_path()
    print("Arduino-cli board setup")
    # Check if CLI flags have been set
    if not compile_dir:
        print('Compiler directory not configured in the Settings.')
        return serial_ports
    cli_command = [compile_dir, "board", "list"]

    exit_code, std_out, err_out = run_process(cli_command)
    if exit_code is not None:
        return serial_ports
    suggest = std_out.decode("utf-8").split('\n')
    for str in suggest:
        if str.find(fqbn) != -1:
            name = str.split(' ')[0]
            serial_ports.append(name)
        pass
    return serial_ports
