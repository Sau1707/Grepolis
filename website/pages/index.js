import Head from 'next/head';
/* Components */
import { Main } from '../components/Title';
import { Tool, ToolGrid } from '../components/Tool';
import GrepoScroll from '../components/GrepoScroll';
import GrepoHr from '../components/GrepoHr';
/* Util */
import path from 'path';
import fs from 'fs';
/* Markdown converter */
import { remark } from 'remark';
import html from 'remark-html';
import * as matter from 'gray-matter';

const postsDirectory = '../markdown';
export function getStaticProps(id) {
	var files = fs.readdirSync(postsDirectory);
	let scripts = [];

	const getScriptPath = (id) =>
		`https://raw.githubusercontent.com/Sau1707/Grepolis/main/scripts/${id}.user.js`;

	files.map(async (file) => {
		const id = path.parse(file).name.toLowerCase();
		const fullPath = path.join(postsDirectory, file);
		const fileContents = fs.readFileSync(fullPath, 'utf8');
		/* Use gray-matter to parse the post metadata section */
		const matterResult = matter(fileContents);

		if (matterResult.data.publish === false) return;
		let element = { ...matterResult.data, id: id, url: getScriptPath(id) };
		/* Use remark to convert markdown into HTML string */
		const processedContent = await remark().use(html).process(matterResult.content);
		const contentHtml = processedContent.toString();

		element.markdown = contentHtml;
		scripts.push(element);
	});

	return {
		props: {
			data: scripts,
		},
	};
}

export default function Home({ data }) {
	return (
		<>
			<Head>
				<title>Grepo Tweaks</title>
				<meta name='description' content='scripts and tools for grepolis' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Main>
				{/* <Particle /> */}
				<div
					style={{
						background:
							'url(https://gpit-glps.innogamescdn.com/media/grepo/images/background-grepo-city-building-section.9cab004f.jpg) no-repeat 0px 0px',
						width: 'auto',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						height: 500,
						position: 'relative',
						paddingTop: 100,
					}}
				>
					<GrepoScroll />
					<div style={{ margin: 'auto', textAlign: 'center', marginTop: 20 }}>
						<h4 style={{ color: 'white', marginBottom: 0 }}>
							Open source on{' '}
							<a
								style={{ color: 'white' }}
								href='https://github.com/sau1707/grepolis'
								target={'_blank'}
							>
								Github
							</a>
						</h4>
						<h6 style={{ color: 'white' }}> Created by Sau1707 </h6>
					</div>
				</div>
				<GrepoHr />

				<ToolGrid style={{ marginBottom: 100 }}>
					{data.map((e, i) => (
						<Tool key={i} {...e} />
					))}
				</ToolGrid>

				<GrepoHr />
			</Main>

			<footer>
				<div
					style={{
						background:
							'#000 url(//gpit-glps.innogamescdn.com/media/grepo/images/footer-grepo.663f1609.jpg) no-repeat',
						width: 'auto',
						height: 500,
						position: 'relative',
						paddingTop: 100,
						color: 'white',
						textAlign: 'center',
						padding: 100,
					}}
				>
					<h5 style={{ maxWidth: 800, margin: 'auto' }}>
						This page is not official but just a personal project.
						<br />
						<br />
						Any responsibility for use of scripts and consequences is disclaimed.
						<br />
						The scripts are not approved and therefore it is possible that your account
						may be banned while using them
					</h5>
				</div>
			</footer>
		</>
	);
}
