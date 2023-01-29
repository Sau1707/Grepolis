// ==UserScript==
// @name         GrepoTweaks- GrepoAutoBrulotti
// @namespace    autobrulotti
// @author       Sau1707
// @description  Troops brulotti automatically
// @version      1.0.0
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==

(function () {
	'use strict';

	/* Settings */
	const useCallOfTheOcean = true;
	const autoStoreExcessIron = true;
	const minTroopable = 40;
	const minTroopableBeforeCastEnd = 15;

	/* Window object */
	const uw = unsafeWindow;

	/* return the list of polis in the brulotti list */
	function getBrulottiList() {
		for (let group of Object.values(uw.ITowns.getTownGroups())) {
			if (group.name != 'Brulotti') continue;
			return Object.keys(group.towns).map((val) => parseInt(val));
		}
		return false;
	}

	/* Return the ammount of duable Brulotti in polis */
	function getDuableBrulotti(targtet_id) {
		let target_polis = uw.ITowns.towns[targtet_id];
		if (!target_polis) return 0;
		let discount = uw.GeneralModifications.getUnitBuildResourcesModification(
			targtet_id,
			uw.GameData.units.demolition_ship,
		);

		let resources = target_polis.resources();
		let wood = resources.wood / (uw.GameData.units.demolition_ship.resources.wood * discount);
		let stone =
			resources.stone / (uw.GameData.units.demolition_ship.resources.stone * discount);
		let iron = resources.iron / (uw.GameData.units.demolition_ship.resources.iron * discount);
		let min = Math.min(wood, stone, iron);
		if (target_polis.getAvailablePopulation() < min * 8)
			min = target_polis.getAvailablePopulation() / 8;
		return parseInt(min);
	}

	/* Send request to the send to troop the bireme */
	function troopBrulotti(polis_id, count) {
		let data = { unit_id: 'demolition_ship', amount: count, town_id: polis_id };
		uw.gpAjax.ajaxPost('building_barracks', 'build', data);
	}

	/* Cast the call of the ocean */
	function sendCallofTheOcean(polis_id) {
		let data = {
			model_url: 'CastedPowers',
			action_name: 'cast',
			arguments: { power_id: 'call_of_the_ocean', target_id: polis_id },
			town_id: polis_id,
			nl_init: true,
		};
		uw.gpAjax.ajaxPost('frontend_bridge', 'execute', data);
	}

	function storeIron(polis_id, count) {
		let target_polis = uw.ITowns.towns[polis_id];
		if (target_polis.getBuildings().attributes.hide < 10) return;
		let data = {
			model_url: 'BuildingHide',
			action_name: 'storeIron',
			arguments: { iron_to_store: count },
			town_id: polis_id,
			nl_init: true,
		};
		uw.gpAjax.ajaxPost('frontend_bridge', 'execute', data);
	}

	function sleep(time) {
		return new Promise(function (myResolve, myReject) {
			setTimeout(() => myResolve(), time);
		});
	}

	/* Return the call of the ocean object of the given city */
	function getCallofTheOcean(polis_id) {
		for (let model of uw.ITowns.towns[polis_id].casted_powers_collection.models) {
			if (model.attributes.power_id != 'call_of_the_ocean') continue;
			else return model.attributes;
		}
		return false;
	}

	const tenMinutes = 10 * 60;
	async function main() {
		let brulotti_list = getBrulottiList();
		if (!brulotti_list) return;

		if (
			useCallOfTheOcean &&
			uw.MM.getModels().PlayerGods[uw.Game.player_id].attributes.poseidon_favor < 60
		)
			uw.HumanMessage.error('Favori Poseidone');

		for (let town of brulotti_list) {
			let target_polis = uw.ITowns.towns[town];
			if (!target_polis) continue;

			/* Store iron if more then 30k*/
			if (autoStoreExcessIron) {
				let iron = target_polis.resources().iron;
				if (iron > 30000) storeIron(town, iron - 15000);
			}

			/* Filter polis that have full quee */
			if (target_polis.getUnitOrdersCollection().length >= 7) continue;

			/* Get cast and ammount of duable biremes */
			let cast = getCallofTheOcean(town);
			let duable = getDuableBrulotti(town);

			/* If the count if more the 45, then troop them*/
			if (duable > minTroopable) {
				if (
					useCallOfTheOcean &&
					!cast &&
					uw.MM.getModels().PlayerGods[uw.Game.player_id].attributes.poseidon_favor >= 60
				)
					sendCallofTheOcean(town);
				else if (
					uw.MM.getModels().PlayerGods[uw.Game.player_id].attributes.poseidon_favor < 60
				)
					continue;
				await sleep(250);
				troopBrulotti(town, duable);
				console.log(target_polis.name, ':', duable);
				continue;
			}

			/* If the cast is ending in the next 10 minutes, add biremes of they are more than 15*/
			if (
				Date.now() / 1000 + tenMinutes > cast.end_at &&
				duable > minTroopableBeforeCastEnd
			) {
				troopBrulotti(town, duable);
				await sleep(250);
				continue;
			}
		}
	}

	let interval = setInterval(main, 20000);
})();
