'use strict';

/** Create a namespace for the application. */
var watchXBlocks = watchXBlocks || {};



watchXBlocks.exampleList = [
	{ title: 'example_blink',                   cover: 'img/Blink.svg',  path: 'blink.wxb' },
	{ title: 'example_hello_world',             cover: 'img/HelloWorld.svg',  path: 'hello_world.wxb' },
	{ title: 'example_button_counter',          cover: 'img/ButtonCounter.svg',  path: 'button_counter.wxb' },
	{ title: 'example_drawing_lines',           cover: 'img/DrawingLines.svg',  path: 'drawing_lines.wxb' },
	{ title: 'example_sensor_movement',         cover: 'img/SensorMovement.svg',  path: 'sensor_read_movement.wxb' },
	{ title: 'example_sensor_temp_and_press',   cover: 'img/SensorTempPress.svg',  path: 'sensor_read_temp_pressure.wxb' },
	{ title: 'example_move_the_dot',            cover: 'img/MoveTheDot.svg',  path: 'move_the_dot.wxb' },
	{ title: 'example_siren',                   cover: 'img/Siren.svg',  path: 'siren.wxb' },
	{ title: 'example_watch_face',              cover: 'img/WatchFace.svg',  path: 'watch_face.wxb' },
	{ title: 'example_bounce',                  cover: 'img/Bounce.svg',  path: 'bounce.wxb' }
];

watchXBlocks.initExampleList = function() {
	var container = document.getElementById('example-container');
	if(container == null) {
		return;
	}
	while (container.lastElementChild) {
		container.removeChild(container.lastElementChild);
	}
	for(var item of watchXBlocks.exampleList) {
		var template = document.getElementById("example_item");
		var clone = template.content.cloneNode(true);
		if(item.desc == null) {
			item.desc = item.title + "_desc";
		}
		watchXBlocks.setupImageEx(clone, ".media-cover", item.title, item.cover);
		watchXBlocks.setupTranslateEx(clone, ".media-title", item.title);
		watchXBlocks.setupTranslateEx(clone, ".media-desc", item.desc);
		var node = watchXBlocks.setupDataPathEx(clone, ".load-wxb", item.path);
		if(node) {
			watchXBlocks.bindClickEx(node, function(e) {
				var footer = e.target.closest(".media-footer");
				var anchor = footer.querySelector("a.load-wxb");
				var data = anchor.getAttribute('data-wxb');
				if(!data) {
					return;
				}
				watchXBlocks.loadServerXmlFile('/examples/' + data);
			});
		}
		container.appendChild(clone);
	}
};

watchXBlocks.watchFaceList = [
	{ title: 'Tap Clock', cover: 'img/TapClock.svg', path: 'firmware/TapClock.hex', desc: 'by <a target="_blank" href="https://github.com/venice1200/TapClock/tree/master/TapClock">venice1200</a>' },
	{ title: 'Word Clock', cover: 'img/WordClock.svg', path: 'firmware/WordClock.hex', desc: 'by <a target="_blank" href="https://github.com/venice1200/TapClock/tree/master/WordClock">venice1200</a>' },
	{ title: 'Pacman', cover: 'img/Pacman.svg', path: 'firmware/Pacman.hex', desc: 'by <a target="_blank" href="https://github.com/mic159/Pong_Clock">0miker0 & mic159</a>' },
	{ title: 'Pong', cover: 'img/Pong.svg', path: 'firmware/Pong.hex', desc: 'by <a target="_blank" href="https://github.com/mic159/Pong_Clock">0miker0 & mic159</a>' },
	{ title: 'Tetris', cover: 'img/Tetris.svg', path: 'firmware/Tetris.hex', desc: 'by <a target="_blank" href="https://github.com/mic159/Pong_Clock">0miker0 & mic159</a>' },
	{ title: 'Nwatch', cover: 'img/Nwatch.svg', path: 'firmware/Nwatch.hex', desc: 'by <a target="_blank" href="https://github.com/zkemble/NWatch">Zak Kemble</a> & <a target="_blank" href="https://www.reddit.com/r/watchX/comments/8wjh6j/porting_nwatch_source_code">sasapea3</a>' },
];
watchXBlocks.initWatchFaceList = function() {
	var container = document.getElementById('watch-face-container');
	if(container == null) {
		return;
	}
	while (container.lastElementChild) {
		container.removeChild(container.lastElementChild);
	}
	for(var item of watchXBlocks.watchFaceList) {
		var template = document.getElementById("watch_face_item");
		var clone = template.content.cloneNode(true);
		if(item.desc == null) {
			item.desc = "By argeX";
		}
		watchXBlocks.setupImageEx(clone, ".media-cover", item.title, item.cover);
		watchXBlocks.setTextEx(clone, ".media-title", item.title);
		watchXBlocks.setTextEx(clone, ".media-desc", item.desc);
		var node = watchXBlocks.setupDataPathEx(clone, ".upload-hex", item.path);
		if(node) {
			watchXBlocks.bindClickEx(node, watchXBlocks.firmwareUpload);
		}
		container.appendChild(clone);
	}
};

