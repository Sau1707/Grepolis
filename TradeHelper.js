(function() {
    'use strict';
    $(document).ajaxComplete(function() {
        console.log("qua");
        let box = document.getElementsByClassName("trade_town_wrapper");
        for (let i = 0; i < box.length; i++) {
            let trade = parseInt(box[i].getElementsByClassName("trade_capacity res_icon")[0].innerText);
            let iron = parseInt( box[i].getElementsByClassName("resource_iron_icon res_icon")[0].innerText);
            let stone = parseInt(box[i].getElementsByClassName("resource_stone_icon res_icon")[0].innerText);
            let wood = parseInt(box[i].getElementsByClassName("resource_wood_icon res_icon")[0].innerText);
            let sum = wood + iron + wood;
            if (sum < 1000) { // brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)
                box[i].style.filter = "hue-rotate(-45deg) saturate(2)";
                //box[i].style.filter = "saturate(1)";
                continue;
            }
            if (trade > 100) {
                box[i].style.filter = "hue-rotate(60deg) saturate(3)";
                continue;
            }
            box[i].style.filter = "saturate(4)";
        }
    })
})();
