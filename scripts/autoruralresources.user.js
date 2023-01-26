// ==UserScript==
// @name         GrepoTweaks-AutoRuralResources
// @namespace    sentinelindicator
// @author       Sau1707
// @description  Claim Automatically the resouces from the rural villages (need capitan to work)
// @version      2.1.0
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==

(function () {
	'use strict';
	const uw = unsafeWindow ? unsafeWindow : window;

	/* Define cost and variables */
	const time = 620000; //620000; time in seconds - 10 min + some extra
	const delta_time = 5000;
	let loop, lastTime, timer;
	let startOnLogin = true;

	const buttonHtml =
		'<div class="divider"></div><div class="activity" id="btbutton" style="filter: brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8);"><p id="ptimer" style="z-index: 6; top: -8px; position: relative; font-weight: bold;"></p></div>';

	/* Send post request to the server to get resourses */
	function claim(polisList) {
		let data = {
			towns: polisList,
			time_option_base: 300,
			time_option_booty: 600,
			claim_factor: 'normal',
		};
		uw.gpAjax.ajaxPost('farm_town_overviews', 'claim_loads_multiple', data);
	}

	/* generate the list containing 1 polis per island */
	function generateList() {
		let islandList = [];
		let polisList = [];
		let length = uw.MM.getCollections().Town[0].models.length;
		for (let i = 0; i < length; i++) {
			if (uw.MM.getCollections().Town[0].models[i].attributes.on_small_island) continue;
			let islandID = uw.MM.getCollections().Town[0].models[i].attributes.island_id;
			let polisID = uw.MM.getCollections().Town[0].models[i].attributes.id;
			if (!islandList.includes(islandID)) {
				islandList.push(islandID);
				polisList.push(polisID);
			}
		}
		return polisList;
	}

	/* return the ammount of milliseconds before the next collection  */
	function getNextCollection() {
		let models = uw.MM.getCollections().FarmTownPlayerRelation[0].models;
		let min = Number.MAX_SAFE_INTEGER;
		for (let model of models) {
			if (model.attributes.lootable_at < min) min = model.attributes.lootable_at;
		}
		let seconds = min - Math.floor(Date.now() / 1000);
		if (seconds < 0) return 0;
		return seconds * 1000;
	}

	/* Handle the timer and get resourses at the right time */
	function main() {
		/* Fix time if out ot timing */
		let next = getNextCollection();
		if (next + 2 * delta_time < timer) {
			timer = next + Math.floor(Math.random() * delta_time);
		}

		/* Claim resouces of timer has passed */
		if (timer < 1) {
			let Polislist = generateList();
			claim(Polislist);
			let rand = Math.floor(Math.random() * delta_time);
			timer = time + rand;
			setTimeout(() => uw.WMap.removeFarmTownLootCooldownIconAndRefreshLootTimers(), 2000);
		}
		/* Update timing */
		const currentTime = Date.now();
		timer -= currentTime - lastTime;
		lastTime = currentTime;
		/* update the timer */
		var bt = document.getElementById('ptimer');
		if (timer > 0) bt.innerHTML = parseInt(timer / 1000);
		else bt.innerHTML = '0';
	}

	function handleButtonClick() {
		if (!loop) {
			timer = getNextCollection() + Math.random() * delta_time;
			lastTime = Date.now();
			loop = setInterval(main, 1000);
			uw.$('#btbutton').css(
				'filter',
				'brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)',
			);
		} else {
			clearInterval(loop);
			loop = null;
			uw.$('#btbutton').css(
				'filter',
				'brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)',
			);
		}
	}

	/* add the button on window load */
	setTimeout(function () {
		let btbutton = document.getElementById('btbutton');
		if (btbutton == null) {
			uw.$('.tb_activities, .toolbar_activities').find('.middle').append(buttonHtml);
		}
		if (startOnLogin) handleButtonClick();
	}, 4000);

	/* Set button event */
	uw.$(document).on('click', '#btbutton', handleButtonClick);

	/* Print in console that the script is loaded */
	console.log('[GrepoTweaks-AutoRuralResources] Loaded');
})();
