// ==UserScript==
// @name         AutoMulti
// @author       Sau1707
// @description  Automatize the basic actions
// @version      1.1.1
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @icon         https://raw.githubusercontent.com/Sau1707/MultiHandler/main/images/logo.png?token=GHSAT0AAAAAAB4P65M7DS637MJJKBBWNWVQZCO23IA
// ==/UserScript==

(function() {
    'use strict';

    var uw;
    if (typeof unsafeWindow == 'undefined') uw = window;
    else uw = unsafeWindow;

    const get_finisched_tasks = () => {
        const { Progressable } = uw.MM.getCollections()
        const { models } = Progressable[0]
        let finisched = []
        for (let model of models) {
            let {attributes } = model
            if (attributes.state !== "satisfied") continue
            finisched.push(attributes)
        }
        return finisched
    }

    const claim_reward = (reward) => {
        const data = {
            "model_url":`Progressable/${reward.id}`,
            "action_name":"progressTo",
            "arguments": {
                "progressable_id":reward.progressable_id,
                "state":"closed"
            }
        }

        uw.gpAjax.ajaxPost("frontend_bridge", "execute", data)
    }

    const set_hera = (town_id) => {
        const data = {
            "god_id":"hera",
            "town_id":town_id
        }
        uw.gpAjax.ajaxPost("building_temple", "change_god", data)
    }


    const cast_spell = (town_id) => {
        const data = {
            "model_url":"CastedPowers",
            "action_name":"cast",
            "arguments": {
                "power_id":"wedding",
                "target_id":town_id
            },
        }
        uw.gpAjax.ajaxPost("frontend_bridge", "execute", data)
    }

    function main() {
        /* Add town in the build list if not present yet */
        for (let town of Object.values(uw.ITowns.towns)) {
            if (typeof(uw.modernBot) === "undefined") break;
            if (town.id in uw.modernBot.autoBuild.towns_buildings) continue;
            uw.modernBot.autoBuild.towns_buildings[town.id] = {
                main:25,
                storage:35,
                farm:45,
                academy:30,
                temple:30,
                barracks:5,
                docks:30,
                market:30,
                hide:10,
                lumber:40,
                stoner:40,
                ironer:40,
                wall:0
            }
        }
        
        const town = uw.ITowns.getCurrentTown();
        const {wood, iron, stone, storage} = town.resources()
        const margin = 50

        // Check for hera assignment
        if (Object.keys(uw.ITowns.towns).length === 1) {
            const {hera_favor} = uw.ITowns.player_gods.attributes

            // try to cast spell when possible
            if (hera_favor > 30 && wood + margin < storage && iron + margin < storage && stone + margin < storage) {
                cast_spell(town.id)
            }

            const buildings = town.buildings()
            const {temple} = buildings.attributes
            if (temple > 0 && !town.god()) {
                set_hera(town.id)
                console.log("missing_god")
            }
        }


        const missions = get_finisched_tasks();

        for (let mission of missions) {
            let {rewards} = mission.static_data
            for (let reward of rewards) {
                let {type, data} = reward

                if (type === "resources") {

                    if (data.wood + wood + margin > storage) continue
                    if (data.iron + iron + margin > storage) continue
                    if (data.stone + stone + margin > storage) continue
                    claim_reward(mission)
                    console.log("claim", mission)
                    return
                }

                if (type === "units" || type == "favor") {
                    claim_reward(mission)
                    console.log("claim", mission)
                    return
                }

                if (type === "power") {
                    let {power_id} = reward
                    if (power_id === "population_boost" || power_id === "coins_of_wisdom") {
                        claim_reward(mission)
                        return
                    }
                }
            }
        }
    }

    setInterval(main, 5000)
})();
