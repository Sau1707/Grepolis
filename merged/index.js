import fs from 'fs-extra';
import uglify from 'uglify-js';

const INPUTFOLDER = '../scripts';
const OUTPUT = 'merged.js';

const TAMPERMONEKY_HEADER = (version) => `// ==UserScript==
// @name         GrepoTweaks-Merged
// @namespace    grepotweaksmerged
// @author       Sau1707
// @description  All the GrepoTweaks merged in a single script
// @version      ${version}
// @match        http://*.grepolis.com/game/*
// @match        https://*.grepolis.com/game/*
// @match        https://sau1707.github.io/Grepolis/
// @require      https://github.com/Sau1707/Grepolis/raw/main/update.js
// ==/UserScript==


`;

/* Read all the scripts and return the merged js*/
async function readFiles() {
	let code = '';

	let files = fs.readdirSync(INPUTFOLDER);
	for (let file of files) {
		const js = await fs.readFile(`${INPUTFOLDER}/${file}`, 'utf-8');
		code += js;
	}

	return code;
}

/* Update file version */
async function updateVersion(current) {
	let currentVersion = current.split('.');
	let newScriptsCount = fs.readdirSync(INPUTFOLDER).length;
	if (newScriptsCount > currentVersion[1]) return `1.${newScriptsCount}.0`;
	else return `1.${currentVersion[1]}.${parseInt(currentVersion[2]) + 1}`;
}

/* Get current file version */
async function getCurrentVersion() {
	const js = await fs.readFile(OUTPUT, 'utf-8');
	let versionIndex = js.search('version');
	console.log(versionIndex);
	let version = js.slice(versionIndex + 13, versionIndex + 18);
	return version;
}

/* Main function */
async function main() {
	const code = await readFiles();
	const currentVersion = await getCurrentVersion();
	let version = await updateVersion(currentVersion);
	console.log(version);
	const minified = uglify.minify(code);
	minified.code = minified.code.replace(/(\r\n|\n|\r)/gm, '');
	await fs.writeFile(OUTPUT, TAMPERMONEKY_HEADER(version) + minified.code);
}

main();
