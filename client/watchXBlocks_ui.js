'use strict';

/** Create a namespace for the application. */
var watchXBlocks = watchXBlocks || {};

watchXBlocks.setupImageEx = function(wrapper, selector, alt, src) {
	var e = wrapper.querySelector(selector);
	if(e) {
		e.setAttribute("alt", alt);
		e.setAttribute("src", src);
	}
	return e;
};
watchXBlocks.setupColorEx = function(wrapper, selector, color) {
	var e = wrapper.querySelector(selector);
	if(e) {
		e.style.color = color;
	}
	return e;
};

watchXBlocks.setupAnchorEx = function(wrapper, selector, src) {
	var e = wrapper.querySelector(selector);
	if(e) {
		e.setAttribute("href", src);
	}
	return e;
};
watchXBlocks.setupTranslateEx = function(wrapper, selector, string_id) {
	var e = wrapper.querySelector(selector);
	if(e) {
		e.classList.add("translatable_" + string_id);
	}
	return e;
};
watchXBlocks.setTextEx = function(wrapper, selector, string_id) {
	var e = wrapper.querySelector(selector);
	if(e) {
		e.innerHTML = string_id;
	}
	return e;
};
watchXBlocks.setupDataPathEx = function(wrapper, selector, data) {
	var e = wrapper.querySelector(selector);
	if(e) {
		e.setAttribute("data-wxb", data);
	}
	return e;
};


watchXBlocks.setupVisibleEx = function(wrapper, selector, state = false) {
	var e = wrapper.querySelector(selector);
	if(e) {
		e.style.display = state ? 'block': 'none';
	}
	return e;
};


/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!function} callback Event handler to bind.
 * @private
 */
watchXBlocks.bindClickEx = function (el, callback) {
	if (typeof el == 'string') {
		el = document.getElementById(el);
	}
	// Need to ensure both, touch and click, events don't fire for the same thing
	var propagateOnce = function (e) {
		e.stopPropagation();
		e.preventDefault();
		callback(e);
		return false;
	};
	el.addEventListener('ontouchend', propagateOnce);
	el.addEventListener('click', propagateOnce);
	return el;
};

watchXBlocks.setFormDisabledEx = function(wrapper, disabled) {
	var nodes = wrapper.querySelectorAll("input, select");
	for(var node of nodes) {
		node.disabled = disabled;
	}
	return nodes.length;
}