// ==UserScript==
// @name		GREPO_Settings_New
// @author      Sau1707
// @description Piccole aggiunte
// @include		https://*.grepolis.com/game/*
// ==/UserScript==

/*
{
name:
title:
elements: []
// save
}


*/
const ww = unsafeWindow;

const AutoRurali = {
    name: "AutoResources",
    title: "Grepo Tweaks: AutoResources Settings",
    description: "A bot that automatically collects resources from all rural villages. Needs the captain to work",
    elements: [{
        type: "dropdown",
        title: "Set bot interval",
        options: ["5min", "10min", "20min"],
        id: ""

    }]
}
const test1 = {
    name: "Test1",
    title: "Title: Test1",
    description: "",
    elements: [{
        type: "dropdown",
        options: ["option1", "option2", "option3"],
        id: ""

    }]
}
const test2 = {
    name: "Test2",
    title: "Title: Test2",
    elements: [{}]
}
ww.grepoTweaks = {
    activeTweaks: [AutoRurali, test1, test2],
    addActiveTweaks: (newElement) => {this.activeTweaks = [...this.activeTweaks, newElement]}
}

function createGui(el) {
    let div = document.createElement("div");
    div.classList.add("section")
    div.id = `s_grepotweak_${el.name}`;
    div.innerHTML = `
<div class="game_header bold">${el.title}</div>
<div class="group">
   <p>${el.description}</p>
   ${generateElements(el.elements)}
   <br>
   <div class="button_new reports_save">
      <div class="left"></div>
      <div class="right"></div>
      <div class="caption js-caption">
         Save
         <div class="effect js-effect"></div>
      </div>
   </div>
</div>
`
    return div
}

function generateElements(elements) {
    let string = ""
    let arr = elements.map(e => {
        if (e.options == null) return
        if (e.type == "dropdown" ) return createDropDown(e.options, e.id, e.title ? e.title : "")
    })


    arr.forEach(e => {string += e})
    return string
}

function createDropDown(options, id, title = "", size = 100) {
    let el = `
<style>
.grepoTweaksSelect {
    border: 0;
    height: 19px;
    background: transparent; position: absolute; top: 2px; width: ${size + 22}px;
    outline: none;
}

.grepoTweaksSelect option{
    background-color: #ffe3a1;
}

</style>
<div style="display: inline-flex; gap: 20px">
<b style="margin: 0; font: 14px Verdana,Arial,Helvetica,sans-serif; font-weight: bold !important;"> ${title}: </b>
<div class="dropdown default">
   <div class="border-left"></div>
   <div class="border-right"></div>
   <div class="caption" style="width: ${size}px; position: relative">
   <select class="grepoTweaksSelect" id=${id}>
   ${options.map(e => `<option onmouseover="console.log('hover') "value=${e}>${e}</option>`).join(' ')}
   </select>
   </div>
</div>
</div>

`
    return el
                           }

(function() {
    'use strict';
    /* Check if settings is open */
    $(document).ajaxComplete(function() {
        const activeTweaks = ww.grepoTweaks.activeTweaks;
        let wnds = GPWindowMgr.getOpen(Layout.wnd.TYPE_PLAYER_SETTINGS);
        for (let e in wnds) {
            if (!wnds.hasOwnProperty(e)) return
            let wndid = wnds[e].getID();
            let menu = $("#gpwnd_"+wndid).find(".settings-menu")[0]
            let container = $("#gpwnd_"+wndid).find(".settings-container")[0]
            let form = document.getElementById("settings_form")

            /* Create grepotweaks menu*/
            if (document.getElementById("grepotweaksmenu") == null) {
                let elements = document.createElement("ul");
                activeTweaks.forEach(tw => {
                    let li = document.createElement("li");
                    let a = document.createElement("a");
                    a.classList.add("settings-link");
                    a.id = `player-index-grepotweak_${tw.name}`;
                    a.innerText = tw.name
                    li.appendChild(a);
                    elements.appendChild(li);
                    a.addEventListener("click", () => {
                        /* Check if element already exist */
                        let elementFound = false;
                        form = document.getElementById("settings_form");
                        if (form != null) {
                            [...form.children].forEach(el => {
                                if (el.id == `s_grepotweak_${tw.name}`) elementFound = true
                            })
                        }
                        if (elementFound) return;

                        /* Set content after small time */
                        setTimeout(() => {
                            let div = createGui(tw);
                            form = document.getElementById("settings_form");
                            form.appendChild(div)
                        }, 200)
                    });
                })
                /* Add Grepo Tweaks title */
                let title = document.createElement("b");
                title.innerText = "Grepo Tweaks";
                title.id = "grepotweaksmenu";
                menu.insertBefore(elements, menu.firstChild);
                menu.insertBefore(title, menu.firstChild);
            }
        }
    });
})();
