# <div align="center"> Grepolis Tweaks </div>

## <div align="center"> [Website](https://sau1707.github.io/Grepolis/) - [Donations](https://paypal.me/sau1707) </div>

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
// @name
// @namespace
// @author       Sau1707
// @description
// @version      1.0.1
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update1.js
// ==/UserScript==
```

Where namespace add the same as id for reference

The `@require` it's used for the website buttons, they change color if it's deteced that the script it's installed
