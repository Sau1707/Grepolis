var style = document.createElement("style");
style.textContent = `.auto_build_up_arrow{background:url(https://gpit.innogamescdn.com/images/game/academy/up.png) no-repeat -2px -2px;width:18px;height:18px;position:absolute;right:-2px;bottom:12px;transform:scale(.8);cursor:pointer}.auto_build_down_arrow{background:url(https://gpit.innogamescdn.com/images/game/academy/up.png) no-repeat -2px -2px;width:18px;height:18px;position:absolute;right:-2px;bottom:-3px;transform:scale(.8) rotate(180deg);cursor:pointer}.auto_build_box{background:url(https://gpit.innogamescdn.com/images/game/academy/tech_frame.png) no-repeat 0 0;width:58px;height:59px;position:relative;overflow:hidden;display:inline-block;vertical-align:middle}.auto_build_building{position:absolute;top:4px;left:4px;width:50px;height:50px;background:url(https://gpit.innogamescdn.com/images/game/main/buildings_sprite_50x50.png) no-repeat 0 0}.auto_build_lvl{position:absolute;bottom:3px;left:3px;margin:0;font-weight:700;font-size:12px;color:#fff;text-shadow:0 0 2px #000,1px 1px 2px #000,0 2px 2px #000}#buildings_lvl_buttons{padding:5px;max-height:400px;user-select:none}.progress_bar_auto{position:absolute;z-index:1;height:100%;left:0;top:0;background-image:url(https://gpit.innogamescdn.com/images/game/border/header.png);background-position:0 -1px;filter:brightness(100%) saturate(186%) hue-rotate(241deg)}.modern_bot_settings{z-index:10;position:absolute;top:52px!important;right:116px!important}.console_modernbot{width:100%;height:100%;background-color:#000;color:#fff;font-family:monospace;font-size:16px;padding:20px;box-sizing:border-box;overflow-y:scroll;display:flex;flex-direction:column-reverse}#MODERN_BOT_content{height:100%}.console_modernbot p{margin:1px}`;
document.head.appendChild(style);

class ModernUtil {
	/* Usage async this.sleep(ms) -> stop the code for ms */
	sleep = (ms) => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	/* Save content in localstorage */
	save(id, content) {
		localStorage.setItem(`${id}_${Game.world_id}`, content);
	}

	/* Load from localstorage, return null if don't exist */
	load(id) {
		let savedVersion = localStorage.getItem(`${id}_${Game.world_id}`);
		if (savedVersion === 'true') return true;
		if (savedVersion === 'false') return false;
		if (typeof savedVersion === 'string') {
			return savedVersion;
		}
		if (savedVersion) return JSON.parse(savedVersion);
		else return null;
	}

	/* Return html of the button */
	getButtonHtml(id, text, fn, props) {
		let name = this.constructor.name.charAt(0).toLowerCase() + this.constructor.name.slice(1);
		if (isNaN(parseInt(props))) {
			props = `'${props}'`;
		}
		let click = `window.${name}.${fn.name}(${props ? props : ''})`;

		return `
        <div id="${id}" style="cursor: pointer" class="button_new" onclick="${click}">
            <div class="left"></div>
            <div class="right"></div>
            <div class="caption js-caption"> ${text} <div class="effect js-effect"></div></div>
        </div>`;
	}

	/* Return html of the title */
	getTitleHtml(id, text, fn, props, enable, desc = '(click to toggle)') {
		let name = this.constructor.name.charAt(0).toLowerCase() + this.constructor.name.slice(1);
		if (isNaN(parseInt(props)) && props) {
			props = `"${props}"`;
		}
		let click = `window.${name}.${fn.name}(${props ? props : ''})`;
		let filter = 'brightness(100%) saturate(186%) hue-rotate(241deg)';

		return `
        <div class="game_border_top"></div>
        <div class="game_border_bottom"></div>
        <div class="game_border_left"></div>
        <div class="game_border_right"></div>
        <div class="game_border_corner corner1"></div>
        <div class="game_border_corner corner2"></div>
        <div class="game_border_corner corner3"></div>
        <div class="game_border_corner corner4"></div>
        <div id="${id}" style="cursor: pointer; filter: ${
			enable ? filter : ''
		}" class="game_header bold" onclick="${click}"> ${text} <span class="command_count"></span>
            <div style="position: absolute; right: 10px; top: 4px; font-size: 10px;"> ${desc} </div>
        </div>
        `;
	}

