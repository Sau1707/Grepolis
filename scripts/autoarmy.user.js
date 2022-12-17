// ==UserScript==
// @name         GrepoTweaks-AutoArmy
// @namespace    autoarmy
// @author       Sau1707
// @description  IN BETA: Put unit's in quee automatically
// @version      1.0.0
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==

(function () {
	'use strict';
	const uw = unsafeWindow ? unsafeWindow : window;
	var polis_units = {};

	/* Update indicator of troops in current polis */
	function updateIndicator() {
		let current_polis = uw.Game.townId;
		if (!polis_units[current_polis]) return;
		for (let key in polis_units[current_polis]) {
			let current_troops = document.getElementById(key);
			if (!current_troops) return;
			let child = current_troops.getElementsByClassName(
				'unit unit_order_unit_image unit_icon50x50',
			)[0];
			if (!child) return;
			if (!polis_units[current_polis][key])
				child.firstElementChild.innerText =
					uw.ITowns.towns[current_polis].units()[key] || 0;
			else child.firstElementChild.innerText = '+' + polis_units[current_polis][key];
		}
	}

	/* TODO reset indicator */
	function resetIndicator() {}

	/* Add button and input if don't exist */
	function addButton() {
		if (document.getElementById('autoTropsButton')) return;
		let butt = document.createElement('div');
		butt.className = 'button_new';
		butt.id = 'autoTropsButton';
		butt.style = 'float: right; margin: 0px; left: -87px; position: absolute; top: 93px;';
		butt.innerHTML =
			'<div class="left"></div><div class="right"></div><div class="caption js-caption"> Auto <div class="effect js-effect"></div></div>';
		document.getElementById('unit_order_count').appendChild(butt);
		let inpu = document.createElement('input');
		inpu.className = '';
		inpu.id = 'autoTropsInput';
		inpu.style =
			'float: right; margin: 0px; left: -20px; position: absolute; top: 93px; height: 17px; border: 0px; text-align: center; padding: 3px; width: 52px; background: url(https://gpit.innogamescdn.com/images/game/barracks/input.png) no-repeat';
		document.getElementById('unit_order_count').appendChild(inpu);

		/* Add action to the button */
		butt.addEventListener('click', () => {
			let current_polis = uw.Game.townId;
			let current_troops = document
				.getElementsByClassName('unit_order_tab bold unit_active')[0]
				.id.substr(15);
			let count = inpu.value;

			let egual = count[0] == '=';
			count = egual ? parseInt(count.substr(1)) : parseInt(count);

			/* add polis to the list if not present */
			if (!polis_units[current_polis]) polis_units[current_polis] = {};

			/* If count is 0, remove from list  */
			if (!count) {
				polis_units[current_polis][current_troops] = 0;
				updateIndicator();
				delete polis_units[current_polis][current_troops];
				return;
			}

			/* Find ammoutn of troops to do */
			let to_do = egual
				? count - (uw.ITowns.towns[current_polis].units()[current_troops] || 0)
				: count;
			console.log(to_do);

			/* check that current quantities is duable */
			let popolation = uw.ITowns.towns[current_polis].getAvailablePopulation();

			/* Check pf already in quee */
			let pf_in_list = 0;
			for (let [unit, count] of Object.entries(polis_units[current_polis])) {
				if (unit == current_troops) return;
				console.log('unit', unit);
				pf_in_list += polis_units[current_polis][unit] * uw.GameData.units[unit].population;
			}

			let available_pf = parseInt(
				(popolation - pf_in_list) / uw.GameData.units[current_troops].population,
			);
			polis_units[current_polis][current_troops] =
				available_pf >= to_do ? to_do : available_pf;

			/* Update indicator */
			updateIndicator();
		});
	}

	uw.$(document).on('click', '.unit_tab', function () {
		updateIndicator();
	});

	// append auto button
	uw.$(document).ajaxComplete(function () {
		updateIndicator();
		/* Filter event */
		if (!document.getElementById('unit_order_count')) return;
		/* Add button */
		addButton();
	});

	function buildPost(polis, unit, count) {
		let data = { unit_id: unit, amount: count, town_id: polis };
		uw.gpAjax.ajaxPost('building_barracks', 'build', data);
		uw.HumanMessage.success('Truppato ' + count + ' su ' + polis);
	}

	/* return true if the max resouce it's > then max storage * percentual */
	function checkStorage(polis, troop, percentual) {
		let i_polis = uw.ITowns.towns[polis];
		let storage = (i_polis.getStorage() / 100) * percentual;
		let wood = i_polis.resources().wood / uw.GameData.units[troop].resources.wood;
		let stone = i_polis.resources().stone / uw.GameData.units[troop].resources.stone;
		let iron = i_polis.resources().iron / uw.GameData.units[troop].resources.iron;
		let min = parseInt(Math.min(wood, stone, iron));
		let max_resources = Math.max(
			uw.GameData.units[troop].resources.wood,
			uw.GameData.units[troop].resources.stone,
			uw.GameData.units[troop].resources.iron,
		);
		let checker = parseInt(storage / max_resources);

		return min >= checker;
	}

	/* return ammount of troop duable */
	function calculateAmmount(polis, troop) {
		let resouces = uw.ITowns.towns[polis].resources();
		let discount = uw.GeneralModifications.getUnitBuildResourcesModification(
			polis,
			uw.GameData.units[troop],
		);
		let wood = resouces.wood / (uw.GameData.units[troop].resources.wood * discount);
		let stone = resouces.stone / (uw.GameData.units[troop].resources.stone * discount);
		let iron = resouces.iron / (uw.GameData.units[troop].resources.iron * discount);
		let min = Math.min(wood, stone, iron);
		return parseInt(min);
	}

	function checkCoda(polis, troop) {
		// if troop not in coda, return;
		if (polis_units[polis][troop] == null) return;
		// if storage not full
		if (!checkStorage(polis, troop, 95)) {
			let ammount = calculateAmmount(polis, troop);
			if (ammount >= polis_units[polis][troop]) {
				buildPost(polis, troop, polis_units[polis][troop]);
				delete polis_units[polis][troop];
				updateIndicator();
			}
			return;
		}
		// else
		let ammount = calculateAmmount(polis, troop);
		if (ammount > polis_units[polis][troop]) {
			buildPost(polis, troop, polis_units[polis][troop]);
			delete polis_units[polis][troop];
			updateIndicator();
		} else {
			buildPost(polis, troop, ammount);
			polis_units[polis][troop] -= ammount;
			updateIndicator();
			return;
		}
	}

	// check if enought materials are in polis
	function check(polis) {
		// check if quee is full --> has to be fixed with land or sea
		let quee = uw.ITowns.towns[polis].getUnitOrdersCollection().models.length;
		if (quee >= 7) {
			delete polis_units[polis];
			return;
		}

		checkCoda(polis, 'catapult'); // catapult has priority
		for (let troop in polis_units[polis]) {
			if (troop != null) {
				checkCoda(polis, troop);
			}
		}
	}

	/* Main loop function */
	function main() {
		if (polis_units.length == 0) return;
		for (let key in polis_units) {
			if (key != null) {
				//console.log(checkStorage(key, "sword", "95"));
				check(key);
			}
		}
	}

	// call main every 10 sec
	setInterval(main, 10000);

	console.log('[GrepoTweaks-AutoArmy] Loaded');
})();