watchXBlocks.gameList = [
	{ without_gpad: true, title: 'ArduBreakout', cover: 'img/ArduBreakout.png', path: 'games/ArduBreakout for watchX.hex', desc: 'a classic brick breaking game<br/>developed by Arduboy', source: 'https://github.com/argeX-official/Game-ArduBreakout' },
	{ without_gpad: true, title: 'Flappy Ball', cover: 'img/Flappy_Ball.png', path: 'games/Flappy Ball for watchX.hex', desc: 'a bird bouncing game<br/>developed by Scott Allen', source: 'https://github.com/argeX-official/Game-Flappy_Ball' },
	{ without_gpad: true, title: 'Hollow Seeker', cover: 'img/Hollow_Seeker.png', path: 'games/Hollow Seeker for watchX.hex', desc: 'search for a hollow spot to survive<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
	{ without_gpad: true, title: 'Picovaders', cover: 'img/Picovaders.png', path: 'games/Picovaders for watchX.hex', desc: 're-imagination of a nostalgic game<br/>developed by boochow', source: 'https://github.com/argeX-official/Game-Picovaders' },
	{ without_gpad: false, title: 'ArduMan', cover: 'img/ArduMan.png', path: 'games/ArduMan for watchX.hex', desc: 're-imagination of a nostalgic game<br/>developed by Seth Robinson', source: 'https://github.com/argeX-official/Game-ArduMan' },
	{ without_gpad: false, title: 'ArduSnake', cover: 'img/ArduSnake.png', path: 'games/ArduSnake for watchX.hex', desc: 're-imagination of the classic snake game<br/>developed by Initgraph', source: 'https://github.com/argeX-official/Game-ArduSnake' },
	{ without_gpad: false, title: 'Arduboy3D', cover: 'img/Arduboy3D.png', path: 'games/Arduboy3D for watchX.hex', desc: 'explore mazes and fight with enemies<br/>developed by jhhoward', source: 'https://github.com/argeX-official/Game-Arduboy3D' },
	{ without_gpad: false, title: 'Chie Magari Ita', cover: 'img/Chie_Magari_Ita.png', path: 'games/Chie Magari Ita for watchX.hex', desc: 'a placing puzzle game<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
	{ without_gpad: false, title: 'Hopper', cover: 'img/Hopper.png', path: 'games/Hopper for watchX.hex', desc: 'jump on hingher platforms to get more points<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
	{ without_gpad: false, title: 'Knight Move', cover: 'img/Knight_Move.png', path: 'games/Knight Move for watchX.hex', desc: 'play chess by only using the knight<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
	{ without_gpad: false, title: 'Lasers', cover: 'img/Lasers.png', path: 'games/Lasers for watchX.hex', desc: 'try to escape from the lasers<br/>developed by OBONO', source: 'https://github.com/argeX-official/Game-ArduboyWorks' },
	{ without_gpad: false, title: 'Micro Tank', cover: 'img/Micro_Tank.png', path: 'games/Micro Tank for watchX.hex', desc: 'use different types of tanks<br/>developed by hartmann1301', source: 'https://github.com/argeX-official/Game-Mirco_Tank' },
	{ without_gpad: false, title: 'MicroCity', cover: 'img/MicroCity.png', path: 'games/MicroCity for watchX.hex', desc: 'build cities with roads and infrastructure<br/>developed by jhhoward', source: 'https://github.com/argeX-official/Game-MicroCity' },
	{ without_gpad: false, title: 'Mystic Balloon', cover: 'img/Mystic_Balloon.png', path: 'games/Mystic Balloon for watchX.hex', desc: 'a platformer with balloon surfing dynamics<br/>developed by TEAM a.r.g.', source: 'https://github.com/argeX-official/Game-Mystic_Balloon' },
	{ without_gpad: false, title: 'Shadow Runner', cover: 'img/Shadow_Runner.png', path: 'games/Shadow Runner for watchX.hex', desc: 'evade enemies while running<br/>developed by TEAM a.r.g.', source: 'https://github.com/argeX-official/Game-Shadow_Runner' },
	{ without_gpad: false, title: 'Squario', cover: 'img/Squario.png', path: 'games/Squario for watchX.hex', desc: 'a platformer with simple gameplay<br/>developed by arduboychris', source: 'https://github.com/argeX-official/Game-Squario' },
	{ without_gpad: false, title: 'Stellar Impact', cover: 'img/Stellar_Impact.png', path: 'games/Stellar Impact for watchX.hex', desc: 'side scrolling space action game<br/>developed by Athene Allen', source: 'https://github.com/argeX-official/Game-Stellar_Impact' }
];

watchXBlocks.initGameList = function() {
	var container = document.getElementById('games-container');
	if(container == null) {
		return;
	}
	while (container.lastElementChild) {
		container.removeChild(container.lastElementChild);
	}
	for(var item of watchXBlocks.gameList) {
		var template = document.getElementById("game_item"); // duplicated
		var clone = template.content.cloneNode(true);
		if(item.desc == null) {
			item.desc = "By argeX";
		}
		watchXBlocks.setupImageEx(clone, ".media-cover", item.title, item.cover);
		watchXBlocks.setTextEx(clone, ".media-title", item.title);
		watchXBlocks.setTextEx(clone, ".media-desc", item.desc);
		watchXBlocks.setupAnchorEx(clone, ".media-link", item.source);
		watchXBlocks.setupVisibleEx(clone, '.media-play', item.without_gpad)
		var node = watchXBlocks.setupDataPathEx(clone, ".upload-hex", item.path);
		if(node) {
			watchXBlocks.bindClickEx(node, watchXBlocks.firmwareUpload);
		}
		container.appendChild(clone);
	}
};

watchXBlocks.firmwareUpload = function(e) {
	var footer = e.target.closest(".media-footer");
	var anchor = footer.querySelector("a.upload-hex");
	var data = anchor.getAttribute('data-wxb');
	if(!data) {
		return;
	}
	footer.classList.add('media-active');
	watchXBlocks.resetIdeOutputContent();
	watchXBlocks.sendAsync("upload-hex", { hex_path:data });
};

watchXBlocks.firmwareUploadResult = function(result) {
	var footer = e.target.closest(".media-footer");
	footer.classList.remove('media-active');
	if (result === null) {
		return watchXBlocks.openNotConnectedModal();
	}
	var dataBack = watchXBlocks.jsonToIdeModal(result);
	watchXBlocks.arduinoIdeOutput(dataBack);
}