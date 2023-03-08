// ==UserScript==
// @name         GrepoTweaks-Merged
// @namespace    grepotweaksmerged
// @author       Sau1707
// @description  All the GrepoTweaks merged in a single script
// @version      1.9.2
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==


!function(){"use strict";var e=unsafeWindow||window,n=600,i=!1;function r(e,t){e.style.filter=t?"brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)":""}function o(){setTimeout(()=>{var e,t,n,o,s,a;(t=document.getElementsByClassName("god_mini athena athena")[0]).style.zIndex=10,t.style.cursor="pointer",t&&(e=document.getElementsByClassName("js-power-icon animated_power_icon animated_power_icon_45x45 power_icon45x45 power strength_of_heroes")[0])&&(t.onclick=function(){i=i?(clearInterval(i),null):setInterval(l,1e3,e),r(t,i)}),(o=document.getElementsByClassName("god_mini zeus zeus")[0]).style.zIndex=10,o.style.cursor="pointer",o&&(n=document.getElementsByClassName("js-power-icon animated_power_icon animated_power_icon_45x45 power_icon45x45 power fair_wind")[0])&&(o.onclick=function(){i=i?(clearInterval(i),null):setInterval(l,1e3,n),r(o,i)}),(a=document.getElementsByClassName("god_mini artemis artemis")[0]).style.cursor="pointer",a.style.zIndex=10,a&&(s=document.getElementsByClassName("js-power-icon animated_power_icon animated_power_icon_45x45 power_icon45x45 power effort_of_the_huntress")[0])&&(a.onclick=function(){i=i?(clearInterval(i),!1):setInterval(l,1e3,s),r(a,i)})},100)}function l(e){var t;i=document.getElementsByClassName("js-power-icon animated_power_icon animated_power_icon_45x45 power_icon45x45 power")[0]?(e.click(),t=500+Math.floor(Math.random()*n),clearInterval(i),setInterval(l,t,e)):(clearInterval(i),null)}e.$.Observer(e.GameEvents.window.open).subscribe((e,t)=>{"atk_command"==t.context&&setTimeout(()=>{var e=document.getElementById("command_info-god");e&&(console.log("herer"),e.addEventListener("click",o))},100)}),console.log("[GrepoTweaks-AntiCollere] Loaded")}(),function(){"use strict";const l=unsafeWindow||window;var d={};function c(){var e=l.Game.townId;if(d[e])for(var t in d[e]){var n=document.getElementById(t);if(!n)return;n=n.getElementsByClassName("unit unit_order_unit_image unit_icon50x50")[0];if(!n)return;d[e][t]?n.firstElementChild.innerText="+"+d[e][t]:n.firstElementChild.innerText=l.ITowns.towns[e].units()[t]||0}}function r(e,t,n){t={unit_id:t,amount:n,town_id:e};l.gpAjax.ajaxPost("building_barracks","build",t),l.HumanMessage.success("Truppato "+n+" su "+e)}function u(e,t){var n=l.ITowns.towns[e].resources(),e=l.GeneralModifications.getUnitBuildResourcesModification(e,l.GameData.units[t]),o=n.wood/(l.GameData.units[t].resources.wood*e),s=n.stone/(l.GameData.units[t].resources.stone*e),n=n.iron/(l.GameData.units[t].resources.iron*e),t=Math.min(o,s,n);return parseInt(t)}function o(e,t){var n,o,s,a,i;null!=d[e][t]&&(i=e,n=t,o=95,o=(i=l.ITowns.towns[i]).getStorage()/100*o,s=i.resources().wood/l.GameData.units[n].resources.wood,a=i.resources().stone/l.GameData.units[n].resources.stone,i=i.resources().iron/l.GameData.units[n].resources.iron,s=parseInt(Math.min(s,a,i)),a=Math.max(l.GameData.units[n].resources.wood,l.GameData.units[n].resources.stone,l.GameData.units[n].resources.iron),parseInt(o/a)<=s?((i=u(e,t))>d[e][t]?(r(e,t,d[e][t]),delete d[e][t]):(r(e,t,i),d[e][t]-=i),c()):u(e,t)>=d[e][t]&&(r(e,t,d[e][t]),delete d[e][t],c()))}l.$(document).on("click",".unit_tab",function(){c()}),l.$(document).ajaxComplete(function(){if(c(),document.getElementById("unit_order_count")&&!document.getElementById("autoTropsButton")){var t=document.createElement("div");t.className="button_new",t.id="autoTropsButton",t.style="float: right; margin: 0px; left: -87px; position: absolute; top: 93px;",t.innerHTML='<div class="left"></div><div class="right"></div><div class="caption js-caption"> Auto <div class="effect js-effect"></div></div>',document.getElementById("unit_order_count").appendChild(t);let e=document.createElement("input");e.className="",e.id="autoTropsInput",e.style="float: right; margin: 0px; left: -20px; position: absolute; top: 93px; height: 17px; border: 0px; text-align: center; padding: 3px; width: 52px; background: url(https://gpit.innogamescdn.com/images/game/barracks/input.png) no-repeat",document.getElementById("unit_order_count").appendChild(e),t.addEventListener("click",()=>{var t=l.Game.townId,n=document.getElementsByClassName("unit_order_tab bold unit_active")[0].id.substr(15);let o=e.value;var s="="==o[0];if(o=s?parseInt(o.substr(1)):parseInt(o),d[t]||(d[t]={}),o){var a,i,s=s?o-(l.ITowns.towns[t].units()[n]||0):o,r=(console.log(s),l.ITowns.towns[t].getAvailablePopulation());let e=0;for([a,i]of Object.entries(d[t])){if(a==n)return;console.log("unit",a),e+=d[t][a]*l.GameData.units[a].population}r=parseInt((r-e)/l.GameData.units[n].population);d[t][n]=s<=r?s:r,c()}else d[t][n]=0,c(),delete d[t][n]})}}),setInterval(function(){if(0!=d.length)for(var e in d)if(null!=e){n=t=void 0;var t=e;if(7<=l.ITowns.towns[t].getUnitOrdersCollection().models.length)delete d[t];else for(var n in o(t,"catapult"),d[t])null!=n&&o(t,n)}},1e4),console.log("[GrepoTweaks-AutoArmy] Loaded")}(),function(){"use strict";const n=unsafeWindow||window;let o;function e(){var e=document.getElementsByClassName("order_max button_new")[0],t=document.getElementsByClassName("order_confirm button_new square")[0];null!=e&&null!=t||clearInterval(o),5e3<n.ITowns.towns[n.Game.townId].resources().iron&&(e.click(),t.click())}function s(){var e=document.getElementsByClassName("order_count")[0],t=document.createElement("div");t.className="button_new",t.id="autoCaveButton",t.style="float: right; margin: 0px; left: 169px; position: absolute; top: 56px; width: 66px",t.innerHTML='<div class="left"></div><div class="right"></div><div class="caption js-caption"> Auto <div class="effect js-effect"></div></div>',e.insertBefore(t,e.childNodes[0])}function a(){n.$("#autoCaveButton").click(()=>{o=o?(n.$("#autoCaveButton").css("filter",""),clearInterval(o),null):(n.$("#autoCaveButton").css("filter","brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)"),setInterval(e,1e3))})}n.$.Observer(n.GameEvents.town.town_switch).subscribe((e,t)=>{setTimeout(()=>{document.getElementById("autoCaveButton")||document.getElementsByClassName("js-window-main-container classic_window hide")[0]&&(s(),a(),setTimeout(()=>document.getElementsByClassName("order_max button_new")[0].click(),500))},100)}),n.$.Observer(n.GameEvents.window.open).subscribe((e,t)=>{t.attributes&&"hide"==t.attributes.window_type&&setTimeout(()=>{s(),a(),setTimeout(()=>document.getElementsByClassName("order_max button_new")[0].click(),500)},200)}),console.log("[GrepoTweaks-AutoCave] Loaded")}(),function(){"use strict";setInterval(function(){var e=document.getElementsByClassName("type_free");e[0]&&e[0].click()},4e3);console.log("[GrepoTweaks-AutoGratis] Loaded")}(),function(){"use strict";const r=unsafeWindow||window,t=62e4,n=5e3;let e,o,s;function a(){var e,t,n={};for(e of r.MM.getCollections().FarmTownPlayerRelation[0].models){var o=e.attributes.lootable_at;n[o]?n[o]+=1:n[o]=1}let s=0,a=0;for(t in n)n[t]>s&&(s=n[t],a=t);var i=a-Math.floor(Date.now()/1e3);return i<0?0:1e3*i}function i(){var e=a(),e=(s+2*n<e&&(console.log("here"),s=e+Math.floor(Math.random()*n)),s<1&&(e=function(){var t,n,o=[],s=[],a=r.MM.getCollections().Town[0].models.length;for(let e=0;e<a;e++)r.MM.getCollections().Town[0].models[e].attributes.on_small_island||(t=r.MM.getCollections().Town[0].models[e].attributes.island_id,n=r.MM.getCollections().Town[0].models[e].attributes.id,o.includes(t))||(o.push(t),s.push(n));return s}(),e={towns:e=e,time_option_base:300,time_option_booty:600,claim_factor:"normal"},r.gpAjax.ajaxPost("farm_town_overviews","claim_loads_multiple",e),e=Math.floor(Math.random()*n),s=t+e,setTimeout(()=>r.WMap.removeFarmTownLootCooldownIconAndRefreshLootTimers(),2e3)),Date.now()),e=(s-=e-o,o=e,document.getElementById("ptimer"));0<s?e.innerHTML=parseInt(s/1e3):e.innerHTML="0"}function l(){r.GameDataPremium.isAdvisorActivated("captain")?e?(clearInterval(e),e=null,r.$("#btbutton").css("filter","brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)")):(s=a()+Math.random()*n,o=Date.now(),e=setInterval(i,1e3),r.$("#btbutton").css("filter","brightness(100%) sepia(100%) hue-rotate(90deg) saturate(1500%) contrast(0.8)")):(r.$("#btbutton").css("filter","brightness(294%) sepia(100%) hue-rotate(15deg) saturate(1000%) contrast(0.8)"),document.getElementById("ptimer").innerHTML="!",clearInterval(e))}setTimeout(function(){null==document.getElementById("btbutton")&&r.$(".tb_activities, .toolbar_activities").find(".middle").append('<div class="divider"></div><div class="activity" id="btbutton" style="filter: brightness(70%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8);"><p id="ptimer" style="z-index: 6; top: -8px; position: relative; font-weight: bold;"></p></div>'),l()},4e3),r.$(document).on("click","#btbutton",l),console.log("[GrepoTweaks-AutoRuralResources] Loaded")}(),function(){"use strict";const l=unsafeWindow||window;function d(e){e=document.getElementById(e);e&&(e.style.filter="brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(1000%) contrast(0.8)")}function i(e,t){let n;for(var o of t)o.name==e&&(n=o);let s=l.ITowns.getCurrentTown().getAvailableTradeCapacity();if(0==s)l.HumanMessage.error("No trade capacity");else{var a,i,r;let e;for(a of l.MM.getCollections().FarmTownPlayerRelation[0].models)n.id==a.attributes.farm_town_id&&(e=a.attributes.id);e&&((t=l.ITowns.getCurrentTown().resources()[n.resource_demand])<s&&(s=t),t=n.id,i=e,r=s,i={model_url:"FarmTownPlayerRelation/"+i,action_name:"trade",arguments:{farm_town_id:t,amount:3e3<r?3e3:r}},l.gpAjax.ajaxPost("frontend_bridge","execute",i),d(n.name))}}l.$.Observer(l.GameEvents.window.open).subscribe((e,t)=>{if("island"==t.context){let a=t.wnd.getElement();setTimeout(()=>{var e=/\(([^)]+)\)/.exec(a.getElementsByClassName("islandinfo_coords")[0].innerText)[1].split("/"),t=l.ITowns.getCurrentTown().getIslandCoordinateX(),n=l.ITowns.getCurrentTown().getIslandCoordinateY();if(e[1]==t||e[1]==n){var o,s=function(e,t){var n,o=[];for(n of l.MM.getCollections().FarmTown[0].models)n.attributes.island_x==e&&n.attributes.island_y==t&&o.push(n.attributes);return o}(t,n);for(o of a.getElementsByClassName("game_list")[3].children)!function(e,t){const n=document.createElement("div"),o=e.getElementsByClassName("gp_town_link")[0].innerText;n.id=o,n.style.position="absolute",n.style.right="5px",n.style.top="5px",n.classList.add("button_new"),n.innerHTML='<div class="left"></div>\n\t\t<div class="right"></div>\n\t\t<div class="caption js-caption"> Trade <div class="effect js-effect"></div></div>',e.appendChild(n),(e=e.getElementsByClassName("popup_ratio")[0].innerText.split(":"))[0]>e[1]&&d(o),0==(e=l.ITowns.getCurrentTown().getAvailableTradeCapacity())&&n.classList.add("disabled"),n.addEventListener("click",()=>{n.classList.contains("disabled")||i(o,t)})}(o,s)}},100)}}),console.log("[GrepoTweaks-QuickRuralTrade] Loaded")}(),function(){"use strict";function e(){var t=Game.townId,n=ITowns.towns[Game.townId].getIslandCoordinateX(),o=ITowns.towns[Game.townId].getIslandCoordinateY(),s=MM.getCollections().FarmTown[0].models.length;for(let e=0;e<s;e++){var a=MM.getCollections().FarmTown[0].models[e].attributes.island_x,i=MM.getCollections().FarmTown[0].models[e].attributes.island_y;if(n==a&&o==i){var r,l=MM.getCollections().FarmTown[0].models[e].id;for(let e=0;e<s;e++)l==MM.getCollections().FarmTownPlayerRelation[0].models[e].getFarmTownId()&&(r=MM.getCollections().FarmTownPlayerRelation[0].models[e].id,0==MM.getCollections().FarmTownPlayerRelation[0].models[e].attributes.relation_status&&gpAjax.ajaxPost("frontend_bridge","execute",{model_url:"FarmTownPlayerRelation/"+r,action_name:"unlock",arguments:{farm_town_id:l},town_id:t}),MM.getCollections().FarmTownPlayerRelation[0].models[e].attributes.expansion_stage<6)&&null==MM.getCollections().FarmTownPlayerRelation[0].models[e].attributes.expansion_at&&gpAjax.ajaxPost("frontend_bridge","execute",{model_url:"FarmTownPlayerRelation/"+r,action_name:"upgrade",arguments:{farm_town_id:l},town_id:t})}}}$(document).ajaxComplete(function(){var e,t=document.getElementById("auto_butt");null==t&&null!=(e=document.getElementsByClassName("island_info_towns island_info_right")[0])&&(e=e.getElementsByClassName("game_border")[0],null==t)&&((t=document.createElement("div")).className="button_new",t.id="auto_butt",t.style="float: right; margin: 0px;",t.innerHTML='<div class="left"></div>\n\t\t<div class="right"></div>\n\t\t<div class="caption js-caption"> Upgrade All <div class="effect js-effect"></div></div>',e.insertBefore(t,e.childNodes[0]))}),$(document).on("click","#auto_butt",function(){e()}),console.log("[GrepoTweaks-RuralUpgradeButton] Loaded")}(),function(){"use strict";const i=unsafeWindow||window;function r(e){var t=3<(t=i.ITowns.getCurrentTown().getLandUnits()).sword?"sword":3<t.archer?"archer":3<t.hoplite?"hoplite":null;t?((e={id:e=e.id,type:"support"})[t]=3,i.gpAjax.ajaxPost("town_info","send_units",e)):i.HumanMessage.error("No troops available")}i.$.Observer(i.GameEvents.map.town.click).subscribe((e,t)=>{var n,o,s,a;if((n=t.x,o=t.y,a=(s=i.ITowns.getCurrentTown()).getIslandCoordinateX(),s=s.getIslandCoordinateY(),a==n&&s==o)&&(!function(e){var t,n;for(t of Object.keys(i.ITowns.towns)){if(t==e)return 1;for(n of i.ITowns.all_supporting_units.fragments[t].models)if(n.attributes.current_town_id==e)return 1}}(t.id)&&!function(e){var t,n=i.MM.getModels().MovementsUnits;for(t in n)if(n[t].attributes.target_town_id==e)return 1}(t.id))){let e=i.$("#context_menu");e&&((a=document.createElement("div")).id="sentinel_button",a.style.width="50px",a.style.height="50px",a.style.position="absolute",a.style.background="url(https://i.ibb.co/9wwBNfD/sentinel.png)",a.style.zIndex="auto",a.style.cursor="pointer",a.innerHTML=`        <div id="sentinel_description" style="position: absolute;overflow: hidden;width: 118px;display: none;margin-left: -59px;left: 50%;top: 40px;z-index: 5;" >        <div style="position: absolute; top: 0; left: 0; right: 0; background: url(https://gpit.innogamescdn.com/images/game/autogenerated/layout/layout_095495a.png) no-repeat -488px -406px; width: 118px; height: 18px;"></div>        <div style="position: absolute; top: 18px; left: 0; right: 0; bottom: 11px; background: url(https://gpit.innogamescdn.com/images/game/layout/context_menu_middle.png) repeat-y 0 0;"></div>        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: url(https://gpit.innogamescdn.com/images/game/autogenerated/layout/layout_095495a.png) no-repeat -326px -240px; width: 118px; height: 11px;"></div>        <div style="color: #fc6; font-weight: 700; text-align: center; word-wrap: break-word; line-height: 19px; z-index: 1; position: relative; padding: 4px;">Sentinel</div>        </div>`,e.append(a),i.$("#sentinel_button").animate({top:"-100px"},120),i.$("#sentinel_button").hover(()=>{i.$("#sentinel_description").css("display","block")},()=>{i.$("#sentinel_description").css("display","none")}),i.$("#sentinel_button").click(()=>{r(t),e.remove()}))}}),console.log("[GrepoTweaks-SentinelButton] Loaded")}(),function(){"use strict";const o=unsafeWindow;let s=[];function n(){var e=Object.keys(o.ITowns.towns);let t=[];e.forEach(e=>{o.ITowns.all_supporting_units.fragments[e].models.forEach(e=>{e=e.attributes;-1===t.indexOf(e.current_town_id)&&t.push(e.current_town_id)})});var e=s.filter(e=>!t.includes(e)),n=t.filter(e=>!s.includes(e));e.forEach(e=>{e=e,(e=document.getElementById("sentinel_shield_"+e))&&e.remove()}),n.forEach(e=>{!function(e){var t,n,o=document.getElementById("town_"+e);if(o)return t=parseInt(o.style.left),o=parseInt(o.style.top),(n=document.createElement("div")).id="sentinel_shield_"+e,n.style.left=t-29+"px",n.style.top=o-25+"px",n.style.background="url(https://gpit.innogamescdn.com/images/game/autogenerated/map/town_overlay/city_shield_cd2b0df.png) no-repeat 0 0",n.style.width="110px",n.style.height="72px",n.style.position="absolute",n.style.transform="translate(10px,10px)",n.style.backgroundSize="95%",n.style.filter="grayscale(100%) brightness(80%) sepia(300%) hue-rotate(50deg) saturate(500%)",document.getElementById("map_sentinel").appendChild(n),1}(e)&&t.splice(t.indexOf(e),1)}),s=t}window.addEventListener("load",e=>{setTimeout(()=>{var e,t;e=document.getElementById("map_move_container"),(t=document.createElement("div")).id="map_sentinel",t.style.position="absolute",t.style.top="0px",t.style.left="0px",t.style.zIndex="5",t.style.pointerEvents="none",t.style.opacity="0.6",e.appendChild(t),e=document.getElementById("map_islands"),new MutationObserver(n).observe(e,{childList:!0,attributes:!0,subtree:!0}),n()},500)}),console.log("[GrepoTweaks-SentinelIndicator] Loaded")}();