/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview JavaScript to configure front end design for watchXBlocks app.
 */
'use strict';

/** Create a namespace for the application. */
var watchXBlocks = watchXBlocks || {};


/** Initialises all the design related JavaScript. */
watchXBlocks.designJsInit = function() {
  watchXBlocks.materializeJsInit();
  watchXBlocks.resizeToggleToolboxBotton();
};

/**
 * Initialises all required components from materialize framework.
 * The be executed on document ready.
 */
watchXBlocks.materializeJsInit = function() {
  // Navigation bar
  $('.button-collapse').sideNav({ menuWidth: 240, activationWidth: 70, edge: 'left' });
  // Drop down menus
  $('.dropdown-button').dropdown({ hover: false });
  // Overlay content panels using modals (android dialogs)
  $('.modal-trigger').leanModal({ dismissible: true, opacity: .5, in_duration: 200, out_duration: 250 });
  // Pop-up tool tips
  $('.tooltipped').tooltip({'delay': 50});
  // Select menus
  $('select').material_select();
};

/** Binds the event listeners relevant to the page design. */
watchXBlocks.bindDesignEventListeners = function() {
  // Resize blockly workspace on window resize
  window.addEventListener( 'resize', watchXBlocks.resizeBlocklyWorkspace, false );
  // Display/hide the XML load button when the XML collapsible header is clicked
  document.getElementById('xml_collapsible_header').addEventListener( 'click', watchXBlocks.buttonLoadXmlCodeDisplay );
  // Toggle the content height on click to the IDE output collapsible header
  document.getElementById('ide_output_collapsible_header').addEventListener( 'click', function() { watchXBlocks.contentHeightToggle(); });
  // Display/hide the additional IDE buttons when mouse over/out of play button
  $('#button_upload').mouseenter(function() { watchXBlocks.showExtraIdeButtons(true); });
  $('#ide_buttons_wrapper').mouseleave(function() { watchXBlocks.showExtraIdeButtons(false); });
};

/**
 * Displays or hides the 'load textarea xml' button based on the state of the
 * collapsible 'xml_collapsible_body'.
 */
watchXBlocks.buttonLoadXmlCodeDisplay = function() {
  var xmlCollapsibleBody = document.getElementById('xml_collapsible_body');
  // Waiting 400 ms to check status due to the animation delay (300 ms)
  setTimeout(function() {
    if (xmlCollapsibleBody.style.display == 'none') {
      $('#button_load_xml').hide();
    } else {
      $('#button_load_xml').fadeIn('slow');
    }
  }, 400);
};


/**
 * Displays or hides the additional Arduino IDE action buttons.
 * Hide/display effects done with CCS3 transitions on visibility and opacity.
 * @param {!boolean} show Indicates if the extra buttons are to be shown.
 */
watchXBlocks.showExtraIdeButtons = function(show) {
  var IdeButtonMiddle = document.getElementById('button_verify');
  if (show) {
    // prevent previously set time-out to hide buttons while trying to show them
    clearTimeout(watchXBlocks.outHoldtimeoutHandle);
    clearTimeout(watchXBlocks.hidetimeoutHandle);
    IdeButtonMiddle.style.visibility = 'visible';
    IdeButtonMiddle.style.opacity = '1';
  } else {
    // As the mouse out can be accidental, only hide them after a delay
    watchXBlocks.outHoldtimeoutHandle = setTimeout(function() {
      // Prevent show time-out to affect the hiding of the buttons
      clearTimeout(watchXBlocks.showtimeoutHandle);
      IdeButtonMiddle.style.visibility = 'hidden';
      IdeButtonMiddle.style.opacity = '0';
    }, 200);
  }
};

/**
 * Shows or hides the spinner around the large IDE button.
 * @param {!boolean} active True turns ON the spinner, false OFF.
 */
watchXBlocks.largeIdeButtonSpinner = function(active) {
    var spinner = document.getElementById("button_ide_large_spinner");
    var buttonIdeLarge = document.getElementById('button_upload');
    var buttonClass = buttonIdeLarge.className;
    if (active) {
        spinner.style.display = 'block';
        buttonIdeLarge.className = buttonIdeLarge.className + ' grey';
    } else {
        spinner.style.display = 'none';
        buttonIdeLarge.className = buttonClass.replace(' grey', '');
    }
};

