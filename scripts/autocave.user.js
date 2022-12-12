// ==UserScript==
// @name         GrepoTweaks-AutoCave
// @namespace    autocave
// @author       Sau1707
// @description  To automatically put silver in the cave
// @version      1.2.0
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==

(function () {
	'use strict';
	const uw = unsafeWindow ? unsafeWindow : window;
	let autoCaveLoop;

	/* Main loop */
	function autoCaveMain() {
		let max = document.getElementsByClassName('order_max button_new')[0];
		let con = document.getElementsByClassName('order_confirm button_new square')[0];
		if (max == null || con == null) clearInterval(autoCaveLoop);
		if (uw.ITowns.towns[uw.Game.townId].resources().iron > 5000) {
			max.click();
			con.click();
		}
	}

	/* Add button */
	function addAutoCaveButton() {
		let box = document.getElementsByClassName('order_count')[0];
		let butt = document.createElement('div');
		butt.className = 'button_new';
		butt.id = 'autoCaveButton';
		butt.style =
			'float: right; margin: 0px; left: 169px; position: absolute; top: 56px; width: 66px';
		butt.innerHTML =
			'<div class="left"></div><div class="right"></div><div class="caption js-caption"> Auto <div class="effect js-effect"></div></div>';
		box.insertBefore(butt, box.childNodes[0]);
	}

	/* Add click behaviour to button */
	function addButtonBehaviour() {
		uw.$('#autoCaveButton').click(() => {
			if (autoCaveLoop) {
				uw.$('#autoCaveButton').css('filter', '');
				clearInterval(autoCaveLoop);
				autoCaveLoop = null;
			} else {
				uw.$('#autoCaveButton').css(
					'filter',
					'brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)',
				);
				autoCaveLoop = setInterval(autoCaveMain, 1000);
			}
		});
	}

	/* Observe for town switch to add the button */
	uw.$.Observer(uw.GameEvents.town.town_switch).subscribe((e, data) => {
		setTimeout(() => {
			let autoCaveButton = document.getElementById('autoCaveButton');
			if (autoCaveButton) return;
			let cave = document.getElementsByClassName(
				'js-window-main-container classic_window hide',
			)[0];
			if (!cave) return;
			addAutoCaveButton();
			addButtonBehaviour();
			setTimeout(
				() => document.getElementsByClassName('order_max button_new')[0].click(),
				500,
			);
		}, 100);
	});

	/* Observe to open gui */
	uw.$.Observer(uw.GameEvents.window.open).subscribe((e, data) => {
		if (!data.attributes) return;
		if (data.attributes.window_type != 'hide') return;
		setTimeout(() => {
			addAutoCaveButton();
			addButtonBehaviour();
			setTimeout(
				() => document.getElementsByClassName('order_max button_new')[0].click(),
				500,
			);
		}, 200);
	});

	console.log('[GrepoTweaks-AutoCave] Loaded');
})();
