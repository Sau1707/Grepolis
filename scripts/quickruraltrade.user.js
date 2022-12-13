// ==UserScript==
// @name         GrepoTweaks-QuickRuralTrade
// @namespace    quickruraltrade
// @author       Sau1707
// @description  Add a trade button into the island overview
// @version      1.0.0
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==

(function () {
	'use strict';
	const uw = unsafeWindow ? unsafeWindow : window;

	/* return all rural in island */
	function getAllRurals(x, y) {
		let rurals = uw.MM.getCollections().FarmTown[0].models;
		let lista = [];
		for (let rural of rurals) {
			if (rural.attributes.island_x != x || rural.attributes.island_y != y) continue;
			lista.push(rural.attributes);
		}
		return lista;
	}

	/* Get a button -> apply a red filer */
	function applyRedFilter(id) {
		let el = document.getElementById(id);
		if (!el) return;
		el.style.filter =
			'brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)';
	}

	/* Send post request */
	function tradePost(farm_town_id, relation_id, count) {
		let data = {
			model_url: `FarmTownPlayerRelation/${relation_id}`,
			action_name: 'trade',
			arguments: { farm_town_id: farm_town_id, amount: count > 3000 ? 3000 : count },
		};
		uw.gpAjax.ajaxPost('frontend_bridge', 'execute', data);
	}

	/* on button click, trade with that rural */
	function tradeWith(name, rural_in_island) {
		let clicked_rural;
		for (let rural of rural_in_island) if (rural.name == name) clicked_rural = rural;
		/* Check trade capacity */
		let trade_capacity = uw.ITowns.getCurrentTown().getAvailableTradeCapacity();
		if (trade_capacity == 0) {
			uw.HumanMessage.error('No trade capacity');
			return;
		}

		let player_relations = uw.MM.getCollections().FarmTownPlayerRelation[0].models;
		let relation_id;
		for (let farm_town of player_relations)
			if (clicked_rural.id == farm_town.attributes.farm_town_id)
				relation_id = farm_town.attributes.id;
		if (!relation_id) return;
		let current_polis_resouce =
			uw.ITowns.getCurrentTown().resources()[clicked_rural.resource_demand];
		if (current_polis_resouce < trade_capacity) trade_capacity = current_polis_resouce;
		tradePost(clicked_rural.id, relation_id, trade_capacity);
		applyRedFilter(clicked_rural.name);
	}

	/* add trade button */
	function addTradeButton(el, rural_in_island) {
		const button = document.createElement('div');
		const rural_name = el.getElementsByClassName('gp_town_link')[0].innerText;

		button.id = rural_name;
		button.style.position = 'absolute';
		button.style.right = '5px';
		button.style.top = '5px';
		button.classList.add('button_new');
		button.innerHTML =
			'<div class="left"></div>\n\t\t<div class="right"></div>\n\t\t<div class="caption js-caption"> Trade <div class="effect js-effect"></div></div>';
		el.appendChild(button);

		/* Check if ratio is < then 1, apply red filter to button in that case */
		const ratio = el.getElementsByClassName('popup_ratio')[0].innerText.split(':');
		if (ratio[0] > ratio[1]) applyRedFilter(rural_name);

		/* Disable button if no trading avable */
		let trade_capacity = uw.ITowns.getCurrentTown().getAvailableTradeCapacity();
		if (trade_capacity == 0) button.classList.add('disabled');

		/* Hanbdle user click  */
		button.addEventListener('click', () => {
			if (button.classList.contains('disabled')) return;
			tradeWith(rural_name, rural_in_island);
		});
	}

	/* Start script when user open island */
	uw.$.Observer(uw.GameEvents.window.open).subscribe((e, data) => {
		if (data.context != 'island') return;
		let island_window = data.wnd.getElement();
		setTimeout(() => {
			/* Get island coordinates + town coord */
			let island_coord = /\(([^)]+)\)/
				.exec(island_window.getElementsByClassName('islandinfo_coords')[0].innerText)[1]
				.split('/');
			let x = uw.ITowns.getCurrentTown().getIslandCoordinateX();
			let y = uw.ITowns.getCurrentTown().getIslandCoordinateY();
			if (island_coord[1] != x && island_coord[1] != y) return;

			let rural_in_island = getAllRurals(x, y);
			let list = island_window.getElementsByClassName('game_list')[3];
			for (let item of list.children) addTradeButton(item, rural_in_island);
		}, 100);
	});

	console.log('[GrepoTweaks-QuickRuralTrade] Loaded');
})();
