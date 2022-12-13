// ==UserScript==
// @name         GrepoTweaks-AutoGratis
// @namespace    autogratis
// @author       Sau1707
// @description  Click the gratis button so you don't have to do it
// @version      1.0.2
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==

(function () {
	'use strict';
	function callFree() {
		let el = document.getElementsByClassName('type_free');
		if (!el[0]) return;
		el[0].click();
	}

	let loop = setInterval(callFree, 4000);

	console.log('[GrepoTweaks-AutoGratis] Loaded');
})();
