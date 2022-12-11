function checkForTweaksUpdate(id) {
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
