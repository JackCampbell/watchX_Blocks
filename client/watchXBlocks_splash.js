const { ipcRenderer } = require("electron");




ipcRenderer.on("set-progress", (event, args) => {
	var e = document.querySelector('#splash-progress > span.message');
	if(e != null) {
		e.innerHTML = args.message;
	}
	e = document.querySelector('#splash-progress > div.infinity');
	if(e) {
		e.style.width = `${args.progress}%`;
	}
});