	/* 
        GET REQUEST TO THE SERVER
    */

	/* 
        POST REQUEST TO THE SERVER
    */
	/* Send post request to the server to get resourses */
	claim(polisList) {
		let data = {
			towns: polisList,
			time_option_base: 300,
			time_option_booty: 600,
			claim_factor: 'normal',
		};
		gpAjax.ajaxPost('farm_town_overviews', 'claim_loads_multiple', data);
	}

	useBootcampReward() {
		var data = {
			model_url: `PlayerAttackSpot/${Game.player_id}`,
			action_name: 'useReward',
			arguments: {},
		};
		gpAjax.ajaxPost('frontend_bridge', 'execute', data);
	}

	stashBootcampReward() {
		var data = {
			model_url: `PlayerAttackSpot/${Game.player_id}`,
			action_name: 'stashReward',
			arguments: {},
		};
		gpAjax.ajaxPost('frontend_bridge', 'execute', data, 0, {
			error: this.useBootcampReward,
		});
	}

	tradeRuralPost = (farm_town_id, relation_id, count, town_id) => {
		if (count < 100) return;
		let data = {
			model_url: `FarmTownPlayerRelation/${relation_id}`,
			action_name: 'trade',
			arguments: { farm_town_id: farm_town_id, amount: count > 3000 ? 3000 : count },
			town_id: town_id,
		};
		gpAjax.ajaxPost('frontend_bridge', 'execute', data);
	};

	unlockRural = (town_id, farm_town_id, relation_id) => {
		let data = {
			model_url: `FarmTownPlayerRelation/${relation_id}`,
			action_name: 'unlock',
			arguments: {
				farm_town_id: farm_town_id,
			},
			town_id: town_id,
		};
		gpAjax.ajaxPost('frontend_bridge', 'execute', data);
	};

	upgradeRural = (town_id, farm_town_id, relation_id) => {
		let data = {
			model_url: `FarmTownPlayerRelation/${relation_id}`,
			action_name: 'upgrade',
			arguments: {
				farm_town_id: farm_town_id,
			},
			town_id: town_id,
		};
		console.log(data);
		gpAjax.ajaxPost('frontend_bridge', 'execute', data);
	};
}

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

/* 
    TODO:   
    - Autotrade: fix rurali non ti appartiene, materie prime che possiedi + log in console
    - AutoRuralLevel: still to implement
    - AutoFarm: check for time to start
*/
class AutoFarm extends ModernUtil {
	constructor() {
		super();
		/* Settings Autofarm */
		this.delta_time = 5000;
		this.farm_timing = this.load('enable_autofarm_level') || 1;
		if (this.load('enable_autofarm')) this.triggerAutoFarm();

		/* Settings auto_rurals */
		this.rural_level = this.load('enable_autorural_level') || 1;
		this.rural_percentual = this.load('enable_autofarm_percentuals') || 3;
		if (this.load('enable_autorural_level_active')) this.triggerAutoRuralLevel();
	}

