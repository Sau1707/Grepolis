// ==UserScript==
// @name		GREPO_Dionysia_AUTO2
// @author      Sau1707
// @version     0.0.1
// @description
// @match		https://*.grepolis.com/game/*
// ==/UserScript==


(function() {
    'use strict';
    const uw = unsafeWindow ? unsafeWindow : window;
    const missionsUnits = [null, "dryads", "high_priests","kanephoroi", "phallophoros", "panes", "silens"];
    const equipment = {
        brushes: {id: "high_priests", count: 20},
        donkey: {id: "phallophoros", count: 15},
        knives: {id: "silens", count: 7},
        bullock_carts: {id: "panes", count: 6},
        leopard: {id: "dryads", count: 8},
        goats: {id: "kanephoroi", count: 3}
    }

    var units = {}

    /* Return current mission status data */
    async function getEventData() {
        const queryData = {"window_type":"missions","tab_type":"collection","known_data":{"models":["PlayerLedger"],"collections":["PlayerHints"],"templates":["missions__collection","missions__collect_reward","missions__rewards_list","missions__rewards_list_reward","missions__tutorial","missions__ranking","missions__ranking_rewards","missions__overall_ranking"]},"arguments":{"window_skin":"missions_dionysia"}}
        let dataJson;
        await uw.gpAjax.ajaxGet("frontend_bridge", "fetch", queryData,!0, (g, p) => {
            dataJson = g.models.MissionStatus.data;
        })
        return dataJson;
    }

    /* Fetch and get current mission data */
    async function getMissionData() {
        const queryData = {"window_type":"missions","tab_type":"index","known_data":{"models":["PlayerLedger","MissionsPlayerArmy","MissionStatus","MissionReport"],"collections":["Towns","Benefits"],"templates":["missions__index","missions__mission","missions__mission_running","missions__details","missions__info","missions__send_units","missions__unit_picker","missions__progress","missions__mission_result","missions__buy_unit","missions__indicator_tooltip","missions__unit_card"]},"arguments":{"window_skin":"missions_dionysia"}}
        let dataJson;
        await uw.gpAjax.ajaxGet("frontend_bridge", "fetch", queryData,!0, (g, p) => {
            dataJson = g.collections.Missions.data;
        })
        return dataJson;
    }

    /* Return ammount of troops */
    function getUnitCount() {
        let units = document.getElementsByClassName("missions_unit")
        if (!units) return {}
        let unitCount = {}
        for (let unit of units) {
            let box = unit.getElementsByClassName("unit")[0];
            let type = box.getAttribute("data-unit_id")
            let count = box.firstChild.nextSibling.innerText;
            unitCount[type] = parseInt(count);
        }
        return unitCount;
    }

    /* Return main unit of a mission */
    function getMainUnit(option) {
        return missionsUnits[option.mission_number]
    }

    /* Return unit of mission + ammount */
    function getMissionUnits(mission) {
        let ret = {}
        let units = getUnitCount();
        let mainAmmount = mission.units_required;
        let mainType = getMainUnit(mission);
        let equimentType = equipment[mission.equipment].id;
        let equimentAmmount = parseInt(mainAmmount / equipment[mission.equipment].count) + 1;

        ret[mainType] = mainAmmount;
        ret[equimentType] = equimentAmmount;
        return ret;
    }

    /* Attack a mission */
    function postMission(id, units) {
        let data = {
            model_url:"Missions",
            action_name:"startMission",
            arguments:{"mission_id":id,"params":units}
        }
        uw.gpAjax.ajaxPost("frontend_bridge", "execute", data);
    }


    /* return true if the mission is duable else false */
    function isDuable(option) {
        let count = getMissionUnits()
        console.log(count);
        return true;
    }


    /* return the best mission, none if all impossible */
    function selectMission(option1, option2) {
        /* Check that both missions can be done, esle return */
        if (!isDuable(option1) && !isDuable(option2)) return null
        if (!isDuable(option1)) return option2
        if (!isDuable(option2)) return option1

        /* First, use mission with more units */
        if (units[getMainUnit(option1)] > units[getMainUnit(option2)]) return option1
        else return option2
    }


    /* Main function */
    async function main() {
        let data = await getEventData();
        if (data.cooldown_time > 0) {
            /* Handle waiting time */
            console.log("waiting TODO")
            return;
        }

        let missions = await getMissionData();
        if (missions.length == 1) {
            /* Stop loop until it's done*/
            return;
        }
        console.log(missions);
        return;
        if (missions.length == 2) {
            let mission = selectMission(missions[0].d, missions[1].d);
            console.log(mission);
            return;
            let missionUnits = getMissionUnits(mission);
            postMission(mission.id, missionUnits);
        }
    }

    /* Add element to the window when open */
    uw.$(document).ajaxComplete(function() {
        /* Check if window is open */
        let dionysiaWindow = document.getElementsByClassName("missions_dionysia classic_window")[0]
        if (!dionysiaWindow) return;

        /* Get player units - or update them */
        let unitsWindow = document.getElementsByClassName("missions_list missions_dionysia")[0];
        if (!unitsWindow) return;
        units = getUnitCount();

        /* Apply green filter to show bot is on */
        document.getElementById("happening_large_icon").style.filter = "brightness(100%) sepia(100%) hue-rotate(90deg) saturate(700%) contrast(0.8)";
        main();
    })
})();
