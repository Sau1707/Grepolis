/* 
    Ideas:
    - show current status
        - done
        - missing resouces (why type)
        - missing population
        - queee full
    - pause a specific polis
    - show end point
    - special buildings 
*/

// var r = Math.round(e.building.points * Math.pow(e.building.points_factor, e.next_level)) - Math.round(e.building.points * Math.pow(e.building.points_factor, e.level))

class AutoBuild extends ModernUtil {
	constructor() {
		super();

		/* Generate the list {id: buildings }*/
		this.towns_buildings = {};
		for (let town_id of Object.keys(ITowns.towns)) {
			let town = ITowns.towns[town_id];
			let buildings = town.getBuildings().attributes;
			this.towns_buildings[town_id] = { ...buildings };
		}

		/* Load settings */
		let savedVersion = JSON.parse(localStorage.getItem(`auto_build_levels${Game.world_id}`));
		if (savedVersion) {
			for (let town in this.towns_buildings) {
				if (savedVersion[town]) this.towns_buildings[town] = savedVersion[town];
			}
		}

		localStorage.setItem(
			`auto_build_levels${Game.world_id}`,
			JSON.stringify(this.towns_buildings),
		);

		/* Check if shift is pressed */
		this.shiftHeld = false;

		/* Check if the script va enabled */
		this.enable;
		this.autogratis;
		if (localStorage.getItem(`enable_autobuild_${Game.world_id}`) === 'true') {
			this.triggerAutoBuild();
		}
		if (localStorage.getItem(`enable_autogratis_${Game.world_id}`) === 'true') {
			this.triggerAutoGratis();
		}
	}

	renderSettings = () => {
		/* Apply event to shift */
		setTimeout(() => {
			$('#buildings_lvl_buttons').on('mousedown', (e) => {
				this.shiftHeld = e.shiftKey;
			});
			this.setPolisInSettings(ITowns.getCurrentTown().id);
			$.Observer(GameEvents.town.town_switch).subscribe(() => {
				this.setPolisInSettings(ITowns.getCurrentTown().id);
			});
		}, 100);

		return `
        <div class="game_border" style="margin-bottom: 20px">
            <div class="game_border_top"></div>
            <div class="game_border_bottom"></div>
            <div class="game_border_left"></div>
            <div class="game_border_right"></div>
            <div class="game_border_corner corner1"></div>
            <div class="game_border_corner corner2"></div>
            <div class="game_border_corner corner3"></div>
            <div class="game_border_corner corner4"></div>
            <div id="auto_gratis_title" style="cursor: pointer; filter: ${
				this.autogratis ? 'brightness(100%) saturate(186%) hue-rotate(241deg)' : ''
			}" class="game_header bold" onclick="window.autoBuild.triggerAutoGratis()"> Auto Build <span class="command_count"></span>
                <div style="position: absolute; right: 10px; top: 4px; font-size: 10px;"> (click to toggle) </div>
            </div>
            <div style="padding: 5px; font-weight: 600">
                Trigger to automatically press the <div id="dummy_free" class="btn_time_reduction button_new js-item-btn-premium-action js-tutorial-queue-item-btn-premium-action type_building_queue type_instant_buy instant_buy type_free">
                <div class="left"></div>
                <div class="right"></div>
                <div class="caption js-caption">Gratis<div class="effect js-effect"></div></div>
        </div> button (try every 4 seconds)
            </div>    
        </div>

        <div class="game_border" style="margin-bottom: 20px">
            <div class="game_border_top"></div>
            <div class="game_border_bottom"></div>
            <div class="game_border_left"></div>
            <div class="game_border_right"></div>
            <div class="game_border_corner corner1"></div>
            <div class="game_border_corner corner2"></div>
            <div class="game_border_corner corner3"></div>
            <div class="game_border_corner corner4"></div>
            <div id="auto_build_title" style="cursor: pointer; filter: ${
				this.enable ? 'brightness(100%) saturate(186%) hue-rotate(241deg)' : ''
			}" class="game_header bold" onclick="window.autoBuild.triggerAutoBuild()"> Auto Build <span class="command_count"></span>
                <div style="position: absolute; right: 10px; top: 4px; font-size: 10px;"> (click to toggle) </div>
            </div>
            <div id="buildings_lvl_buttons"></div>    
        </div> `;
	};