	/* Called when the settings is fired, render the page */
	renderSettings = () => {
		requestAnimationFrame(() => {
			this.setRuralLevel(this.rural_level);
			this.setAutoFarmLevel(this.farm_timing);
			this.setAutoFarmPercentual(this.rural_percentual);
		});

		// ${this.getButtonHtml('farming_lvl_4', '20 min', this.setAutoFarmLevel, 4)}
		// ${this.getButtonHtml('farming_lvl_8', '40 min', this.setAutoFarmLevel, 8)}

		return `
        <div class="game_border" style="margin-bottom: 20px">
            ${this.getTitleHtml(
				'auto_farm',
				'Auto Farm',
				this.triggerAutoFarm,
				'',
				this.enable_auto_farming,
			)}

            <div style="display: inline-flex">
            <div id="farming_lvl_buttons" style="padding: 5px; margin-right: 398px">
                ${this.getButtonHtml('farming_lvl_1', '5 min', this.setAutoFarmLevel, 1)}
                ${this.getButtonHtml('farming_lvl_2', '10 min', this.setAutoFarmLevel, 2)}
            </div>
            <div id="rural_lvl_percentuals" style="padding: 5px">
                ${this.getButtonHtml('rural_percentuals_1', '80%', this.setAutoFarmPercentual, 1)}
                ${this.getButtonHtml('rural_percentuals_2', '90%', this.setAutoFarmPercentual, 2)}
                ${this.getButtonHtml('rural_percentuals_3', '100%', this.setAutoFarmPercentual, 3)}
            </div>
            </div>    
        </div> 

        <div class="game_border" style="margin-bottom: 20px;">
                ${this.getTitleHtml(
					'auto_rural_level',
					'Auto Rural level',
					this.triggerAutoRuralLevel,
					'',
					this.enable_auto_rural,
				)}
            
            <div id="rural_lvl_buttons" style="padding: 5px">
                ${this.getButtonHtml('rural_lvl_1', 'lvl 1', this.setRuralLevel, 1)}
                ${this.getButtonHtml('rural_lvl_2', 'lvl 2', this.setRuralLevel, 2)}
                ${this.getButtonHtml('rural_lvl_3', 'lvl 3', this.setRuralLevel, 3)}
                ${this.getButtonHtml('rural_lvl_4', 'lvl 4', this.setRuralLevel, 4)}
                ${this.getButtonHtml('rural_lvl_5', 'lvl 5', this.setRuralLevel, 5)}
                ${this.getButtonHtml('rural_lvl_6', 'lvl 6', this.setRuralLevel, 6)}
            </div>
        </div>

        <div class="game_border">
            <div class="game_border_top"></div>
            <div class="game_border_bottom"></div>
            <div class="game_border_left"></div>
            <div class="game_border_right"></div>
            <div class="game_border_corner corner1"></div>
            <div class="game_border_corner corner2"></div>
            <div class="game_border_corner corner3"></div>
            <div class="game_border_corner corner4"></div>
            <div class="game_header bold" style="position: relative; cursor: pointer" onclick="window.autoFarm.triggerTradeWithAllRurals()"> 
            <span style="z-index: 10; position: relative;">Auto Trade resouces </span>
            <div id="res_progress_bar" class="progress_bar_auto"></div>
            <div style="position: absolute; right: 10px; top: 4px; font-size: 10px; z-index: 10"> (click to stop) </div>
            <span class="command_count"></span></div>

            <div id="autotrade_lvl_buttons" style="padding: 5px">
                <!-- 1 -->
                ${this.getButtonHtml(
					'autotrade_lvl_1',
					'Iron',
					this.triggerTradeWithAllRurals,
					'iron',
				)}

                ${this.getButtonHtml(
					'autotrade_lvl_2',
					'Stone',
					this.triggerTradeWithAllRurals,
					'stone',
				)}

                ${this.getButtonHtml(
					'autotrade_lvl_3',
					'Wood',
					this.triggerTradeWithAllRurals,
					'wood',
				)}
            </div>
            
        </div>
        `;
	};

	/* generate the list containing 1 polis per island */
	generateList = () => {
		let islands_list = [];
		let polis_list = [];

		let town_list = MM.getOnlyCollectionByName('Town').models;

		for (let town of town_list) {
			if (town.attributes.on_small_island) continue;
			let { island_id, id } = town.attributes;
			if (!islands_list.includes(island_id)) {
				islands_list.push(island_id);
				polis_list.push(id);
			}
		}

		return polis_list;
	};

	/* 
        Autofarm
    */
	triggerAutoFarm = () => {
		const buttonHtml =
			'<div class="divider"id="autofarm_timer_divider" ></div><div onclick="window.autoFarm.triggerAutoFarm()" class="activity" id="autofarm_timer" style="filter: brightness(110%) sepia(100%) hue-rotate(100deg) saturate(1500%) contrast(0.8); background: url(https://i.ibb.co/gm8NDFS/backgound-timer.png); height: 26px; width: 40px"><p id="autofarm_timer_p" style="z-index: 6; top: -8px; position: relative; font-weight: bold;"></p></div>';

		if (!this.enable_auto_farming) {
			$('#auto_farm').css('filter', 'brightness(100%) saturate(186%) hue-rotate(241deg)');
			let btbutton = document.getElementById('autofarm_timer');
			if (btbutton == null) {
				$('.tb_activities, .toolbar_activities').find('.middle').append(buttonHtml);
			}
			this.lastTime = Date.now();
			this.timer = 0; // TODO: check if it's really 0
			this.enable_auto_farming = setInterval(this.mainFarmBot, 1000);
			botConsole.log('Auto Farm -> On');
		} else {
			$('#autofarm_timer').remove();
			$('#autofarm_timer_divider').remove();
			$('#auto_farm').css('filter', '');
			clearInterval(this.enable_auto_farming);
			this.enable_auto_farming = null;
			botConsole.log('Auto Farm -> Off');
		}
		this.save('enable_autofarm', !!this.enable_auto_farming);
	};

