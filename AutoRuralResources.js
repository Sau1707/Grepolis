// ==UserScript==
// @name		    GREPO_AutoRuralResources
// @author      Sau1707
// @description Piccole aggiunte
// @include		  https://*.grepolis.com/game/*
// ==/UserScript==



(function() {
    'use strict';
    const time = 620000;
    const delta_time = 5000;

    var loop;
    var timer = 0;
    var rand;
    var active = false;

    function claim(polisList) {
        let data = {"towns":polisList,"time_option_base":300,"time_option_booty":600,"claim_factor":"normal"};
        console.log(data);
        gpAjax.ajaxPost("farm_town_overviews", "claim_loads_multiple", data);
    }

    function main() {
        if (timer < 1) {
            let Polislist = generateList();
            claim(Polislist);
            rand = Math.floor(Math.random() * delta_time);
            timer = time + rand;
        }
        timer -= 1000;
        // uodate the timer
        var bt = document.getElementById("ptimer");
        if (timer > 0) {
            bt.innerHTML = parseInt(timer/1000);
        } else {
            bt.innerHTML = "0";
        }

    }

    function generateList() {
        let islandList = [];
        let polisList = [];
        let length = MM.getCollections().Town[0].models.length;
        for (let i = 0; i < length; i++) {
            if (MM.getCollections().Town[0].models[i].attributes.on_small_island) continue;
            let islandID = MM.getCollections().Town[0].models[i].attributes.island_id;
            let polisID = MM.getCollections().Town[0].models[i].attributes.id;
            if (!islandList.includes(islandID)) {
                islandList.push(islandID);
                polisList.push(polisID);
            }
        }
        return polisList;
    }

    $(window).load(function() {
        let html = '<div class=\"divider\"></div><div class="activity" id="btbutton" style="filter: brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8);"><p id="ptimer" style="z-index: 6; top: -8px; position: relative; font-weight: bold;"></p></div>'
         $('.tb_activities, .toolbar_activities').find(".middle").append(html);
    });

    $(document).on("click","#btbutton", function() {
        if (!active) {
            loop = setInterval(main, 1000);
            $("#btbutton").css("filter","brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)");
        } else {
            clearInterval(loop);
            $("#btbutton").css("filter","brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)");
        }
        active = !active;
    });
})();
