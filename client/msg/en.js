var watchXBlocks = watchXBlocks || {};
watchXBlocks.LOCALISED_TEXT = {
  translationLanguage: "English",
  title: "watchX Blocks",
  blocks: "Blocks",
  /* Menu */
  new: 'New',
  open: "Open",
  save: "Save",
  saveAs: "Save As",
  exportArduinoSketch: "Export as Arduino Sketch",
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
  arduinoOpMainTitle: "Communication Messages",
  arduinoOpWaiting: "Waiting for the IDE output...",
  arduinoOpUploadedTitle: "Successfully Uploaded Sketch",
  arduinoOpVerifiedTitle: "Successfully Verified Sketch",
  arduinoOpProcess: "Upload Successfull",
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
  arduinoOpErrorIdContext_57: "Unexpected server error.",
  arduinoOpErrorIdContext_64: "Unable to parse sent JSON.",
  arduinoOpErrorUnknown: "Unexpected error",
  /* Modals */
  noServerTitle: "watchX Blocks app not running",
  noServerTitleBody: '<p>For all the watchX Blocks features to be enabled, the watchX Blocks desktop application must be running locally on your computer.</p>' +
                     '<p>If you are using an online version you will not be able to configure the settings nor load the blocks code into an Arduino.</p>' +
                     '<p>Installation instruction can be found in the <a target="_blank" href="https://github.com/argeX-official/watchX_Blocks">watchX Blocks repository</a>.</p>' +
                     '<p>If you have watchX Blocks already installed, make sure the application is running correctly.</p>',
  noServerNoLangBody: "If the watchX Blocks application is not running the language cannot be fully changed.",
  addBlocksTitle: "Additional Blocks",
  aboutTitle: 'About',
  aboutHeader: '<h4 id="watchx-blocks-is-a-visual-coding-editor-for-watchx"><strong>watchX Blocks is a visual coding editor<br/>for watchX</strong></h4>',
  aboutBody:
    '<span>Contact: <a target="_blank" href="mainto:info@argex.io">info@argex.io</a></span>\n' +
    '<p>watchX® and argeX® names and logos are trademarks of argeX Inc.<br/>' +
      '<span><a target="_blank" href="http://argex.io">www.argex.io</a></span></p>\n' +
    '<h4 id="credits"><strong>Credits</strong></h4>\n' +
    '<p>This project has been forked directly from Carlos Pereira Atencio\'s <a target="_blank" href="https://github.com/carlosperate/ardublockly">Ardublockly</a><br/>and developed further on by the argeX team.</p>\n' +
    '<h5>argeX team is;</h5>\n' +
      '<p>Battal Fırat ÖZDEMİR<br/> <em>full stack developer</em></p>' +
      '<p>Enes ÇALDIR<br/> <em>logo, branding, UI, blocks dictionary, documentation</em></p>' +
      '<p>Mustafa TÜLÜ<br/> <em>integration of new blocks for watchX</em></p>' +
      '<p>Hande KOÇHAN<br/> <em>AstroBoy drawings</em></p>' +
      '<p>Gökhan SELAMET<br/> <em>test and bug reporting</em></p>' +
    '<h5>List of open-source software used for watchX Blocks;</h5>' +
      '<p>' +
      '<a target="_blank" href="https://github.com/arduino/arduino-cli">Arduino CLI</a> by <a target="_blank" href="https://www.arduino.cc/">Arduino</a> is used under <a target="_blank" href="https://github.com/arduino/arduino-cli/blob/master/LICENSE.txt">GPL V3.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/google/blockly">Blockly</a> by <a target="_blank" href="https://opensource.google/">Google</a> is used under <a target="_blank" href="https://github.com/google/blockly/blob/master/LICENSE">Apache V2.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/google/closure-library">Closure Library</a> by <a target="_blank" href="https://opensource.google/">Google</a> is used under <a target="_blank" href="https://github.com/google/closure-library/blob/master/LICENSE">Apache V2.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/BlocklyDuino/BlocklyDuino">BlocklyDuino</a> by <a target="_blank" href="https://github.com/gasolin">Fred LIN</a> is used under <a target="_blank" href="http://www.apache.org/licenses/LICENSE-2.0">Apache V2.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/carlosperate/ardublockly">Ardublockly</a> by <a target="_blank" href="https://github.com/carlosperate">Carlos Pereira ATENCIO</a> is used under <a target="_blank" href="https://github.com/carlosperate/ardublockly/blob/master/LICENSE">Apache V2.0 License</a><br/>' +
      '<a target="_blank" href="https://github.com/electron/electron">Electron</a> is used under <a target="_blank" href="https://github.com/electron/electron/blob/main/LICENSE">MIT License</a><br/>' +
      '<a target="_blank" href="https://github.com/expressjs/express">Express JS</a> is used under <a target="_blank" href="https://github.com/expressjs/express/blob/master/LICENSE">MIT License</a><br/>' +
      '</p>' +
    '<h4 id="license"><strong>License</strong></h4>\n' +
    '<p>Copyright (C) 2021 <a target="_blank" href="http://argex.io/">argeX Inc.</a></p>\n' +
    '<p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.</p>\n' +
    '<p>The full document can be found in the <a target="_blank" href="https://github.com/argeX-official/watchX_Blocks/blob/master/LICENSE.txt">LICENSE</a> file.</p>\n' +
    '<p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.</p>\n',


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
  uploadingSketch: "Uploading Sketch into watchX ...",
  uploadSketch: "Upload Sketch to the watchX",
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
  version: 'Version',
  source_code: '<a target="_blank" href="https://github.com/argeX-official/watchX_Blocks">source code</a>',
  argex_team: '<h5>argeX Team</h5>',
  watch_faces: 'Watch Faces',
  games: 'Games',
  learning_center: 'Learning Center',
  example_blink: 'Blink',
  example_blink_desc: 'by argeX',
  example_hello_world: 'Hello World',
  example_hello_world_desc: 'by argeX',
  example_button_counter: 'Button Counter',
  example_button_counter_desc: 'by argeX',
  example_drawing_lines: 'Drawing Lines',
  example_drawing_lines_desc: 'by argeX',
  example_sensor_movement: 'Sensor - Movement',
  example_sensor_movement_desc: 'by argeX',
  example_sensor_temp_and_press: 'Sensor - Temp Prs',
  example_sensor_temp_and_press_desc: 'by argeX',
  example_move_the_dot: 'Move the Dot',
  example_move_the_dot_desc: 'by argeX',
  example_siren: 'Siren',
  example_siren_desc: 'by argeX',
  example_watch_face: 'Watch Face',
  example_watch_face_desc: 'by argeX',
  example_bounce: 'Bounce',
  example_bounce_desc: 'by argeX',
  dictionary: 'Dictionary'
};
