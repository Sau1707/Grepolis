# Grepolis
Usefull script (italian)

Per donazioni - For donations:
[Paypal](https://paypal.me/sau1707)

Per installare gli script, aggiungere a tampermonkey la versione di base
```
// ==UserScript==
// @name        GREPO_TRICKS
// @author      Sau1707
// @include     https://*.grepolis.com/game/*
// ==/UserScript==
```

Ed aggiungere ogni script voluto manualmente con:
```
// @require     [URL]
```

Esempio per RitualUpgrade:
```
// ==UserScript==
// @name        GREPO_TRICKS 
// @author      Sau1707 
// @include     https://*.grepolis.com/game/* 
// @require     https://raw.githubusercontent.com/Sau1707/Grepolis/main/RitualUpgrade.js 
// ==/UserScript==
```

## <div align="center"> AutoRuralResources: </div>
#### <div align="center"> Raccoglie le risorse dai rurali in modo automatizzato ogni 10 minuti più un tempo random che varia ogni ciclo, può essere attivato e disattivato a piacimento con il bottone che si crea affianco alla barra delle attività in alto a sisistra </div>
```
// @require     https://raw.githubusercontent.com/Sau1707/Grepolis/main/AutoRuralResources.js
```

## <div align="center"> Ritual Upgrade: </div>
#### <div align="center"> Crea un bottone nella schermata isola che permette di ampliare tutti i villaggi rurali dell'isola in 1 solo click, se i villaggi non sono costruiti vengono sbloccati </div>
```
// @require     https://raw.githubusercontent.com/Sau1707/Grepolis/main/RitualUpgrade.js
```


