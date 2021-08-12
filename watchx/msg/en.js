var watchXBlocks = watchXBlocks || {};
watchXBlocks.LOCALISED_TEXT = {
  translationLanguage: "English",
  title: "watchXBlocks",
  blocks: "Blocks",
  /* Menu */
  new: 'New',
  open: "Open",
  save: "Save",
  deleteAll: "Delete All",
  settings: "Settings",
  documentation: "Documentation",
  reportBug: "Report Bug",
  examples: "Examples",
  about: 'About',
  /* Settings */
  compilerLocation: "Compiler Location",
  compilerLocationDefault: "Compiler Location unknown",
  sketchFolder: "Sketch Folder",
  sketchFolderDefault: "Sketch Folder unknown",
  arduinoBoard: "Arduino Board",
  arduinoBoardDefault: "Arduino Board unknown",
  comPort: "COM Port",
  comPortDefault: "COM Port unknown",
  defaultIdeButton: "Default IDE Button",
  defaultIdeButtonDefault: "IDE options unknown",
  language: "Language",
  languageDefault: "Language unknown",
  sketchName: "Sketch Name",
  /* Arduino console output */
  arduinoOpMainTitle: "Arduino IDE output",
  arduinoOpWaiting: "Waiting for the IDE output...",
  arduinoOpUploadedTitle: "Successfully Uploaded Sketch",
  arduinoOpVerifiedTitle: "Successfully Verified Sketch",
  arduinoOpOpenedTitle: "Sketch opened in IDE",
  arduinoOpOpenedBody: "The sketch should be loaded in the Arduino IDE.",
  arduinoOpErrorTitle: "There has been an error",
  arduinoOpErrorIdContext_0: "No error.",
  arduinoOpErrorIdContext_1: "Build or Upload failed.",
  arduinoOpErrorIdContext_2: "Sketch not found.",
  arduinoOpErrorIdContext_3: "Invalid command line argument.",
  arduinoOpErrorIdContext_4: "Preference passed to 'get-pref' flag does not exist.",
  arduinoOpErrorIdContext_5: "Not Clear, but Arduino IDE sometimes errors with this.",
  arduinoOpErrorIdContext_50: "Unexpected error code from Arduino IDE",
  arduinoOpErrorIdContext_51: "Could not create sketch file",
  arduinoOpErrorIdContext_52: "Invalid path to internally created sketch file",
  arduinoOpErrorIdContext_53: "Unable to find Arduino IDE<br>" +
                              "The compiler directory has not been set correctly.<br>" +
                              "Please ensure the path is correct in the Settings.",
  arduinoOpErrorIdContext_54: "What should we do with the Sketch?<br>" +
                              "The launch IDE option has not been set.<br>" +
                              "Please select an IDE option in the Settings.",
  arduinoOpErrorIdContext_55: "Serial Port unavailable<br>" +
                              "The Serial Port is not accessible.<br>" +
                              "Please check if the Arduino is correctly connected to the PC and select the Serial Port in the Settings.",
  arduinoOpErrorIdContext_56: "Unknown Arduino Board<br>" +
                              "The Arduino Board has not been set.<br>" +
                              "Please select the appropriate Arduino Board from the settings.",
  arduinoOpErrorIdContext_52: "Unexpected server error.",
  arduinoOpErrorIdContext_64: "Unable to parse sent JSON.",
  arduinoOpErrorUnknown: "Unexpected error",
  /* Modals */
  noServerTitle: "watchX Blocks app not running",
  noServerTitleBody: '<p>For all the watchX Blocks features to be enabled, the watchX Blocks desktop application must be running locally on your computer.</p>' +
                     '<p>If you are using an online version you will not be able to configure the settings nor load the blocks code into an Arduino.</p>' +
                     '<p>Installation instruction can be found in the <a target="_blank" href="https://github.com/JackCampbell/watchX_Blocks">watchX Blocks repository</a>.</p>' +
                     '<p>If you have watchX Blocks already installed, make sure the application is running correctly.</p>',
  noServerNoLangBody: "If the watchX Blocks application is not running the language cannot be fully changed.",
  addBlocksTitle: "Additional Blocks",
  aboutTitle: 'About',
  aboutBody:  '<h5>watchX Blocks is a visual coding editor<br/>for watchX</h5>\n' +
              '<p><i>Copyright (c) 2021 argeX</i></p>\n' +
              '<p>Unless stated otherwise, the source code of this projects is licensed under the Apache License, Version 2.0 (the "License");<br/>you may not use any of the licensed files within this project except in compliance with the License.</p>\n' +
              '<p>The full document can be found in the <a target="_blank" href="https://github.com/JackCampbell/watchX_blocks/blob/master/LICENSE">LICENSE</a> file.</p>\n' +
              '<h5>Credits</h5>\n' +
              '<p>This project has been inspired by <a href="https://github.com/BlocklyDuino/BlocklyDuino">BlocklyDuino</a> and forked directly from <a target="_blank" href="https://github.com/carlosperate/ardublockly">Ardublockly</a> by <a target="_blank" href="https://www.watchx.io/">argeX</a>.<br/><a target="_blank" href="https://developers.google.com/blockly/">Blockly</a> original source is Copyright of Google Inc.</p>\n' +
              '<p><a target="_blank" href="https://github.com/arduino/Arduino">Arduino IDE</a> is used under <a target="_blank" href="https://github.com/arduino/Arduino/blob/master/license.txt">GNU GPL v2.0 and LGPL</a></p>' +
              '<p><a target="_blank" href="https://github.com/JackCampbell/watchX_Blocks">source code</a><br/>Contact: <a target="_blank" href="mailto:info@argex.io">info@argex.io</a></p>',
  close: 'Close',
  /* Alerts */
  loadNewBlocksTitle: "Load new blocks?",
  loadNewBlocksBody: "Loading a new XML file will replace the current blocks from the workspace.<br>" +
                     "Are you sure you want to proceed?",
  discardBlocksTitle: "Delete blocks?",
  discardBlocksBody: "There are %1 blocks on the workspace.<br>" +
                     "Are you sure you want to delete them?",
  invalidXmlTitle: "Invalid XML",
  invalidXmlBody: "The XML file was not successfully parsed into blocks. Please review the XML code and try again.",
  /* Tooltips */
  uploadingSketch: "Uploading Sketch into Arduino...",
  uploadSketch: "Upload Sketch to the Arduino",
  verifyingSketch: "Verifying Sketch...",
  verifySketch: "Verify the Sketch",
  openingSketch: "Opening Sketch in the Arduino IDE...",
  openSketch: "Open Sketch in IDE",
  notImplemented: "Function not yet implemented",
  /* Prompts */
  ok: "OK",
  okay: "Okay",
  cancel: "Cancel",
  return: "Return",
  /* Cards */
  arduinoSourceCode: "Arduino Source Code",
  blocksXml: "Blocks XML",
  /* Toolbox Categories*/
  catLogic: "Logic",
  catLoops: "Loops",
  catMath: "Math",
  catText: "Text",
  catVariables: "Variables",
  catFunctions: "Functions",
  catInputOutput: "Input/Output",
  catTime: "Time",
  catAudio: "Audio",
  catMotors: "Motors",
  catComms: "Comms",
  catDisplay: "Display",
  catDraw: "Draw",
  catSensors: "Sensors",
  catBattery: "Battery",
  catUSB: "USB",
  catSleep: "Sleep",
  catBluetooth: "Bluetooth",
  exampleBlink: 'Blink',
  exampleHelloWorld: 'Hello World',
  exampleButtonCounter: 'Button Counter',
  exampleDrawingLines: 'Drawing Lines',
  exampleSensorMovement: 'Sensor - Movement',
  exampleSensorTempAndPress: 'Sensor - Temp Prs',
  exampleMoveTheDot: 'Move the Dot',
  exampleSiren: 'Siren',
  exampleWatchFace: 'Watch Face',
  exampleBounce: 'Bounce'
};