/**
 * Sets the toolbox HTML element to be display or not and change the visibility
 * button to reflect the new state.
 * When the toolbox is visible it should display the "visibility-off" icon with
 * no background, and the opposite when toolbox is hidden.
 * @param {!boolean} show Indicates if the toolbox should be set visible.
 */
watchXBlocks.displayToolbox = function(show) {
  var toolbox = $('.blocklyToolboxDiv');
  var toolboxTree = $('.blocklyTreeRoot');
  var button = document.getElementById('button_toggle_toolbox');
  var buttonIcon = document.getElementById('button_toggle_toolbox_icon');

  // Because firing multiple clicks can confuse the animation, create an overlay
  // element to stop clicks (due to the materialize framework controlling the
  // event listeners is better to do it this way for easy framework update).
  var elLocation = $('#button_toggle_toolbox').offset();
  jQuery('<div/>', {
      id: 'toolboxButtonScreen',
      css: {
        position: 'fixed',
        top: elLocation.top,
        left: elLocation.left,
        height: $('#button_toggle_toolbox').height(),
        width: $('#button_toggle_toolbox').width(),
        cursor: 'pointer',
        zIndex: 12
      }
  }).appendTo('body');

  var classOn = 'button_toggle_toolbox_on';
  var classOff = 'button_toggle_toolbox_off';
  var visOn = 'mdi-action-visibility';
  var visOff = 'mdi-action-visibility-off';
  if (show) {
    toolbox.show();
    button.className = button.className.replace(classOn, classOff);
    buttonIcon.className = buttonIcon.className.replace(visOn, visOff);
    toolbox.animate({
        height: document.getElementById('content_blocks').style.height
      }, 300, function() {
        toolboxTree.css('overflow-y', 'auto');
        window.dispatchEvent(new Event('resize'));
        $('#toolboxButtonScreen').remove();
      });
  } else {
    toolboxTree.css('overflow-y', 'hidden');
    buttonIcon.className = buttonIcon.className.replace(visOff, visOn);
    toolbox.animate({height: 38}, 300, function() {
      button.className = button.className.replace(classOff, classOn);
      toolbox.fadeOut(350, 'linear', function() {
        window.dispatchEvent(new Event('resize'));
        setTimeout(function() { toolbox.height(38); }, 100);
        $('#toolboxButtonScreen').remove();
      });
    });
  }
};

/**
 * Resizes the button to toggle the toolbox visibility to the width of the
 * toolbox.
 * The toolbox width does not change with workspace width, so safe to do once.
 */
watchXBlocks.resizeToggleToolboxBotton = function() {
  window.dispatchEvent(new Event('resize'));
  var button = $('#button_toggle_toolbox');
  // Sets the toolbox toggle button width to that of the toolbox
  if (watchXBlocks.isToolboxVisible() && watchXBlocks.blocklyToolboxWidth()) {
    // For some reason normal set style and getElementById didn't work
    button.width(watchXBlocks.blocklyToolboxWidth());
    button[0].style.display = '';
  }
};

/** Resizes the container for the Blockly workspace. */
watchXBlocks.resizeBlocklyWorkspace = function() {
  var contentBlocks = document.getElementById('content_blocks');
  var wrapperPanelSize = watchXBlocks.getBBoxEx(document.getElementById('blocks_panel'));

  contentBlocks.style.top = wrapperPanelSize.y + 'px';
  contentBlocks.style.left = wrapperPanelSize.x + 'px';
  // Height and width need to be set, read back, then set again to
  // compensate for scrollbars.
  contentBlocks.style.height = wrapperPanelSize.height + 'px';
  contentBlocks.style.height = (2 * wrapperPanelSize.height - contentBlocks.offsetHeight) + 'px';
  contentBlocks.style.width = wrapperPanelSize.width + 'px';
  contentBlocks.style.width = (2 * wrapperPanelSize.width - contentBlocks.offsetWidth) + 'px';
};

