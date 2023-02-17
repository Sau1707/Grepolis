/* Setup autofarm in the window object */

setTimeout(() => {
	unsafeWindow.botConsole = new BotConsole();
	unsafeWindow.autoFarm = new AutoFarm();
	unsafeWindow.autoBuild = new AutoBuild();
	unsafeWindow.mixedBot = new MixedBot();

	let tabs = [
		{
			title: 'Farm',
			id: 'farm',
			render: unsafeWindow.autoFarm.renderSettings,
		},
		{
			title: 'Build',
			id: 'build',
			render: unsafeWindow.autoBuild.renderSettings,
		},
		{
			title: 'Train',
			id: 'train',
			render: () => `
            <ul>
                <li> todo: list polis + troops count </li>
                <li> todo: usa richiamo </li>
                <li> todo: move hero </li>
            </ul>
            `,
		},
		{
			title: 'Trade',
			id: 'trade',
			render: () => `
            `,
		},
		{
			title: 'Mix',
			id: 'mix',
			render: unsafeWindow.mixedBot.renderSettings,
		},
		{
			title: 'Console',
			id: 'console',
			render: unsafeWindow.botConsole.renderSettings,
		},
	];

	unsafeWindow.modernWindow = new createGrepoWindow({
		id: 'MODERN_BOT',
		title: 'ModernBot',
		size: [800, 300],
		tabs: tabs,
		start_tab: 0,
	});

	unsafeWindow.modernWindow.activate();

	$('.gods_area_buttons').append(
		"<div class='btn_settings circle_button settings modern_bot_settings' onclick='window.modernWindow.openWindow()'><div style='filter: grayscale(100%)' class='icon js-caption'></div></div>",
	);

	setTimeout(() => unsafeWindow.modernWindow.openWindow(), 500);
}, 1400);
