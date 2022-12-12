// ==UserScript==
// @name         GrepoTweaks_AutoRuralResources
// @author       Sau1707
// @description  Claim Automatically the resouces from the rural villages (need capitan to work)
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @version      2.0.0
// ==/UserScript==

function checkForUpdate(id) {
    setTimeout(() => {
        const evt = new CustomEvent(`gt_update_${id}`, {detail: {version: GM_info.script.version}});
        unsafeWindow.dispatchEvent(evt);
    }, 100)
}

(function() {
    'use strict';
    const uw = unsafeWindow;

    /* Check if activate in the grepotweak page */
    if (window.location.href == GM_info.script.matches[2]) {checkForUpdate("autoruralresources");return;}

    /* Define cost and variables */
    const time = 620000 //620000;
    const delta_time = 5000;
    var loop;
    var timer = 0;
    var rand;
    var active = false;
    var lastTime;

    const buttonHtml = '<div class=\"divider\"></div><div class="activity" id="btbutton" style="filter: brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8);"><p id="ptimer" style="z-index: 6; top: -8px; position: relative; font-weight: bold;"></p></div>'
    /* Send post request to the server to get resourses */
    function claim(polisList) {
        let data = {"towns":polisList,"time_option_base":300,"time_option_booty":600,"claim_factor":"normal"};
        uw.gpAjax.ajaxPost("farm_town_overviews", "claim_loads_multiple", data);
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

    /* Handle the timer and get resourses at the right time */
    function main() {
        if (timer < 1) {
            let Polislist = generateList();
            claim(Polislist);
            rand = Math.floor(Math.random() * delta_time);
            timer = time + rand;
        }
        const currentTime = Date.now();
        timer -= currentTime - lastTime;
        lastTime = currentTime;
        // uodate the timer
        var bt = document.getElementById("ptimer");
        if (timer > 0) bt.innerHTML = parseInt(timer/1000);
        else bt.innerHTML = "0";
    }



    /* add the button on window load */
    setTimeout(function() {
        let btbutton = document.getElementById("btbutton");
        if (btbutton == null) uw.$('.tb_activities, .toolbar_activities').find(".middle").append(buttonHtml);
    }, 5000);

    /* Set button event */
    uw.$(document).on("click","#btbutton", function() {
        if (!active) {
            lastTime = Date.now();
            loop = setInterval(main, 1000);
            uw.$("#btbutton").css("filter","brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)");
        } else {
            clearInterval(loop);
            uw.$("#btbutton").css("filter","brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)");
        }
        active = !active;
    });

    /* Print in console that the script is loaded */
    console.log("AutoRuralResources.js Loaded")
})();
