// ==UserScript==
// @name         GREPO_RitualAutoSpell_Autopolis
// @version      0.2
// @description  Send spell automatically on requested polis
// @author       Sau1707
// @include      https://*.grepolis.com/game/*
// ==/UserScript==

(function() {
    'use strict';
    const polis = []; //BB code
    const dTime = []; // distance in oplite with meteorogy
    const self_polis = "";
    
    const debug = true;
    const ammount = 18;

    var counter = Array.from({length: polis.length}, (_, i) => 0);
    var loop, active;

    function indexOfSmallest(a) {
        var lowest = 0;
        for (var i = 1; i < a.length; i++) {
            if (a[i] < a[lowest]) lowest = i;
        }
        return lowest;
    }

    function removeClock() {
        for (let i = 0; i < counter.length; i++) {
            counter[i]--;
        }
    }

    function sendCast(id) {
        var data = {"model_url":"CastedPowers","action_name":"cast","arguments":{"power_id":"patroness","target_id":id}};
        if (debug) {
            console.log("Sent to:" + id);
            console.log(counter);
        } else {
            gpAjax.ajaxPost("frontend_bridge", "execute", data);
        }
    }

// It create the red button
setTimeout(function() {
        var toolbar = document.getElementsByClassName("tb_activities toolbar_activities")[0];
        var box = toolbar.getElementsByClassName("middle")[0];
        var btdiv = document.createElement("div");
        btdiv.className = "activity";
        btdiv.id = "btbutton"
        btdiv.style.filter = "brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)";
        var ptimer = document.createElement("p");
        ptimer.id = "ptimer";
        ptimer.style = "z-index: 6; top: -8px; float: center; position: relative; font-weight:bold";
        //trigger button function
        box.appendChild(btdiv);
        btdiv.appendChild(ptimer);

        btdiv.onclick = function() {
            if (active) {
                btdiv.style.filter = "brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)";
                active = false;
                ptimer.innerHTML = "";
                clearInterval(loop)
            }
            else {
                btdiv.style.filter = "brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)";
                active = true;
                console.log("Active");
                loop = setInterval(main, 1000);
            }
        }
    }, 4000);


    function main() {
        removeClock();
        if (ITowns.player_gods.attributes.athena_favor >= 60) {
            var idx = indexOfSmallest(counter);
            if (counter[idx] < 0) {
                sendCast(polis[idx]);
                counter[idx] = parseInt(dTime[idx]/18 + 2);
            } else if (ITowns.player_gods.attributes.athena_favor >= 250) {
                if (ITowns.towns[self_polis].getAvailablePopulation() > 1000) {
                    sendCast(self_polis);
                }
            }
        }
    }
})();