	setAutoFarmLevel = (n) => {
		let box = document.getElementById('farming_lvl_buttons');
		let buttons = box.getElementsByClassName('button_new');
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].classList.add('disabled');
		}
		$(`#farming_lvl_${n}`).removeClass('disabled');
		this.farm_timing = n;
		this.save('enable_autofarm_level', n);
	};

	setAutoFarmPercentual = (n) => {
		let box = document.getElementById('rural_lvl_percentuals');
		let buttons = box.getElementsByClassName('button_new');
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].classList.add('disabled');
		}
		$(`#rural_percentuals_${n}`).removeClass('disabled');
		this.rural_percentual = n;
		this.save('enable_autofarm_percentuals', n);
	};

	getNextCollection = () => {
		let models = MM.getCollections().FarmTownPlayerRelation[0].models;
		let lootable_at_values = {};
		for (let model of models) {
			let lootable_time = model.attributes.lootable_at;
			if (lootable_at_values[lootable_time]) {
				lootable_at_values[lootable_time] += 1;
			} else {
				lootable_at_values[lootable_time] = 1;
			}
		}
		let max_value = 0;
		let max_lootable_time = 0;
		for (let lootable_time in lootable_at_values) {
			if (lootable_at_values[lootable_time] > max_value) {
				max_value = lootable_at_values[lootable_time];
				max_lootable_time = lootable_time;
			}
		}
		let seconds = max_lootable_time - Math.floor(Date.now() / 1000);
		if (seconds < 0) return 0;
		return seconds * 1000;
	};

	updateTimer = () => {
		const currentTime = Date.now();
		this.timer -= currentTime - this.lastTime;
		this.lastTime = currentTime;

		var bt = document.getElementById('autofarm_timer_p');
		if (this.timer > 0) bt.innerHTML = parseInt(this.timer / 1000);
		else bt.innerHTML = '0';
	};

	mainFarmBot = () => {
		/* Fix time if out ot timing */
		// let next = this.getNextCollection();
		// if (this.timer + 2 * this.delta_time < next) {
		// 	this.timer = next + Math.floor(Math.random() * this.delta_time);
		// }

		/* Claim resouces of timer has passed */
		if (this.timer < 1) {
			let Polislist = this.generateList();

			/* Check if the percentual has reach */
			let total = {
				wood: 0,
				stone: 0,
				iron: 0,
				storage: 0,
			};

			for (let town_id of Polislist) {
				let town = ITowns.towns[town_id];
				let resources = town.resources();
				total.wood += resources.wood;
				total.stone += resources.stone;
				total.iron += resources.iron;
				total.storage += resources.storage;
			}

			let minResource = Math.min(total.wood, total.stone, total.iron);
			let min_percentual = minResource / total.storage;
			console.log(min_percentual);
			/* If the max percentual it's reached stop and wait for 30 seconds */
			if (this.rural_percentual == 3 && min_percentual > 0.99) {
				this.timer = 30000;
				this.updateTimer();
				return;
			}
			if (this.rural_percentual == 2 && min_percentual > 0.9) {
				this.timer = 30000;
				this.updateTimer();
				return;
			}
			if (this.rural_percentual == 1 && min_percentual > 0.8) {
				this.timer = 30000;
				this.updateTimer();
				return;
			}

			this.claim(Polislist);
			botConsole.log('Claimed all rurals');
			let rand = Math.floor(Math.random() * this.delta_time);
			console.log(rand);
			console.log(this.farm_timing);
			this.timer = this.farm_timing * 300000 + rand;
			console.log(this.timer);
			setTimeout(() => WMap.removeFarmTownLootCooldownIconAndRefreshLootTimers(), 2000);
		}

		/* update the timer */
		this.updateTimer();
	};

	/* 
        Auto rural level
    */
	setRuralLevel = (n) => {
		let box = document.getElementById('rural_lvl_buttons');
		let buttons = box.getElementsByClassName('button_new');
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].classList.add('disabled');
		}
		$(`#rural_lvl_${n}`).removeClass('disabled');
		this.rural_level = n;
		this.save('enable_autorural_level', this.rural_level);
	};

	triggerAutoRuralLevel = () => {
		if (!this.enable_auto_rural) {
			$('#auto_rural_level').css(
				'filter',
				'brightness(100%) saturate(186%) hue-rotate(241deg)',
			);
			this.enable_auto_rural = setInterval(this.mainAutoRuralLevel, 20000);
			botConsole.log('Auto Rural Level -> On');
		} else {
			$('#auto_rural_level').css('filter', '');
			botConsole.log('Auto Rural Level -> Off');
			clearInterval(this.enable_auto_rural);
			this.enable_auto_rural = null;
		}
		this.save('enable_autorural_level_active', !!this.enable_auto_rural);
	};

	mainAutoRuralLevel = async () => {
		let player_relation_models = MM.getOnlyCollectionByName('FarmTownPlayerRelation').models;
		let farm_town_models = MM.getOnlyCollectionByName('FarmTown').models;

		/* Get array with all locked rurals */
		let locked = [];
		player_relation_models.forEach((model) => {
			if (model.attributes.relation_status == 0) locked.push(model.attributes);
		});

		/* Get killpoints */
		let killpoints = MM.getModelByNameAndPlayerId('PlayerKillpoints').attributes;
		let available = killpoints.att + killpoints.def - killpoints.used;
		let unlocked = player_relation_models.length - locked.length;

		/* If some rurals still have to be unlocked */
		if (locked.length > 0) {
			/* The first 5 rurals have discount */
			if (unlocked == 0 && available < 2) return;
			if (unlocked == 1 && available < 8) return;
			if (unlocked == 2 && available < 10) return;
			if (unlocked == 3 && available < 30) return;
			if (unlocked == 4 && available < 50) return;
			if (unlocked >= 5 && available < 100) return;

			let towns = this.generateList();
			for (let town_id of towns) {
				let town = ITowns.towns[town_id];
				let x = town.getIslandCoordinateX(),
					y = town.getIslandCoordinateY();

				for (let farmtown of farm_town_models) {
					if (farmtown.attributes.island_x != x || farmtown.attributes.island_y != y)
						continue;

					for (let relation of locked) {
						if (farmtown.attributes.id != relation.farm_town_id) continue;
						this.unlockRural(town_id, relation.farm_town_id, relation.id);
						botConsole.log(
							`Island ${farmtown.attributes.island_xy}: unlocked ${farmtown.attributes.name}`,
						);
						return;
					}
				}
			}
		} else {
			/* else check each level once at the time */
			let towns = this.generateList();

			for (let level = 1; level < this.rural_level; level++) {
				if (level == 1 && available < 1) return;
				if (level == 2 && available < 5) return;
				if (level == 3 && available < 25) return;
				if (level == 4 && available < 50) return;
				if (level == 5 && available < 100) return;

				for (let town_id of towns) {
					let town = ITowns.towns[town_id];
					let x = town.getIslandCoordinateX(),
						y = town.getIslandCoordinateY();

					for (let farmtown of farm_town_models) {
						if (farmtown.attributes.island_x != x || farmtown.attributes.island_y != y)
							continue;

						for (let relation of player_relation_models) {
							if (farmtown.attributes.id != relation.attributes.farm_town_id)
								continue;
							if (relation.attributes.expansion_at) continue;
							if (relation.attributes.expansion_stage > level) continue;
							this.upgradeRural(
								town_id,
								relation.attributes.farm_town_id,
								relation.attributes.id,
							);
							botConsole.log(
								`Island ${farmtown.attributes.island_xy}: upgraded ${farmtown.attributes.name}`,
							);
							console.log('Upgraded rural');
							return;
						}
					}
				}
			}
		}

		/* Auto turn off when the level is reached */
		this.triggerAutoRuralLevel();
	};

	/* 
        Trade with all rurals
    */
	triggerTradeWithAllRurals = async (resouce) => {
		if (resouce) {
			/* Set button disabled */
			if ($(`#autotrade_lvl_${i}`).hasClass('disabled')) return;
			[1, 2, 3, 4].forEach((i) => {
				$(`#autotrade_lvl_${i}`).addClass('disabled').css('cursor', 'auto');
			});
			this.trade_resouce = resouce;

			/* Set the current trade to polis at index 0 */
			this.total_trade = Object.keys(ITowns.towns).length;
			this.done_trade = 0;

			/* Set the interval */
			this.auto_trade_resouces_loop = setInterval(this.mainTradeLoop, 1500);
		} else {
			/* Clear the interval */
			clearInterval(this.auto_trade_resouces_loop);

			/* Re-enable buttons and set progress to 0 */
			$('#res_progress_bar').css('width', 0);
			[1, 2, 3, 4].forEach((i) => {
				$(`#autotrade_lvl_${i}`).removeClass('disabled').css('cursor', 'pointer');
			});
		}
	};

	tradeWithRural = async (polis_id) => {
		let town = ITowns.towns[polis_id];
		if (town.getAvailableTradeCapacity() < 3000) return;
		//if (this.check_for_hide && town.getBuildings().attributes.hide < 10) return;

		let farm_town_models = MM.getOnlyCollectionByName('FarmTown').models;
		let player_relation_models = MM.getOnlyCollectionByName('FarmTownPlayerRelation').models;

		/* Create list with all the farmtown in current island polis */
		let farmtown_in_island = [];
		let x = town.getIslandCoordinateX(),
			y = town.getIslandCoordinateY();
		let resources = town.resources();

		farm_town_models.forEach((farmtown) => {
			if (farmtown.attributes.island_x != x || farmtown.attributes.island_y != y) return;
			if (farmtown.attributes.resource_offer != this.trade_resouce) return;
			if (resources[farmtown.attributes.resource_demand] < 3000) return;

			player_relation_models.forEach((relation) => {
				if (farmtown.attributes.id != relation.attributes.farm_town_id) return;
				//if (relation.attributes.current_trade_ratio < 1.2) return;
				farmtown_in_island.push(relation);
				return;
			});
		});

		for (let tradable of farmtown_in_island) {
			if (town.getAvailableTradeCapacity() < 3000) return;

			this.tradeRuralPost(
				tradable.attributes.farm_town_id,
				tradable.attributes.id,
				town.getAvailableTradeCapacity(),
				town.id,
			);
			await this.sleep(750);
		}
	};

	mainTradeLoop = async () => {
		/* perform trade with current index */
		let towns = Object.keys(ITowns.towns);
		await this.tradeWithRural(towns[this.done_trade]);

		/* update progress bar */
		this.done_trade += 1;
		$('#res_progress_bar').css('width', `${(this.done_trade / this.total_trade) * 100}%`);

		/* If last polis, then trigger to stop */
		if (this.done_trade == this.total_trade) this.triggerTradeWithAllRurals();
	};
}

