const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");


function read_json(name) {
	var filename = path.join(__dirname, name);
	var buffer = fs.readFileSync(filename, "utf-8");
	return JSON.parse(buffer);
}

function write_json(name, json) {
	var buffer = JSON.stringify(json, null, "\t");
	var filename = path.join(__dirname, name);
	fs.writeFileSync(filename, buffer, "utf-8");
}

function create_global(lang, author = "JackCampbell <fozdemir@argex.io>") {
	var en_json = read_json("en.json");
	var src = read_json(lang + "_all.json");
	var nw_json = {
		"@metadata": {
			"author": author,
			"lastupdated": "----",
			"locale": lang,
			"messagedocumentation" : "qqq"
		}
	};
	for( var key in en_json ) {
		if(key == "@metadata") {
			continue;
		}
		var value = src[key];
		if(value == null) {
			console.log("undefined lang key: " + key);
			value = en_json[key];
		}
		nw_json[key] = value;
	}
	write_json(lang + ".json", nw_json);
}

function create_watchx(lang, author = "JackCampbell <fozdemir@argex.io>") {
	var en_json = read_json("en_watchx.json");
	var src = read_json(lang + "_all.json");
	var nw_json = {
		"@metadata": {
			"author": author,
			"lastupdated": "----",
			"locale": lang,
			"messagedocumentation" : "qqq"
		}
	};
	for( var key in en_json ) {
		if(key == "@metadata") {
			continue;
		}
		var value = src[key];
		if(value == null) {
			console.log("undefined lang key: " + key);
			value = en_json[key];
		}
		nw_json[key] = value;
	}
	write_json(lang + "_watchx.json", nw_json);
}

create_global("jp");
create_watchx("jp");