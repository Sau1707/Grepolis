(function() {
    'use strict';
    var autoCaveActive = false;
    var autoCaveLoop;

    function autoCaveMain() {
        let max = document.getElementsByClassName("order_max button_new")[0];
        let con = document.getElementsByClassName('order_confirm button_new square')[0];
        console.log(con);
        if (max == null || con == null) {
            autoCaveActive = false;
            clearInterval(autoCaveLoop);
        }
        if (ITowns.towns[Game.townId].resources().iron > 5000) {
            max.click();
            con.click();
        }
    }

    // add the button
    $(document).ajaxComplete(function() {
        let autoCaveButton = document.getElementById("autoCaveButton");
        let cave = document.getElementsByClassName("js-window-main-container classic_window hide")[0];
        if (autoCaveButton == null && cave != null) {
            console.log("qua");
            let box = document.getElementsByClassName("order_count")[0];
            let butt = document.createElement("div");
            butt.className = "button_new";
            butt.id = "autoCaveButton";
            butt.style = "float: right; margin: 0px; left: 169px; position: absolute; top: 56px; width: 66px";
            butt.innerHTML = '<div class="left"></div><div class="right"></div><div class="caption js-caption"> Auto <div class="effect js-effect"></div></div>';
            box.insertBefore(butt, box.childNodes[0]);
        }
    });

    // add action to the button
    $(document).on("click","#autoCaveButton", function() {
        if (autoCaveActive) {
            $("#autoCaveButton").css("filter","");
            clearInterval(autoCaveLoop);
        } else {
            $("#autoCaveButton").css("filter","brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)");
            autoCaveLoop = setInterval(autoCaveMain, 5000);
        }
        autoCaveActive = !autoCaveActive
    });

    //
    console.log("AutoCave.js");
})();