/* 
    botConsole.log(message);
    ideas:
        - add colors  
*/

class BotConsole {
	constructor() {
		this.string = [];
		this.updateSettings();
	}

	renderSettings = () => {
		setTimeout(() => {
			this.updateSettings();
			let interval = setInterval(() => {
				this.updateSettings();
				if (!$('#modern_console').length) clearInterval(interval);
			}, 1000);
		}, 100);
		return `<div class="console_modernbot" id="modern_console"><div>`;
	};

	log = (string) => {
		const date = new Date();
		const time = date.toLocaleTimeString();
		this.string.push(`[${time}] ${string}`);
	};

	updateSettings = () => {
		let console = $('#modern_console');
		this.string.forEach((e, i) => {
			if ($(`#log_id_${i}`).length) return;
			console.prepend(`<p id="log_id_${i}">${e}</p>`);
		});
	};
}

/* 
    Create a new window
 */
class createGrepoWindow {
	constructor({ id, title, size, tabs, start_tab, minimizable = true }) {
		this.minimizable = minimizable;
		this.width = size[0];
		this.height = size[1];
		this.title = title;
		this.id = id;
		this.tabs = tabs;
		this.start_tab = start_tab;

		/* Private methods */
		const createWindowType = (name, title, width, height, minimizable) => {
			function WndHandler(wndhandle) {
				this.wnd = wndhandle;
			}
			Function.prototype.inherits.call(WndHandler, WndHandlerDefault);
			WndHandler.prototype.getDefaultWindowOptions = function () {
				return {
					position: ['center', 'center', 100, 100],
					width: width,
					height: height,
					minimizable: minimizable,
					title: title,
				};
			};
			GPWindowMgr.addWndType(name, `${name}_75624`, WndHandler, 1);
		};

		const getTabById = (id) => {
			return this.tabs.filter((tab) => tab.id === id)[0];
		};

		this.activate = function () {
			createWindowType(this.id, this.title, this.width, this.height, this.minimizable); //
			$(
				`<style id="${this.id}_custom_window_style">
                 #${this.id} .tab_icon { left: 23px;}
                 #${this.id} {top: -36px; right: 95px;}
                 #${this.id} .submenu_link {color: #000;}
                 #${this.id} .submenu_link:hover {text-decoration: none;}
                 #${this.id} li { float:left; min-width: 60px; }
                 </style>
                `,
			).appendTo('head');
		};

		this.deactivate = function () {
			if (Layout.wnd.getOpenFirst(GPWindowMgr[`TYPE_${this.id}`])) {
				Layout.wnd.getOpenFirst(GPWindowMgr[`TYPE_${this.id}`]).close();
			}
			$(`#${this.id}_custom_window_style`).remove();
		};

		/* open the window */
		this.openWindow = function () {
			let wn = Layout.wnd.getOpenFirst(GPWindowMgr[`TYPE_${this.id}`]);

			/* if open is called but window it's alreay open minimized, maximize that */
			if (wn) {
				if (wn.isMinimized()) {
					wn.maximizeWindow();
				}
				return;
			}

			let content = `<ul id="${this.id}" class="menu_inner"></ul><div id="${this.id}_content"> </div>`;
			Layout.wnd.Create(GPWindowMgr[`TYPE_${this.id}`]).setContent(content);
			/* Add and reder tabs */
			this.tabs.forEach((e) => {
				let html = `
                    <li><a id="${e.id}" class="submenu_link" href="#"><span class="left"><span class="right"><span class="middle">
                    <span class="tab_label"> ${e.title} </span>
                    </span></span></span></a></li>
                `;
				$(html).appendTo(`#${this.id}`);
			});

			/* Add events to tabs */
			let tabs = '';
			this.tabs.forEach((e) => {
				tabs += `#${this.id} #${e.id}, `;
			});
			tabs = tabs.slice(0, -2);
			let self = this;
			$(tabs).click(function () {
				self.renderTab(this.id);
			});
			/* render default tab*/
			this.renderTab(this.tabs[this.start_tab].id);
		};

		this.closeWindow = function () {
			Layout.wnd.getOpenFirst(GPWindowMgr[`TYPE_${this.id}`]).close();
		};

		/* Handle active tab */
		this.renderTab = function (id) {
			let tab = getTabById(id);
			$(`#${this.id}_content`).html(getTabById(id).render());
			$(`#${this.id} .active`).removeClass('active');
			$(`#${id}`).addClass('active');
			getTabById(id).afterRender ? getTabById(id).afterRender() : '';
		};
	}
}

