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

Under the folder `website/markdown` add a file for each script

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

### Autoupdate

In the website when a script it's not installed, the button will show up red, in order to show the user that he already has installed the script, add the following function

```js
function checkForUpdate(id) {
	if (!GM_info) return;
	if (window.location.href != GM_info.script.matches[2]) return;
	setTimeout(() => {
		const uw = unsafeWindow ? unsafeWindow : window;
		const evt = new CustomEvent(`gt_update_${id}`, {
			detail: { version: GM_info.script.version },
		});
		uw.dispatchEvent(evt);
	}, 100);
}
```

call the function at the beginning of the script with the id of it

```js

```
