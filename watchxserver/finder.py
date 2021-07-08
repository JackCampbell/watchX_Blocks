import os
import re
import sys
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