	setPolisInSettings = (town_id) => {
		const generatePolisHtml = (town_id, buildings) => {
			let town = ITowns.towns[town_id];
			let town_buildings = town.buildings().attributes;

			/* Return the html of the given building */
			const getBuildingHtml = (building, bg) => {
				let color = 'lime';
				if (buildings[building] < town_buildings[building]) color = 'red';
				else if (buildings[building] > town_buildings[building]) color = 'orange';

				return `
                    <div class="auto_build_box">
                    <div class="item_icon auto_build_building" style="background-position: -${bg[0]}px -${bg[1]}px;">
                        <div class="auto_build_up_arrow" onclick="window.autoBuild.editBuildingLevel(${town_id}, '${building}', 1)" ></div>
                        <div class="auto_build_down_arrow" onclick="window.autoBuild.editBuildingLevel(${town_id}, '${building}', -1)"></div>
                        <p style="color: ${color}" id="build_lvl_${building}" class="auto_build_lvl"> ${buildings[building]} <p>
                    </div>
                </div>`;
			};

			let groups = [];
			for (let group of Object.values(ITowns.getTownGroups())) {
				if (group.id == 0) continue;
				if (group.id == -1) continue;
				if (!group.towns[town_id]) continue;
				groups.push(group.name);
			}
			let string = groups.toString();

			return ` 
            <div id="build_settings_${town_id}">
                <div style="width: 200px; margin-bottom: 3px; display: inline-flex">
                    <a class="gp_town_link" href="${town.getLinkFragment()}">${town.getName()}</a> <p style="font-weight: bold; margin: 0px 5px"> ${
				string ? `(${string})` : ''
			} </p>
                </div>
                <div style="width: 766px; display: inline-flex; gap: 1px;">
                    ${getBuildingHtml('main', [450, 0])}
                    ${getBuildingHtml('storage', [250, 50])}
                    ${getBuildingHtml('farm', [150, 0])}
                    ${getBuildingHtml('academy', [0, 0])}
                    ${getBuildingHtml('temple', [300, 50])}
                    ${getBuildingHtml('barracks', [50, 0])}
                    ${getBuildingHtml('docks', [100, 0])}
                    ${getBuildingHtml('market', [0, 50])}
                    ${getBuildingHtml('hide', [200, 0])}
                    ${getBuildingHtml('lumber', [400, 0])}
                    ${getBuildingHtml('stoner', [200, 50])}
                    ${getBuildingHtml('ironer', [250, 0])}
                    ${getBuildingHtml('wall', [50, 100])}
                </div>
            </div>`;
		};

		$('#buildings_lvl_buttons').html(generatePolisHtml(town_id, this.towns_buildings[town_id]));
	};

	/* Call to trigger the autogratis */
	triggerAutoGratis = () => {
		if (!this.autogratis) {
			$('#auto_gratis_title').css(
				'filter',
				'brightness(100%) saturate(186%) hue-rotate(241deg)',
			);
			this.autogratis = setInterval(this.autogratisMain, 4000);
			botConsole.log('Auto Gratis -> On');
		} else {
			$('#auto_gratis_title').css('filter', '');
			clearInterval(this.autogratis);
			this.autogratis = null;
			botConsole.log('Auto Gratis -> Off');
		}
		localStorage.setItem(`enable_autogratis_${Game.world_id}`, this.autogratis ? true : false);
	};

	/* Main loop for the autogratis bot */
	autogratisMain = () => {
		let el = $('.type_building_queue.type_free').not('#dummy_free');
		if (!el.length) return;
		el.click();
		botConsole.log('Clicked gratis button');
	};

	/* call with town_id, building type and level to be added */
	editBuildingLevel = (town_id, name, d) => {
		/* if shift is pressed, add or remove 10 */
		d = this.shiftHeld ? d * 10 : d;
		const { max_level, min_level } = GameData.buildings[name];

		/* Check if bottom or top overflow */
		this.towns_buildings[town_id][name] = Math.min(
			Math.max(this.towns_buildings[town_id][name] + d, min_level),
			max_level,
		);

		const town = ITowns.towns[town_id];
		const townBuildings = town.buildings().attributes;

		const color =
			this.towns_buildings[town_id][name] > townBuildings[name]
				? 'orange'
				: this.towns_buildings[town_id][name] < townBuildings[name]
				? 'red'
				: 'lime';

		$(`#build_settings_${town_id} #build_lvl_${name}`)
			.css('color', color)
			.text(this.towns_buildings[town_id][name]);

		localStorage.setItem(
			`auto_build_levels${Game.world_id}`,
			JSON.stringify(this.towns_buildings),
		);
	};

	/* Call to toggle on and off */
	triggerAutoBuild = () => {
		if (!this.enable) {
			$('#auto_build_title').css(
				'filter',
				'brightness(100%) saturate(186%) hue-rotate(241deg)',
			);
			this.enable = setInterval(this.main, 20000);
			botConsole.log('Auto Build -> On');
		} else {
			$('#auto_build_title').css('filter', '');
			clearInterval(this.enable);
			this.enable = null;
			botConsole.log('Auto Build -> Off');
		}
		localStorage.setItem(`enable_autobuild_${Game.world_id}`, this.enable ? true : false);
	};

	/* Usage async this.sleep(ms) -> stop the code for ms */
	sleep = (ms) => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	/* Main loop for building */
	main = async () => {
		for (let town_id of Object.keys(this.towns_buildings)) {
			if (this.isFullQueue(town_id)) continue;
			if (this.isDone(town_id)) continue;
			await this.getNextBuild(town_id);
		}
	};

