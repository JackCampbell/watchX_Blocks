# **CHANGELOG**

All notable changes to this project will be documented in this file.

**Types of changes**

* **Added** for new features.
* **Changed** for changes in existing functionality.
* **Deprecated** for soon-to-be removed features.
* **Removed** for now removed features.
* **Fixed** for any bug fixes.
* **Security** in case of vulnerabilities.

## [1.0.1522] - Unreleased - 05.11.2021

### Added

 * A new file icon has been added. From now on, .wxb files will have their own icons.
 * The .wxb format files open with watchX Blocks by default.
 * Download bar and information have been added to the splash screen.
 * Internet connection check and error message has been added to the splash screen.
 * Lag on the settings menu has been reduced and a "checking settings" message has been added while searching for the ports.
 * New notifications are added like "saved" and etc...
 * A file check function has been added, this function checks the installed files and downloads them again if any is missing.

### Changed

 * The notification location has been updated.
 * Some changes are made to the "about" section.
 * The whole startup and running sequence have been updated.
 * Arduino CLI has been updated in a way that it is downloaded and installed from outside resources in the first run.
 * The splash screen has been centered.
 * watchX Blocks runs full screen on every start.

### Fixed

 * Fixed the error of side menu sticking when the user selects the "learning center".
 * IPC main and IPC renderer thread communications have been fixed.
 * Fixed the error of opening a sketch in the Windows.

## [0.9.0.955] - Unreleased - 06.10.2021

### Added

  * New game upload menu has been added
  * New games has been added (*more info about the games can be found in the resources/games folder*)
    * Arduboy3D
    * ArduBreakout
    * ArduMan
    * ArduSnake
    * Chie Magari Ita
    * Flappy Ball
    * Hollow Seeker
    * Hopper
    * Knight Move
    * Lasers
    * Mirco Tank
    * MicroCity
    * Mystic Balloon
    * Picovaders
    * Shadow Runner
    * Squario
    * Stellar Impact

## [0.9.0.867] - Unreleased - 04.10.2021

### Added

  * New logo has been designed for watchX Blocks
  * New splash screen has been added
  * New coding blocks has been added for watchX support
    * Display category
    * Draw category
    * Sensors category
    * Battery category
    * USB category
    * Sleep category
    * Bluetooth category
  * Arduino libraries for watchX support has been added
  * Arduino CLI has been embedded for ease of use
  * Automatic Arduino CLI directory finding ability has been added
  * Automatic USB port finding ability has been added
  * watchX Board support has been added
  * Express server support added for better compatibility
  * Builder methods have been added for Windows, Mac and Linux packaging
  * Automatic build number generator has been added
  * Automatic server update script has been added
  * New code examples added for watchX
    * Blink
    * Hello World
    * Button Counter
    * Drawing Lines
    * Sensor - Movement
    * Sensor - Temperature & Pressure
    * Move the Dot
    * Siren
    * Watch Face
    * Bounce
  * New watch face firmware added
    * Tap Clock
    * Word Clock
    * Pacman
    * Pong
    * Tetris
    * Nwatch
  * New dialog menu for examples has been added
  * New dialog menu for watch faces has been added
  * New file format .wxb (watchX Blocks) has been introduced
  * Dictionary of watchX Blocks has been added
  * Direct link to watchX Learning Management System has been added
  * Direct link to watchX Community has been added
  * New "about" dialog has been added

### Changed

  * Visual improvements have been made
  * Side-scrolling menu has been redesigned
  * Coding workspace settings have been changed (added snap and etc...)
  * Font has been changed (Mulish)
  * README file on GitHub has been changed

### Removed

* Python server has been removed
* Open in Arduino IDE option has been removed
* Default IDE button setting from the settings menu has been removed
* Other language support has been removed. More languages are coming soon.

### Fixed

* New code button has been fixed
* Save dialogues has been fixed
* Rename variable error has been fixed
* Main window, electron loading bug has been fixed
* File and directory system has been fixed
* Page reload problem on windows has been fixed
* Math trigonometric functions, Rad - Degree problem has been fixed
* Math prime number problem has been fixed
* Math Pi number has been fixed
* Math floating number error has been fixed

### Security

* Electron security problem has been solved
