// ==UserScript==
// @name        GREPO_AUTOMARKET_WITHNOTIFICATION
// @description Check the market every 10 seconds and notify the user if gold can be done
// @author      Sau1707
// @version     1.0.0
// @match       https://*.grepolis.com/game/*
// ==/UserScript==

(function() {
    'use strict';
    const threashold = 500

    // call market endpoint and return resouces
    async function getMarket() {
        let data = {"model_url":"PremiumExchange","action_name":"read"};
        let req = await gpAjax.ajaxGet("frontend_bridge", "execute", data);
        return JSON.parse(req)
    }

    function isResouceMissing(res) {
        return res.stock + threashold < res.capacity
    }

    function addNotification() {
        let body = document.getElementsByTagName("body")[0]
        let div = document.createElement("div");
        div.id = "marketNotification"
        div.style.position = "absolute"
        div.style.bottom = "20px"
        div.style.right = "20px"
        div.style.borderRadius = "25px"
        div.style.zIndex = "100"
        div.style.bottom = "150px"
        div.style.background = "#48f500"
        div.style.width = "200px"
        div.innerHTML = `<h3> Market not full </h3>`
        div.style.visibility = "hidden"
        div.style.opacity = "1";
        body.appendChild(div)
        return div
    }

    function displayNotification(display) {
        if (display) {
            notification.style.bottom = "20px"
            notification.style.visibility = "visible"
            notification.style.opacity = "1";
            notification.style.transition = "bottom 0.7s ease-out";
        } else {
            notification.style.visibility = "hidden"
            notification.style.opacity = "0";
            notification.style.transition = "visibility 0s 2s, opacity 2s linear"
            setTimeout(() => {
                notification.style.bottom = "150px"
            }, 2000)
        }
    }

    function playNotification() {
        audio.play()
    }

    async function main() {
        let data = await getMarket()
        let market = false
        if (isResouceMissing(data.json.iron)) market = true
        if (isResouceMissing(data.json.stone)) market = true
        if (isResouceMissing(data.json.wood)) market = true
        if (!market && lastMarket) displayNotification(false)
        if (market && !lastMarket) {
            playNotification();
            displayNotification(true);
        }
        lastMarket = market
    }

    var lastMarket = false
    const notification = addNotification();
    const audio = new Audio("https://cdn.freesound.org/previews/342/342755_5260872-lq.mp3")
    let loop = setInterval(main, 10000);
    // Your code here...
})();