/**
 * Sets the text for a "Materialize Modal" (like an android Dialog) to have
 * alert-like HTML messages.
 * @param {!string} title HTML to include in title.
 * @param {!element} body HTML to include in body.
 * @param {boolean=} confirm Indicates if the user is shown and option to just 'Ok' or 'Ok and cancel'.
 * @param {string=|function=} callback If confirm option is selected this would be the function called when clicked 'OK'.
 */
watchXBlocks.materialAlert = function(title, body, confirm, callback) {
  $('#gen_alert_title').text(title);
  $('#gen_alert_body').text('');
  $('#gen_alert_body').append(body);
  if (confirm == true) {
    $('#gen_alert_cancel_link').css({'display': 'block'});
    if (callback) {
      $('#gen_alert_ok_link').bind('click', callback);
    }
  } else {
    $('#gen_alert_cancel_link').css({'display': 'none'});
    $('#gen_alert_ok_link').unbind('click');
  }
  $('#gen_alert').openModal();
  window.location.hash = '';
};

/** Opens the modal that displays the "not connected to server" message. */
watchXBlocks.openNotConnectedModal = function() {
  $('#not_running_dialog').openModal({ dismissible: true, opacity: .5, in_duration: 200, out_duration: 250 });
};

/** Opens the modal that displays the Settings. */
watchXBlocks.openSettingsModal = function() {
  $('#settings_dialog').openModal({ dismissible: true, opacity: .5, in_duration: 200, out_duration: 250 });
};


watchXBlocks.openAboutDialog = function() {
  $('#about_us').openModal({ dismissible: true, opacity: .5, in_duration: 200, out_duration: 250 });
};

watchXBlocks.openWatchFaceDialog = function() {
  $('#face_dialog').openModal({ dismissible: true, opacity: .5, in_duration: 200, out_duration: 250 });
};

watchXBlocks.openExampleDialog = function() {
  $('#example_dialog').openModal({ dismissible: true, opacity: .5, in_duration: 200, out_duration: 250 });
};

/**
 * Opens the modal that allows selection on additional toolbox categories.
 * @param {!element} html_content HTML to include in modal body.
 */
watchXBlocks.openAdditionalBlocksModal = function(html_content) {
  $('#blocks_menu_body').text('');
  $('#blocks_menu_body').append(html_content);
  $('#blocks_menu').openModal({ dismissible: true, opacity: .5, in_duration: 200, out_duration: 250 });
};

/**
 * Creates an HTML node with the blocks category information from arguments.
 * @param {!string} title Text to include as category title.
 * @param {!string} description TExt to include in as description.
 * @param {!function} clickBind Function to bind to the tick box click.
 * @return {!element} HTML element to display the category content.
 */
watchXBlocks.createExtraBlocksCatHtml = function(title, description, clickBind) {
  var tickId = title.replace(/\s+/g, '');
  var tickHtml = document.createElement('input');
  tickHtml.type = 'checkbox';
  tickHtml.id = tickId;
  tickHtml.addEventListener('click', function() {
    clickBind(document.getElementById(tickId).checked);
  });
  var tickLabelHtml = document.createElement('label');
  tickLabelHtml.htmlFor = tickId;
  tickLabelHtml.className = 'modal_label_title';
  tickLabelHtml.appendChild(document.createTextNode(title));
  var separatorHtml = document.createElement('div');
  separatorHtml.className = 'divider';
  var descriptionHthml = document.createElement('div');
  descriptionHthml.appendChild(document.createTextNode(description));

  var htmlContent = document.createElement('div');
  htmlContent.className = 'modal_section';
  htmlContent.appendChild(tickHtml);
  htmlContent.appendChild(tickLabelHtml);
  htmlContent.appendChild(separatorHtml);
  htmlContent.appendChild(descriptionHthml);
  return htmlContent;
};

/**
 * Displays a short message for 4 seconds in the form of a Materialize toast.
 * @param {!string} message Text to be temporarily displayed.
 */
