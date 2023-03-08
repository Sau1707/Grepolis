# New Grepolis bot

Work in progress

<br />

## Install

Install depencies using

```
npm install
```

Run with

```
npx gulp
```

It will create a gulp server that automatically merge all the js in the `src` files and the css from `styles` into a single user script in the `dist` folder

## Development

In tampermonkey add a script with the following:

```
// ==UserScript==
// @name         ModernBot
// @author       Sau1707
// @description
// @version      1.0.0
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @require      file://C:\[folder_path]\dist\main.user.js
// ==/UserScript==
```

Then type in your browser

```
chrome://extensions/
```

And in the tampermoney script click "Allow access to files URL"

##
