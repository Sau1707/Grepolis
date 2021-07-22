(function() {
    'use strict';
    // define const and variables
    const increase = 5;
    var startAmmount = 50;
    var ritual = false;
    var ritualLoop;

    // Add the rural button
    $(document).ajaxComplete(function() {
        var btn_attack_town = document.getElementById("btn_attack_town");
        var btn_ritual = document.getElementById("ritualButton");
        if (btn_ritual == null && btn_attack_town != null) { //if element don't exist, create it
            let html = '<div class="button_new reservation_tool free" id="ritualButton"><div class="left"></div><div class="right"></div><div class="caption js-caption"> Ritual <div class="effect js-effect"></div></div></div>';
            $(".attack_support_window").find(".button_wrapper").append(html);
        }
    });

    // Add action to the button
   $(document).on("click","#ritualButton", function() {
        if (!ritual) {
            ritualLoop = setInterval(bot, 6000);
            $("#ritualButton").css("filter","brightness(45%) sepia(60%) hue-rotate(-50deg) saturate(500%) contrast(1)");
        } else {
            clearInterval(ritualLoop);
            $("#ritualButton").css("filter","");
        }
        ritual = !ritual;
    });

    // redice the ammount of initial troups if exceeded 70
    function bot() {
        if (startAmmount > 70) startAmmount = 70;
        ritualAttack();
    }

    // generate a random int, between 0 and max
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // attack function
    function ritualAttack() {
        var amm = startAmmount
        if (document.getElementById("btn_attack_town") == null) return; // check if user has closed the attack tab
        var count = [0,0,0,0];
        count[0] = parseInt(document.getElementById("sword").innerText)
        count[1] = parseInt(document.getElementById("archer").innerText)
        count[2] = parseInt(document.getElementById("slinger").innerText)
        count[3] = parseInt(document.getElementById("hoplite").innerText)
        const sum = count.reduce((a, b) => a + b, 0)
        if (sum < amm) return; // if now enught troops in polis return
        // asign value
        document.getElementsByName("sword")[0].value = parseInt(count[0]/sum*amm);
        document.getElementsByName("archer")[0].value = parseInt(count[1]/sum*amm);
        document.getElementsByName("slinger")[0].value = parseInt(count[2]/sum*amm);
        document.getElementsByName("hoplite")[0].value = parseInt(count[3]/sum*amm);
        // click the attack value
        var btn_attack_town = document.getElementById("btn_attack_town");
        btn_attack_town.click();
        // check if attack has work
        setTimeout(function() {
            var check = [0,0,0,0]
            check[0] = parseInt(document.getElementById("sword").innerText)
            check[1] = parseInt(document.getElementById("archer").innerText)
            check[2] = parseInt(document.getElementById("slinger").innerText)
            check[3] = parseInt(document.getElementById("hoplite").innerText)
            const sum_check = check.reduce((a, b) => a + b, 0)
            if (sum_check == sum) {// if the sum is the same, repeat the launch with 5 more pop
                startAmmount += 1;
                ritualAttack();
            }
        }, 300);
    }

    // Print in console that the script is loaded
    console.log("RitualSmartAttack.js Loaded");
})();
