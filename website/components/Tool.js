import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import styled from 'styled-components';

const ToolGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: center;
	gap: 10px;
	margin-left: 10%;
	margin-right: 10%;
`;

/* 
    color: green | orange | red;
*/
const colorMap = {
	green: 'rgb(75 243 64)',
	orange: 'orange',
	red: '#f72323',
};

function Tool({ color, title, version, id, url, description }) {
	// var evt = new CustomEvent("gt_update_autocave", {detail: {version: "1.0.1"}});
	// window.dispatchEvent(evt);

	const [state, setState] = useState('install'); // install | installed | update
	useEffect(() => {
		window.addEventListener(`gt_update_${id}`, (e) => {
			if (!e.detail) return;
			const v = e.detail.version;
			if (!v) return;
			if (v == version) setState('installed');
			else setState('update');
		});
	}, []);

	return (
		<Card style={{ width: 350, backgroundColor: colorMap[color] }}>
			<Card.Body>
				<Card.Title>
					<BoldTitle style={{ textShadow: color != 'red' ? '0px 0px 1px white' : '' }}>
						{title}
					</BoldTitle>
					<Version style={{ textShadow: color != 'red' ? '0px 0px 1px white' : '' }}>
						Version {version}
					</Version>
				</Card.Title>
				<Description style={{ textShadow: color != 'red' ? '0px 0px 1px white' : '' }}>
					{description}
				</Description>
				<ButtonBox>
					{state == 'install' && (
						<Button
							style={{
								backgroundColor: 'purple',
								border: 0,
								fontWeight: 'bold',
							}}
							href={url}
							target='_blank'
							s
						>
							Install
						</Button>
					)}
					{state == 'update' && (
						<Button
							style={{
								backgroundColor: '#00ddff',
								border: 0,
								color: 'black',
								fontWeight: 'bold',
							}}
							href={url}
							target='_blank'
							s
						>
							Update
						</Button>
					)}
					{state == 'installed' && (
						<Button
							style={{
								backgroundColor: '#00ff15',
								border: 0,
								color: 'black',
								fontWeight: 'bold',
							}}
							target='_blank'
						>
							Installed
						</Button>
					)}
				</ButtonBox>
			</Card.Body>
		</Card>
	);
}

const BoldTitle = styled.h2`
	font-weight: bold;
	color: #000;
	margin: 0;
`;

const Version = styled.h6`
	color: #000;
	font-weight: bold;
`;

const Description = styled.p`
	margin-top: 30px;
	margin-bottom: 30px;
	color: #000;
	font-weight: bold;
`;

const ButtonBox = styled.div`
	display: flex;
	flex-direction: row-reverse;
`;

export { Tool, ToolGrid };
