// ==UserScript==
// @name		GREPO_AutoBootcamp
// @author      Leonardo
// @description Piccole aggiunte
// @include		https://*.grepolis.com/game/*
// ==/UserScript==

(function() {
    'use strict';

    function attackBootcamp() {
        var attack_possible = document.getElementsByClassName("attack_spot attack_possible")[0];
        if (attack_possible != null) {
            // check if there isn't already an active attack
            if (MM.getModels().MovementsUnits != null) {
                if (Object.keys(MM.getModels().MovementsUnits).length > 0) {
                    var attack_list = Object.keys(MM.getModels().MovementsUnits)
                    for (var i = 0; i < Object.keys(MM.getModels().MovementsUnits).length; i++) {
                        if (MM.getModels().MovementsUnits[attack_list[i]].attributes.destination_is_attack_spot) return false;
                        if (MM.getModels().MovementsUnits[attack_list[i]].attributes.origin_is_attack_spot) return false;
                    }
                }
            }
            // else send the attack with everything in polis
            var units = ITowns.towns[Game.townId].units()
            delete units.militia
            var model_url = "PlayerAttackSpot/" + Game.player_id
            var data = {"model_url":model_url,"action_name":"attack","arguments":units,"town_id":Game.townId6}
            gpAjax.ajaxPost("frontend_bridge", "execute", data);
            return true;
        } else {
            return false;
        }
    }


    function rewardBootcamp() {
        var attack_possible = document.getElementsByClassName("attack_spot collect_reward")[0];
        if (attack_possible != null) {
            var units = ITowns.towns[Game.townId].units()
            var model_url = "PlayerAttackSpot/" + Game.player_id
            var data = {"model_url":model_url,"action_name":"stashReward","arguments":{},"town_id":Game.townId6}
            gpAjax.ajaxPost("frontend_bridge", "execute", data, 0, {error : function() {
                var data = {"model_url":"PlayerAttackSpot/1970864","action_name":"useReward","arguments":{},"town_id":Game.townId6}
				gpAjax.ajaxPost("frontend_bridge", "execute", data);
				}});
            return true;
        } else {
            return false;
        }
    }


    setInterval(function() {
        if (attackBootcamp()) return;
        if (rewardBootcamp()) return;
    }, 5000);


    // Your code here...
})();