class MixedBot extends ModernUtil {
	constructor() {
		super();

		if (this.load('enable_autobootcamp')) this.triggerAutoBootcamp();
		if (this.load('bootcamp_use_def')) this.triggerUseDef();
	}

	renderSettings = () => {
		requestAnimationFrame(() => {
			if (this.use_def) {
				$('#autobootcamp_off').addClass('disabled');
				$('#autobootcamp_def').removeClass('disabled');
			} else {
				$('#autobootcamp_def').addClass('disabled');
				$('#autobootcamp_off').removeClass('disabled');
			}
		});

		return `
        <div class="game_border" style="margin-bottom: 20px">
            ${this.getTitleHtml(
				'auto_autobootcamp',
				'Auto Bootcamp',
				this.triggerAutoBootcamp,
				'',
				this.enable_auto_bootcamp,
			)}
        
        <div id="autobootcamp_lvl_buttons" style="padding: 5px; display: inline-flex;">
            <!-- temp -->
            <div style="margin-right: 40px">
                ${this.getButtonHtml('autobootcamp_off', 'Only off', this.triggerUseDef)}
                ${this.getButtonHtml('autobootcamp_def', 'Off & Def', this.triggerUseDef)}
            </div>

            ${this.getButtonHtml('autobootcamp_rewards_1', 'Use Rewards', this.triggerAutoBootcamp)}
            ${this.getButtonHtml('autobootcamp_rewards_2', 'Store', this.triggerAutoBootcamp)}
        </div >    
    </div> 
        `;
	};

