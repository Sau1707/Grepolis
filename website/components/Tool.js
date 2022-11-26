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
function Tool({ color, title, version, id, url, description }) {
	const colorMap = {
		green: 'rgb(75 243 64)',
		orange: 'orange',
		red: '#f72323',
	};

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
					<Button
						style={{
							backgroundColor: 'purple',
							border: 0,
						}}
						href={url}
						target='_blank'
						id={`grepotweaks_${id}`}
					>
						Click to install
					</Button>
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
