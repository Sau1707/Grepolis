/* 
  NOTE: Not functional!
*/ 

// ==UserScript==
// @name		GREPO_Settings
// @author      Sau1707
// @description Piccole aggiunte
// @include		https://*.grepolis.com/game/*
// ==/UserScript==

const ww = unsafeWindow;

const SETTINGSBUTTON = () => {return `
    <div class=\"divider\"></div>
    <div class="activity" id="GREPOSETTINGS">
       <div class="activity" style="background: url(https://gpfr.innogamescdn.com/images/game/autogenerated/layout/layout_095495a.png) no-repeat -642px -437px;" >
         <p id="ptimer" style="z-index: 6; top: -8px; position: relative; font-weight: bold;"></p>
       </div>
    </div>`
}
// <input style="width: 300px" type="range" onclick="window.grepoScript.triggerAutoRuralTimeRange(this);" id="AutoRualTimeRange" value="${unsafeWindow.grepoScript.autoRualTime}" min="0" max="50">
const SETTINGSWINDOW = () => {return `
<style>
.redButton {
filter: brightness(70%) sepia(100%) hue-rotate(-10deg) saturate(1000%) contrast(0.8);
}
.greenButton {
filter:brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)
}
</style>
<div style="padding: 20px" >
 <div style="font-size: 20px; font-weight: bold;">
  <div onclick="window.grepoScript.triggerAutoRural(this)" class="button_new ${unsafeWindow.grepoScript.autoRualActive ? "greenButton" : null }">
	<div class="left""></div>
	<div class="right""></div>
	<div id="tempio_priority" class="caption js-caption"> Activate <div class="effect js-effect"></div></div>
  </div>
  <label for="AutoRual">Enable Auto Rural</label>
 </div>
 <div style="padding: 5px; padding-left: 30px; font-size: 16px; font-weight: bold; display: inline-flex; gap: 15px">
   <label for="AutoRualTimeRange"> Set delta time </label>
   <select id="AutoRualTimeNumber" value="" onchange="window.grepoScript.triggerAutoRuralTime(this);">
    <option value="300000"  ${unsafeWindow.grepoScript.autoRualTime == 300000 ? "selected" : null }> 5 min </option>
    <option value="600000"  ${unsafeWindow.grepoScript.autoRualTime == 600000 ? "selected" : null }> 10 min </option>
    <option value="1200000" ${unsafeWindow.grepoScript.autoRualTime == 1200000 ? "selected" : null }> 20 min </option>
   </select>
 </div>
 <div style="padding: 5px; padding-left: 20px;">

</div>
`}

class grepoScript {
    /*
        TODO: Set a cloud
        Local data storage
    */
    loadStorageData(name, def) {
        let data = JSON.parse(unsafeWindow.localStorage.getItem(name));
        if (data == null) {
            data = def
            this.setStorageData(name, def)
        }
        return data
    }

    setStorageData(name, value) {
        unsafeWindow.localStorage.setItem(name, value.toString());
    }


    /*
        Rural script
    */
    autoRualTime = parseInt(this.loadStorageData("autoRuralTime", 300000));
    autoRualActive = parseInt(this.loadStorageData("autoRualActive", 0));
    autoRualLoop =
    setAutoRualTime(newValue) {
        this.autoRualTime = newValue
        let defaultAutoRualTime = [300000, 600000, 1200000]
        if (defaultAutoRualTime.includes(newValue)) this.setStorageData("autoRuralTime", newValue)
    }

    triggerAutoRural = (el) => {
        // TODO: hide setting on not selected
        this.autoRualActive = ! this.autoRualActive
        el.classList.toggle("greenButton")
        this.autoRualActive ? this.setStorageData("autoRualActive", 1) : this.setStorageData("autoRualActive", 0)
    }

    triggerAutoRuralTime (el) {
        this.setAutoRualTime(parseInt(el.value))
    }




}

unsafeWindow.grepoScript = new grepoScript();

(function() {
    'use strict';



    var active = false;
    var wonder_preferences = JSON.parse(localStorage.getItem("wonder_preferences"));
    if (wonder_preferences == null) {
        localStorage.setItem("wonder_preferences", "[0,0,0,0,0,0,0]");
        wonder_preferences = JSON.parse(localStorage.getItem("wonder_preferences"));
    }
    var wonder_favor = JSON.parse(localStorage.getItem("wonder_favor"));
    if (wonder_favor == null) {
        localStorage.setItem("wonder_favor", "[0,0,0,0,0,0,0]");
        wonder_favor = JSON.parse(localStorage.getItem("wonder_favor"));
    }

    function createWindowType(name, title, width, height, minimizable, position) {
        // Create Window Type
        function WndHandler(wndhandle) {
            this.wnd = wndhandle;
        }

        Function.prototype.inherits.call(WndHandler, WndHandlerDefault);
        WndHandler.prototype.getDefaultWindowOptions = function () {
            return {
                position: position,
                width: width,
                height: height,
                minimizable: minimizable,
                title: title
            };
        };
        ww.GPWindowMgr.addWndType(name, "75623", WndHandler, 1);
    }

    // add the button on window load
    window.onload = (event) => {
        setTimeout(function() {
            /* Add settings button */
            let btbutton = document.getElementById("btbutton");
            if (btbutton == null) $('.tb_activities, .toolbar_activities').find(".middle").append(SETTINGSBUTTON);
            /* Create window */
            createWindowType("AutoWonder", "Auto Wonder", 820, 550, true, ["center", "center", 100, 100]);
            $("#GREPOSETTINGS").click(function() {
                var wnd = GPWindowMgr.Create(GPWindowMgr.TYPE_AutoWonder);
                wnd.setContent(SETTINGSWINDOW)
            })
        }, 500);
    };








})();
