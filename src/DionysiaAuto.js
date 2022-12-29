// ==UserScript==
// @name		GREPO_Dionysia_AUTO
// @author      Sau1707
// @version     0.0.1
// @description
// @match		https://*.grepolis.com/game/*
// ==/UserScript==


// close gui document.getElementsByClassName("mission_result missions_dionysia success")[0].getElementsByClassName("btn_close button button_new")[0].click();
(function() {
    'use strict';
    const uw = unsafeWindow;
    const missions = {
        mission_type_escort: [null, null, null, null, null, "panes", "silens"],
        mission_type_search: [null, "dryads", "high_priests", null, null, null, null],
        mission_type_hunt: [null, null, null, "kanephoroi", "phallophoros", null, null],
    }
    const equipment = { // done
        brushes: {id: "high_priests", count: 20},
        donkey: {id: "phallophoros", count: 15},
        knives: {id: "silens", count: 7},
        bullock_carts: {id: "panes", count: 6},
        leopard: {id: "dryads", count: 8},
        goats: {id: "kanephoroi", count: 3}
    }

    /* Fetach the backend and return data */
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


    /* Select the mission and open gui */
    function openMissionGUI(id, units) {
        if (document.hasFocus()) {
            document.getElementsByClassName(`mission_${id}`)[0].click()
            document.getElementsByClassName("btn_send_units button button_new")[0].click()
            let nodes = document.getElementsByClassName("txt_unit textbox")
            window.focus();
            setTimeout(() => {
                for (let node of nodes) {
                    let unit = node.getAttribute("data-unit_id")
                    let input = node.getElementsByTagName("input")[0]
                    input.focus();
                    input.value = units[unit] ? units[unit] : 0;
                    input.blur();
                }
                setTimeout(() => document.getElementsByClassName("btn_send_units")[1].click(), 500);
            }, 200)

        } else {
            let data = {
                model_url:"Missions",
                action_name:"startMission",
                arguments:{"mission_id":id,"params":units}
            }
            uw.gpAjax.ajaxPost("frontend_bridge", "execute", data);
        }

    }

    function getMainUnit(option) {
        let target = missions[option.type][option.mission_number];
        if (target == null) console.log(option);
        return target
    }

    /* get the best mission*/
    function selectMission(option1, option2) {
        let units = getUnitCount();

        let target;
        if (Math.round(Math.random())) target = option1;
        else target = option2;

        let count = getMissionUnits(target);
        openMissionGUI(target.id, count);
    }

    async function main() {
        let missions = await getMissionData();
        if (missions.length == 2) selectMission(missions[0].d, missions[1].d);
    }

    /* Add element to the window when open */
    uw.$(document).ajaxComplete(function() {
        /* Check fi window is open */
        let dionysiaWindow = document.getElementsByClassName("missions_dionysia classic_window")[0]
        if (!dionysiaWindow) return;
        /* Close mission finisch button and got to page */
        let missionFinisch = document.getElementsByClassName("mission_result missions_dionysia success")[0];
        if (missionFinisch) {
            missionFinisch.getElementsByClassName("btn_close button button_new")[0].click();
            setTimeout(() => {dionysiaWindow.getElementsByClassName("tab index")[0].click()}, 1000)
        }

        /* Start boot when player click gui */
        let indexSecttion = dionysiaWindow.getElementsByClassName("tab index")[0]
        if (!indexSecttion) {
            return;
        }
        indexSecttion.addEventListener("click", () => {
            setTimeout(() => {main()}, 1000)
        });
    })
})();
