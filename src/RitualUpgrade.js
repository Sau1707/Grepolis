(function() {
    'use strict';
    // Send post request to the server, to upgrade the rural
    function upgrade(polisID, farmTownPlayerID, ruralID) {
        let data = {"model_url":"FarmTownPlayerRelation/"+farmTownPlayerID,"action_name":"upgrade","arguments":{"farm_town_id":ruralID},"town_id":polisID};
        gpAjax.ajaxPost("frontend_bridge", "execute", data);
    }

    // send post request to the server, to onlick the rural
    function unlock(polisID, farmTownPlayerID, ruralID) {
        let data = {"model_url":"FarmTownPlayerRelation/"+farmTownPlayerID,"action_name":"unlock","arguments":{"farm_town_id":ruralID},"town_id":polisID};
        gpAjax.ajaxPost("frontend_bridge", "execute", data);
    }

    // get the active polis and upgrade the rural on that island
    function UpgradeAll() {
        let polisID = Game.townId;
        let islandX = ITowns.towns[Game.townId].getIslandCoordinateX();
        let islandY = ITowns.towns[Game.townId].getIslandCoordinateY();
        let size = MM.getCollections().FarmTown[0].models["length"];
        for (let i = 0; i < size; i++) {
            let isX = MM.getCollections().FarmTown[0].models[i].attributes.island_x;
            let isY = MM.getCollections().FarmTown[0].models[i].attributes.island_y;
            if (islandX == isX && islandY == isY) {
                let ruralID = MM.getCollections().FarmTown[0].models[i].id;
                for (let k = 0; k < size; k++) {
                    if (ruralID == MM.getCollections().FarmTownPlayerRelation[0].models[k].getFarmTownId()) {
                        let farmTownPlayerID = MM.getCollections().FarmTownPlayerRelation[0].models[k].id;
                        if (MM.getCollections().FarmTownPlayerRelation[0].models[k].attributes.relation_status == 0) {
                            unlock(polisID, farmTownPlayerID, ruralID);
                        }
                        if (MM.getCollections().FarmTownPlayerRelation[0].models[k].attributes.expansion_stage < 6) {
                            if (MM.getCollections().FarmTownPlayerRelation[0].models[k].attributes.expansion_at == null) {
                                upgrade(polisID, farmTownPlayerID, ruralID);
                            }
                        }
                    }
                }
            }
        }
    }

    // add the button
    $(document).ajaxComplete(function() {
        var autobutton = document.getElementById("auto_butt");
        if (autobutton == null) {
            var rural = document.getElementsByClassName("island_info_towns island_info_right")[0];
            if (rural != null) {
                var border = rural.getElementsByClassName("game_border")[0];
                if (autobutton == null) { //generate the button if not exist
                    var butt = document.createElement("div");
                    butt.className = "button_new";
                    butt.id = "auto_butt";
                    butt.style = "float: right; margin: 0px;";
                    butt.innerHTML = '<div class=\"left\"></div>\n\t\t<div class=\"right\"></div>\n\t\t<div class=\"caption js-caption\"> Upgrade All <div class=\"effect js-effect\"></div></div>';
                    border.insertBefore(butt, border.childNodes[0]);
                }
            }
        }
    })

    // add action to the button
    $(document).on("click","#auto_butt", function() {
        UpgradeAll();
    });

    // Print in console that the script is loaded
    console.log("Auto Upgrade Button Loaded")
})();
