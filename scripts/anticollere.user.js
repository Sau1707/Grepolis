// ==UserScript==
// @name         GrepoTweaks-AntiCollere
// @namespace    anticollere
// @author       Sau1707
// @description  Save your attack from the strorm
// @version      2.0.0
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==

(function () {
	'use strict';
	const uw = unsafeWindow ? unsafeWindow : window;

	var delta_time = 600;
	var loop_funct = false;
	/* */
	function setColor(elm, apply) {
		if (apply)
			elm.style.filter =
				'brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)';
		else elm.style.filter = '';
	}

	/* Check if user click athena*/
	function handleAthena() {
		var athena = document.getElementsByClassName('god_mini athena athena')[0];
		athena.style.zIndex = 10;
		athena.style.cursor = 'pointer';
		if (!athena) return;
		var strength_of_heroes = document.getElementsByClassName(
			'js-power-icon animated_power_icon animated_power_icon_45x45 power_icon45x45 power strength_of_heroes',
		)[0];
		if (!strength_of_heroes) return;
		athena.onclick = function () {
			if (!loop_funct) loop_funct = setInterval(clicker, 1000, strength_of_heroes);
			else {
				clearInterval(loop_funct);
				loop_funct = null;
			}
			setColor(athena, loop_funct);
		};
	}

	function handleZeus() {
		var zeus = document.getElementsByClassName('god_mini zeus zeus')[0];
		zeus.style.zIndex = 10;
		zeus.style.cursor = 'pointer';
		if (!zeus) return;
		var fair_wind = document.getElementsByClassName(
			'js-power-icon animated_power_icon animated_power_icon_45x45 power_icon45x45 power fair_wind',
		)[0];
		if (!fair_wind) return;
		zeus.onclick = function () {
			if (!loop_funct) loop_funct = setInterval(clicker, 1000, fair_wind);
			else {
				clearInterval(loop_funct);
				loop_funct = null;
			}
			setColor(zeus, loop_funct);
		};
	}

	function handleArtemis() {
		var artemis = document.getElementsByClassName('god_mini artemis artemis')[0];
		artemis.style.cursor = 'pointer';
		artemis.style.zIndex = 10;
		if (!artemis) return;
		var effort_of_the_huntress = document.getElementsByClassName(
			'js-power-icon animated_power_icon animated_power_icon_45x45 power_icon45x45 power effort_of_the_huntress',
		)[0];
		if (!effort_of_the_huntress) return;
		artemis.onclick = function () {
			if (!loop_funct) loop_funct = setInterval(clicker, 1000, effort_of_the_huntress);
			else {
				clearInterval(loop_funct);
				loop_funct = false;
			}
			setColor(artemis, loop_funct);
		};
	}

	function main() {
		setTimeout(() => {
			handleAthena();
			handleZeus();
			handleArtemis();
		}, 100);
	}

	function clicker(elm) {
		let check = document.getElementsByClassName(
			'js-power-icon animated_power_icon animated_power_icon_45x45 power_icon45x45 power',
		)[0];
		if (!check) {
			clearInterval(loop_funct);
			loop_funct = null;
			return;
		}
		elm.click();
		let rand = 500 + Math.floor(Math.random() * delta_time);
		clearInterval(loop_funct);
		loop_funct = setInterval(clicker, rand, elm);
	}

	uw.$.Observer(uw.GameEvents.window.open).subscribe((e, data) => {
		if (data.context != 'atk_command') return;
		setTimeout(() => {
			let spellMenu = document.getElementById('command_info-god');
			if (!spellMenu) return;
			console.log('herer');
			spellMenu.addEventListener('click', main);
		}, 100);
	});

	console.log('[GrepoTweaks-AntiCollere] Loaded');
})();