	/* Call to trigger the usage of the def */
	triggerUseDef = () => {
		this.use_def = !this.use_def;

		if (this.use_def) {
			$('#autobootcamp_off').addClass('disabled');
			$('#autobootcamp_def').removeClass('disabled');
		} else {
			$('#autobootcamp_def').addClass('disabled');
			$('#autobootcamp_off').removeClass('disabled');
		}
		this.save('bootcamp_use_def', this.use_def);
	};

	/* Call to trigger autobootcamp on/off */
	triggerAutoBootcamp = () => {
		if (!this.enable_auto_bootcamp) {
			$('#auto_autobootcamp').css(
				'filter',
				'brightness(100%) saturate(186%) hue-rotate(241deg)',
			);
			this.enable_auto_bootcamp = setInterval(this.mainAutoBootcamp, 4000);
			botConsole.log('Auto Bootcamp -> On');
		} else {
			$('#auto_autobootcamp').css('filter', '');
			clearInterval(this.enable_auto_bootcamp);
			this.enable_auto_bootcamp = null;
			botConsole.log('Auto Bootcamp -> Off');
		}
		console.log(!!this.enable_auto_bootcamp);
		this.save('enable_autobootcamp', !!this.enable_auto_bootcamp);
	};

	/* Main loop for autobootcamp */
	mainAutoBootcamp = () => {
		if (this.rewardBootcamp()) return;
		if (this.attackBootcamp()) return;
	};

