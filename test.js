function checkForUpdate(id) {
	const element = document.getElementById(`grepotweaks_${id}`);
	if (!element) return;

	const version = document.getElementById(`grepotweaks_${id}_version`);
	if (!version) return;
	element.innerHTML = `Update to ${'new version'}`;

	element.style.backgroundColor = 'blue';
	element.innerHTML = 'Installed';
}
