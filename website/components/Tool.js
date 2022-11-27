import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import GrepoBox from './GrepoBox';
import GrepoButton from './GrepoButton';
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
		// colorMap[color]
		<Card style={{ width: 350, backgroundColor: 'rgb(255 225 161)' }}>
			<GrepoBox>
				{' '}
				<Card.Body>
					<Card.Title>
						<BoldTitle
							style={{ textShadow: color != 'red' ? '0px 0px 1px white' : '' }}
						>
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
							<GrepoButton color='red' href={url}>
								Install
							</GrepoButton>
						)}
						{state == 'update' && (
							<GrepoButton color='blue' href={url}>
								Update
							</GrepoButton>
						)}
						{state == 'installed' && (
							<GrepoButton color='yellow' href={url}>
								Installed
							</GrepoButton>
						)}
					</ButtonBox>
				</Card.Body>
			</GrepoBox>
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