watchXBlocks.MaterialToast = function(message) {
  Materialize.toast(message, 4000);
};

/**
 * Populates the Arduino IDE output content area and triggers the visual
 * highlight to call for the user attention.
 * @param {!element} bodyEl HTML to include into IDE output content area.
 */
watchXBlocks.arduinoIdeOutput = function(bodyEl) {
  var ideOuputContent = document.getElementById('content_ide_output');
  ideOuputContent.innerHTML = '';
  ideOuputContent.appendChild(bodyEl);
  watchXBlocks.highlightIdeOutputHeader();
};

/**
 * Clears the content of the Arduino IDE output element to a default text.
 * @param {!element} bodyEl HTML to include into IDE output content area.
 */
watchXBlocks.resetIdeOutputContent = function(bodyEl) {
  var ideOuputContent = document.getElementById('content_ide_output');
  ideOuputContent.innerHTML = '<span class="arduino_dialog_out">' + watchXBlocks.getLocalStr('arduinoOpWaiting') + '</span>';
};

watchXBlocks.setSketchFileName = function(new_name) {
  var sketchNameInput = $('#sketch_name');
  sketchNameInput.attr("data-filename", new_name); // null
  if(new_name == null) {
    sketchNameInput.text(watchXBlocks.defaultBaseName);
  } else {
    sketchNameInput.text( new_name.replace(/^.*[\\\/]/, '') );
  }
};

watchXBlocks.getSketchFileName = function() {
  var sketchNameInput = $('#sketch_name');
  return sketchNameInput.attr("data-filename");
};

/** Creates a highlight animation to the Arduino IDE output header. */
watchXBlocks.highlightIdeOutputHeader = function() {
  var header = document.getElementById('ide_output_collapsible_header');
  var h = 'ide_output_header_highlight';
  var n = 'ide_output_header_normal';
  header.className = header.className.replace(/ide_output_header_\S+/, h);
  setTimeout(function() {
    header.className = header.className.replace(/ide_output_header_\S+/, n);
    setTimeout(function() {
      header.className = header.className.replace(/ide_output_header_\S+/, h);
      setTimeout(function() {
        header.className = header.className.replace(/ide_output_header_\S+/, n);
      }, 500);
    }, 500);
  }, 500);
};

/**
 * Controls the height of the block and collapsible content between 2 states
 * using CSS classes.
 * It's state is dependent on the state of the IDE output collapsible. The
 * collapsible functionality from Materialize framework adds the active class,
 * so this class is consulted to shrink or expand the content height.
 */
watchXBlocks.contentHeightToggle = function() {
  var outputHeader = document.getElementById('ide_output_collapsible_header');
  var blocks = document.getElementById('blocks_panel');
  var arduino = document.getElementById('content_arduino');
  var xml = document.getElementById('content_xml');

  // Blockly doesn't resize with CSS3 transitions enabled, so do it manually
  var timerId = setInterval(function() {
    window.dispatchEvent(new Event('resize'));
  }, 15);
  setTimeout(function() {
    clearInterval(timerId);
  }, 400);

  // Apart from checking if the output is visible, do not bother to shrink in
  // small screens as the minimum height of the content will kick in and cause
  // the content to be behind the IDE output data anyway.
  if (!outputHeader.className.match('active') && $(window).height() > 800) {
    blocks.className = 'content height_transition blocks_panel_small';
    arduino.className = 'content height_transition content_arduino_small';
    xml.className = 'content height_transition content_xml_small';
  } else {
    blocks.className = 'content height_transition blocks_panel_large';
    arduino.className = 'content height_transition content_arduino_large';
    xml.className = 'content height_transition content_xml_large';
  }

  // If the height transition CSS is left then blockly does not resize
  setTimeout(function() {
    blocks.className = blocks.className.replace('height_transition', '');
    arduino.className = arduino.className.replace('height_transition', '');
    xml.className = xml.className.replace('height_transition', '');
  }, 400);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
watchXBlocks.getBBoxEx = function(element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0, y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return { height: height, width: width, x: x, y: y };
};
