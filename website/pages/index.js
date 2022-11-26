import Head from 'next/head';
import { Main, Title, TitleBox, SubTitle } from '../components/Title';
import { Tool, ToolGrid } from '../components/Tool';
import Particle from '../components/Particle';
import data from '../scripts.json';
import SearchBar from '../components/SearchBar';
import { useEffect } from 'react';

export default function Home() {
	return (
		<>
			<Head>
				<title>Grepo Tweaks</title>
				<meta name='description' content='scripts and tools for grepolis' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Main>
				<Particle />
				<TitleBox>
					<Title>Grepo Tweaks</Title>
					<SubTitle> a compilation of scripts and tools for grepolis</SubTitle>
				</TitleBox>
				<div style={{ marginBottom: 10 }}>
					<SearchBar />
				</div>

				<ToolGrid>
					{data.map((e, i) => (
						<Tool key={i} {...e} />
					))}
				</ToolGrid>
			</Main>

			<footer>
				<a
					href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
					target='_blank'
					rel='noopener noreferrer'
				></a>
			</footer>
		</>
	);
}
