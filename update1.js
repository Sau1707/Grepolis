
(function () {
  	const uw = unsafeWindow ? unsafeWindow : window;
	if (!GM_info) return;
	console.log(GM_info);
	
	function checkForTweaksUpdate(id) {
		if (uw.location.href != GM_info.script.matches[2]) return;
		setTimeout(() => {
		const evt = new CustomEvent(`gt_update_${id}`, {
			detail: { version: GM_info.script.version },
		});
		uw.dispatchEvent(evt);
	}, 100);
	}
})();