	/* Make post request to the server to buildup the building */
	postBuild = async (type, town_id) => {
		let town = ITowns.towns[town_id];
		let { wood, stone, iron } = town.resources();
		let { resources_for, population_for } =
			MM.getModels().BuildingBuildData[town_id].attributes.building_data[type];

		if (town.getAvailablePopulation() < population_for) return;
		if (wood < resources_for.wood || stone < resources_for.stone || iron < resources_for.iron)
			return;
		let data = {
			model_url: 'BuildingOrder',
			action_name: 'buildUp',
			arguments: { building_id: type },
			town_id: town_id,
		};
		gpAjax.ajaxPost('frontend_bridge', 'execute', data);
		botConsole.log(`${town.getName()}: buildUp ${type}`);
		await this.sleep(500);
	};

	/* Make post request to tear building down */
	postTearDown = async (type, town_id) => {
		let town = ITowns.towns[town_id];
		let data = {
			model_url: 'BuildingOrder',
			action_name: 'tearDown',
			arguments: { building_id: type },
			town_id: town_id,
		};
		gpAjax.ajaxPost('frontend_bridge', 'execute', data);
		console.log(`${town.getName()} (${town_id}): tearDown ${type}`);
		await this.sleep(500);
	};

	/* return true if the quee is full */
	isFullQueue = (town_id) => {
		let town = ITowns.towns[town_id];
		if (GameDataPremium.isAdvisorActivated('curator') && town.buildingOrders().length >= 7)
			return true;
		if (!GameDataPremium.isAdvisorActivated('curator') && town.buildingOrders().length >= 2)
			return true;
		return false;
	};

	/* return true if building match polis */
	isDone = (town_id) => {
		let town = ITowns.towns[town_id];
		let buildings = town.getBuildings().attributes;
		for (let build of Object.keys(this.towns_buildings[town_id])) {
			if (this.towns_buildings[town_id][build] != buildings[build]) {
				return false;
			}
		}
		return true;
	};

	/* */
	getNextBuild = async (town_id) => {
		let town = ITowns.towns[town_id];

		/* livello attuale */
		let buildings = { ...town.getBuildings().attributes };

		/* Add the the list the current building progress */
		for (let order of town.buildingOrders().models) {
			if (order.attributes.tear_down) {
				buildings[order.attributes.building_type] -= 1;
			} else {
				buildings[order.attributes.building_type] += 1;
			}
		}
		/* livello in cui deve arrivare */
		let target = this.towns_buildings[town_id];

		/* Check if the building is duable, if yes build it and return true, else false  */
		const check = async (build, level) => {
			/* if the given is an array, randomically try all of the array */
			if (Array.isArray(build)) {
				build.sort(() => Math.random() - 0.5);
				for (let el of build) {
					if (await check(el, level)) return true;
				}
				return false;
			}
			if (target[build] <= buildings[build]) return false;
			else if (buildings[build] < level) {
				await this.postBuild(build, town_id);
				return true;
			}
			return false;
		};

		const tearCheck = async (build) => {
			if (Array.isArray(build)) {
				build.sort(() => Math.random() - 0.5);
				for (let el of build) {
					if (await tearCheck(el)) return true;
				}
				return false;
			}
			if (target[build] < buildings[build]) {
				await this.postTearDown(build, town_id);
				return true;
			}
			return false;
		};

		/* IF the docks is not build yet, then follow the tutorial */
		if (buildings.docks < 1) {
			if (await check('lumber', 3)) return;
			if (await check('stoner', 3)) return;
			if (await check('farm', 4)) return;
			if (await check('storage', 4)) return;
			if (await check('temple', 3)) return;
			if (await check('ironer', 3)) return;
			if (await check('main', 5)) return;
			if (await check('barracks', 5)) return;
			if (await check('storage', 5)) return;
			if (await check('stoner', 6)) return;
			if (await check('lumber', 6)) return;
			if (await check('ironer', 6)) return;
			if (await check('main', 8)) return;
			if (await check('farm', 8)) return;
			if (await check('market', 6)) return;
			if (await check('storage', 8)) return;
			if (await check('academy', 7)) return;
			if (await check('temple', 5)) return;
			if (await check('farm', 15)) return;
		}

		/* Resouces */
		// WALLS!
		if (await check(['storage', 'main'], 25)) return;
		if (await check('hide', 10)) return;
		if (await check(['lumber', 'stoner', 'ironer'], 15)) return;
		if (await check(['docks', 'barracks'], 10)) return;
		if (await check('wall', 25)) return;
		if (await check(['academy', 'farm'], 36)) return;
		// terme
		if (await check(['docks', 'barracks', 'market'], 20)) return;
		if (await check('farm', 45)) return;
		if (await check(['docks', 'barracks', 'market'], 30)) return;
		if (await check(['lumber', 'stoner', 'ironer'], 40)) return;
		if (await check('temple', 30)) return;

		/* Demolish */
		let lista = [
			'lumber',
			'stoner',
			'ironer',
			'docks',
			'barracks',
			'market',
			'temple',
			'academy',
			'farm',
			'hide',
			'storage',
			'wall',
		];
		if (await tearCheck(lista)) return;
		if (await tearCheck('main')) return;
	};
}
