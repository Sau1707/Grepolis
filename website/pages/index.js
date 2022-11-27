import Head from 'next/head';
import { Main, Title, TitleBox, SubTitle } from '../components/Title';
import { Tool, ToolGrid } from '../components/Tool';
import Particle from '../components/Particle';
import data from '../scripts.json';

import SearchBar from '../components/SearchBar';
import GrepoScroll from '../components/GrepoScroll';
import GrepoHr from '../components/GrepoHr';

export default function Home() {
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
							'url(https://gpit-glps.innogamescdn.com/media/grepo/images/background-grepo-city-building-section.9cab004f.jpg) no-repeat -4px -100px',
						width: 'auto',
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
