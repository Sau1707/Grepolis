function checkForUpdate(id) {
	setTimeout(() => {
		const evt = new CustomEvent(`gt_update_${id}`, {
			detail: { version: GM_info.script.version },
		});
		unsafeWindow.dispatchEvent(evt);
	}, 100);
}

/* Check if activate in the grepotweak page */
if (window.location.href == GM_info.script.matches[2]) {
	checkForUpdate('autocave');
	return;
}