	attackBootcamp = () => {
		let cooldown = MM.getModelByNameAndPlayerId('PlayerAttackSpot').getCooldownDuration();
		if (cooldown > 0) return false;

		let movements = MM.getModels().MovementsUnits;

		/* Check if there isn't already an active attack */
		if (movements != null) {
			if (Object.keys(movements).length > 0) {
				var attack_list = Object.keys(movements);
				for (var i = 0; i < Object.keys(movements).length; i++) {
					if (movements[attack_list[i]].attributes.destination_is_attack_spot)
						return false;
					if (movements[attack_list[i]].attributes.origin_is_attack_spot) return false;
				}
			}
		}

		// else send the attack with everything in polis
		var units = { ...ITowns.towns[Game.townId].units() };
		delete units.militia;

		if (!this.use_def) {
			delete units.sword;
			delete units.archer;
		}

		var model_url = 'PlayerAttackSpot/' + Game.player_id;
		var data = {
			model_url: model_url,
			action_name: 'attack',
			arguments: units,
		};
		gpAjax.ajaxPost('frontend_bridge', 'execute', data);
		return true;
	};

	rewardBootcamp = () => {
		let model = MM.getModelByNameAndPlayerId('PlayerAttackSpot');

		/* Stop if level is not found */
		if (!model.getLevel()) {
			botConsole.log('Auto Bootcamp not found');
			this.triggerAutoBootcamp();
			return true;
		}

		let hasReward = model.hasReward();
		if (!hasReward) return false;

		let reward = model.getReward();
		if (reward.power_id.includes('instant') && !reward.power_id.includes('favor')) {
			this.useBootcampReward();
			return true;
		}

		if (reward.stashable) {
			this.stashBootcampReward();
		} else {
			this.useBootcampReward();
		}
		return true;
	};
}

/* Setup autofarm in the window object */

setTimeout(() => {
	unsafeWindow.botConsole = new BotConsole();
	unsafeWindow.autoFarm = new AutoFarm();
	unsafeWindow.autoBuild = new AutoBuild();
	unsafeWindow.mixedBot = new MixedBot();

	let tabs = [
		{
			title: 'Farm',
			id: 'farm',
			render: unsafeWindow.autoFarm.renderSettings,
		},
		{
			title: 'Build',
			id: 'build',
			render: unsafeWindow.autoBuild.renderSettings,
		},
		{
			title: 'Train',
			id: 'train',
			render: () => `
            <ul>
                <li> todo: list polis + troops count </li>
                <li> todo: usa richiamo </li>
                <li> todo: move hero </li>
            </ul>
            `,
		},
		{
			title: 'Trade',
			id: 'trade',
			render: () => `
            `,
		},
		{
			title: 'Mix',
			id: 'mix',
			render: unsafeWindow.mixedBot.renderSettings,
		},
		{
			title: 'Console',
			id: 'console',
			render: unsafeWindow.botConsole.renderSettings,
		},
	];

	unsafeWindow.modernWindow = new createGrepoWindow({
		id: 'MODERN_BOT',
		title: 'ModernBot',
		size: [800, 300],
		tabs: tabs,
		start_tab: 0,
	});

	unsafeWindow.modernWindow.activate();

	$('.gods_area_buttons').append(
		"<div class='btn_settings circle_button settings modern_bot_settings' onclick='window.modernWindow.openWindow()'><div style='filter: grayscale(100%)' class='icon js-caption'></div></div>",
	);

	setTimeout(() => unsafeWindow.modernWindow.openWindow(), 500);
}, 1400);
