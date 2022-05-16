// ==UserScript==
// @name         Auto_Sentinelle
// @author       Sau1707
// @description  La Più grande donazione a Grepolis
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// ==/UserScript==


// HumanMessage.error("errore")
// HumanMessage.success("ciao")
(function() {
    'use strict';
    var lista_polis = [];
    $.ajax({method:"get", url:"/data/towns.txt"}).done(function(m) {
        try {
            $.each(m.split(/\r\n|\n/), function(C, J) {
             let c = J.split(/,/);
             lista_polis.push(c);
            });
        } catch (C) {
            console.log(C);
        }
     });

    var lista_player = [];
    $.ajax({method:"get", url:"/data/players.txt"}).done(function(m) {
        try {
            $.each(m.split(/\r\n|\n/), function(C, J) {
             let c = J.split(/,/);
             lista_player.push(c);
            });
        } catch (C) {
            console.log(C);
        }
     });

    // send post request to the server to send support
    function sendSentinel(polis) {
        let data = {"sword":3,"id":polis,"type":"support"};
        gpAjax.ajaxPost("town_info", "send_units", data);
    }

    // get all the polis in island
    function getPolis(islandX, islandY) {
        let lista = [];
        let lenght = lista_polis.length - 1;
        while (lenght > 0) {
            if (parseInt(lista_polis[lenght][3]) == parseInt(islandX) && parseInt(lista_polis[lenght][4]) == islandY) {
                lista.push(lista_polis[lenght][0]);
            }
            lenght--;
        }
        return lista;
    }

    // remove polis that doesn't belong to the same alley or pat
    function removeAlley(lista) {
        let removed = []
        let playerAlley = MM.getCollections().AlliancePact[0].models[0].attributes.alliance_1_id;
        for (let i = 0; i < lista.length; i++) { //loop su lista
            for (let j = 0; j < lista_polis.length; j++) { // loop su lista polis
                if (lista_polis[j][0] == lista[i]) { // check if polis is in lista polis
                    let playerID = lista_polis[j][1]; // get the player id of the polis
                    for (let k = 0; k < lista_player.length; k++) { // loop su player id to get alley id
                        if (playerID == lista_player[k][0]) {
                            let alleyID = lista_player[k][2]; // get the alley id
                            console.log(alleyID);
                            if (parseInt(alleyID) != playerAlley) { // stop if player and taeget are in the same alley
                                for (let x = 0; x < MM.getCollections().AlliancePact[0].models.length; x++) { // loop su tutte le alley
                                    if (MM.getCollections().AlliancePact[0].models[x].attributes.alliance_2_id == alleyID) { // check for alley id
                                        if (MM.getCollections().AlliancePact[0].models[x].attributes.relation == "war") {
                                            removed.push(lista[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < removed.length; i++) {
            lista = lista.filter(item => item !== String(removed[i]));
        }
        //MM.getCollections().AlliancePact[0].models[i].attributes.relation = "peace"
        return lista;
    }

     // get polis of the player
    function removePlayerPolis(lista) {
        return lista;
    }

    // remove the polis that already has sentil
    function removeSentinel(lista, type, polis) { //type = 1x, 3x
        let lun = ITowns.all_supporting_units.fragments[polis].models.length;
        for (let i = 0; i < lun; i++) {
            let sword = ITowns.all_supporting_units.fragments[polis].models[i].attributes.sword;
            let archer = ITowns.all_supporting_units.fragments[polis].models[i].attributes.archer;
            if (parseInt(sword) + parseInt(archer) >= type) {
                let id = ITowns.all_supporting_units.fragments[polis].models[i].attributes.current_town_id;
                lista = lista.filter(item => item !== String(id));
            }
        }
        return lista
    }

    // remove the polis that has sentinel in arrival
    function removeSupport(lista, polis) {
        let length = MM.getCollections().MovementsUnits[0].models.length;
        if (length == 0) return lista;
        for (let i = 0; i < length; i++) {
            if (MM.getCollections().MovementsUnits[0].models[i].attributes.home_town_id == polis) {
                for (let j = 0; j < lista.length; j++) {
                    if (MM.getCollections().MovementsUnits[0].models[i].attributes.target_town_id == lista[j]) {
                        lista = lista.filter(item => item !== String(lista[j]));
                    }
                }
            }
        }
        return lista
        // ITowns.all_supporting_units[id]
        // MM.getCollections().Units[1].models
    }

    //sent sentinel to a target
    function sendUnit(polis) {

    }

    // check if sentinel can be sent
    function hasEnoughTroops() {
        // spade o archi
        return false;
    }

    // check if player has polis on island
    function playerHasPolis(lista) {
        let return_list = [];
        let polis_player = [];
        for (let i in ITowns.towns) {
            polis_player.push(i)
        };
        for (let i = 0; i < polis_player.length; i++) {
            for (let j = 0; j < lista.length; j++) {
                if (polis_player[i] == lista[j]) {
                    return_list.push(polis_player[i]);
                }
            }
        }
        return return_list;
    }

    $(document).ajaxComplete(function() {
        let wnds = GPWindowMgr.getOpen(Layout.wnd.TYPE_ISLAND);
        for (let e in wnds) {
            if (wnds.hasOwnProperty(e)) {
                let wndid = wnds[e].getID();
                let coord = $("#gpwnd_"+wndid).find(".islandinfo_coords").text()
                const type = "[0-9][0-9]*/[0-9][0-9]*"
                let coordX = coord.match(type)[0].split("/")[0];
                let coordY = coord.match(type)[0].split("/")[1];
                var wnd_window = document.getElementById("gpwnd_"+wndid);

                // generate text
                let sentries_text = wnd_window.getElementsByClassName("sentries_text")[0];
                if (sentries_text == null) {
                   $($("#gpwnd_"+wndid).find(".island_info_wrapper")).append('<h4 class="sentries_text" style="display: inline-block; margin: 4px"> Sentinelle: </h4>')
                }
                // generate x1 button
                let sentries_x1 = wnd_window.getElementsByClassName("sentries_x1")[0];
                if (sentries_x1 == null) {
                    $($("#gpwnd_"+wndid).find(".island_info_wrapper")).append('<div class="button_new sentries_x1"><div class="left"></div><div class="right"></div><div class="caption js-caption"> x1 <div class="effect js-effect"></div></div></div>')
                    // apply actions to button
                    $("#gpwnd_"+wndid).on("click", ".sentries_x1", function() {
                        console.log("1");
                        console.log(lista_polis);
                    });
                }
                // generate x3 button
                let sentries_x3 = wnd_window.getElementsByClassName("sentries_x3")[0];
                if (sentries_x3 == null) {
                    $($("#gpwnd_"+wndid).find(".island_info_wrapper")).append('<div class="button_new sentries_x3"><div class="left"></div><div class="right"></div><div class="caption js-caption"> x3 <div class="effect js-effect"></div></div></div>')
                    $("#gpwnd_"+wndid).on("click", ".sentries_x3", function() {
                        let lista = getPolis(coordX, coordY);
                        let player_polis = playerHasPolis(lista);
                        for (let i = 0; i < player_polis.length; i++) {
                            lista = lista.filter(item => item !== player_polis[i]);
                            lista = removeSentinel(lista, 3, player_polis[i]);
                            lista = removeSupport(lista, player_polis[i]);
                            }
                        lista = removeAlley(lista)
                        for (let i = 0; i < lista.length; i++) {
                            sendSentinel(lista[i]);
                        }
                    });
                }

                let townlist = [];
                var a = document.getElementById("gpwnd_1000")
                var b = a.getElementsByClassName("game_list")[0];
                var c = b.getElementsByClassName("gp_town_link");
            }
        }
    })

    console.log("Auto sentries Loaded");
})();
