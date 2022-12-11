// ==UserScript==
// @name         Auto_Party
// @author       Potusek & Anpu
// @description  Grepolis Report Converter Revolution Tools
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// ==/UserScript==

(function() {
    'use strict';
    //define cost and variables
    const time = 14450;
    var loop;
    var timer = 0;
    var rand;
    var active = false;

    // send post request to the server to start celebration
    function startCelebration() {
        let data = {"celebration_type":"triumph"};
        gpAjax.ajaxPost("town_overviews", "start_all_celebrations", data);
    }

    function getAvailablePB() {
        let att = MM.getModels().PlayerKillpoints[Game.player_id].attributes.att;
        let def = MM.getModels().PlayerKillpoints[Game.player_id].attributes.def;
        let used = MM.getModels().PlayerKillpoints[Game.player_id].attributes.used;
        return used - def - att;
    }

    //handle the timer and get resourses at the right time
    function main() {
        if (timer < 1) {
            timer = time;
            let Polislist = getAvailablePB();
            startCelebration();
        }
        timer -= 1;
        // uodate the timer
        var bt = document.getElementById("partytimer");
        if (timer > 3600) {
            let hour = parseInt(timer/3600);
            let minute = timer - 3600*hour;
            bt.innerHTML = hour + "h";
        } else if (timer > 60) {
            let minute = parseInt(timer/60);
            bt.innerHTML = minute + "h";
        } else if (timer > 0) {
            bt.innerHTML = timer + "s";
        } else {
            bt.innerHTML = "0";
        }
    }

    // add the button on window load
    $(document).ajaxComplete(function() {
        let button = document.getElementById("partyButton");
        if (button == null) {
           let html = '<div class=\"divider\"></div><div class="activity" id="partyButton" style="filter: brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8);"><p id="partytimer" style="z-index: 6; top: -8px; position: relative; font-weight: bold;"></p></div>'
           $('.tb_activities, .toolbar_activities').find(".middle").append(html);
        }
    });

    // set button event
    $(document).on("click","#partyButton", function() {
        if (!active) {
            loop = setInterval(main, 1000);
            $("#partyButton").css("filter","brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)");
        } else {
            clearInterval(loop);
            $("#partyButton").css("filter","brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)");
        }
        active = !active;
    });

    // Print in console that the script is loaded
    console.log("AutoRuralResources.js Loaded")
})();
