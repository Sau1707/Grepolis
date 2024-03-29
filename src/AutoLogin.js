// ==UserScript==
// @name        GREPO_AUTOLOGIN
// @author      Sau1707
// @include     https://*.grepolis.com/*
// @exclude     https://*.grepolis.com/game/*
// ==/UserScript==

const TARGET = "SAMSUN";
const TARGETCOUNT = 300;

(function() {
    'use strict';
    let currentCount = 0
    let timerElement;
    function createCounter() {
        let el = document.getElementById("worlds")
        let li = document.createElement("li");
        li.classList.add("world_name")
        let div = document.createElement("div");
        timerElement = div;
        timerElement.innerText = `Autologin: ${TARGETCOUNT}`
        li.appendChild(div)
        el.children[1].children[0].appendChild(li)
        li.style.background = 'url(/images/game/autogenerated/master_page/master_page_10440d0.png) no-repeat 0 0px';
        console.log(li.style)
    }

    function joinServer() {
        let el = document.getElementById("worlds")
        if (!el) return;
        [...el.children[1].children[0].children].forEach(el => {
            console.log(el.dataset.worldname)
            if (el.dataset.worldname == TARGET) el.click();
        })
    }

    function addCount() {
        const d = new Date();
        // times = 0 - 23
        let range = [23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
        if (range.includes(d.getHours())) {
            timerElement.innerText = `Pause untill ${range[range.length - 1]}`
            return
        }
        currentCount += 1
        timerElement.innerText = `Autologin: ${TARGETCOUNT - currentCount}`
        if (currentCount >= TARGETCOUNT) joinServer();
    }

    function checkTime(min, max) {
        var d = new Date(); // current time
        var hours = d.getHours();
        var mins = d.getMinutes();

        return hours >= 9 && (hours < 17 || hours === 17 && mins <= 30);
    }

    createCounter()
    let loop = setInterval(addCount, 1000);
    // Your code here...
})();
