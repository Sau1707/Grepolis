# <div align="center"> Grepolis Tweaks </div>

> **Warning** \
> I stopped working In this reposity, the project moved to [ModernBot](https://github.com/Sau1707/ModernBot) with the impementation of new functionality as well a GUI

### <p align="center"> If you like this project, please consider starring it to show your support and help others discover it too </p>

### <div align="center"> [Website](https://sau1707.github.io/Grepolis/) - [Donations](https://paypal.me/sau1707) </div>

<br />

### Get stated

Go to website directory

```
cd website
```

install npm packages

```
npm install
```

run development server

```
npm run dev
```

<br />

### Add script to webpage

Under the folder `markdown` add a file for each script

```
---
id:
title:
version:
description:
url:
---

# Title

### How it work:
```

It will automatically be added to the script by nextjs

<br />

### Tampermonkey Script headers

```
// ==UserScript==
// @name         GrepoTweaks-
// @namespace
// @author       Sau1707
// @description
// @version      1.0.1
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==
```

Where namespace add the same as id for reference

The `@require` it's used for the website buttons, they change color if it's deteced that the script it's installed

<br />

### TODO

-   Remove url from markdown file but automatically call filename with id of script
-   Edit scripts with new autoupdate
-   Move script from gist to scripts folder
-   Finisch and publish old scripts
-   Finisch menù script + easly adoption for all the others
-   Find a way to save user preferences that is not localstorage

```
const uw = unsafeWindow ? unsafeWindow : window;
console.log("[GrepoTweaks-AutoCave] Loaded");
```

// uw.$.Observer(uw.GameEvents.window.open).subscribe((e, data) => console.log(data))

## Merged

```
npm install
```

```
npm start
```

TODO: version. ecc
