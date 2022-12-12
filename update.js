/* This script that if the user it's on the main website page, it'used to hightlight the buttons */
(function () {
	const uw = unsafeWindow ? unsafeWindow : window;
	if (!GM_info) return;
	if (!GM_info.script.namespace) return;
	if (!GM_info.script.matches) return;
	if (!GM_info.script.matches[2]) return;

	function checkForTweaksUpdate(id) {
		if (uw.location.href != GM_info.script.matches[2]) return;
		setTimeout(() => {
			const evt = new CustomEvent(`gt_update_${id}`, {
				detail: { version: GM_info.script.version },
			});
			uw.dispatchEvent(evt);
		}, 100);
	}

	checkForTweaksUpdate(GM_info.script.namespace);
})();
