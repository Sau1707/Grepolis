import { useEffect, useState } from 'react';

import Card from 'react-bootstrap/Card';
import GrepoBox from './GrepoBox';
import GrepoButton from './GrepoButton';
import styled from 'styled-components';
import GrepoModal from './GrepoModal';

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
function Tool({ title, version, id, url, description, markdown }) {
	// var evt = new CustomEvent("gt_update_autocave", {detail: {version: "1.0.1"}});
	// window.dispatchEvent(evt);
	const [open, setOpen] = useState(false);
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

	const handleClickOpen = (e) => {
		if (e.target.nodeName == 'A') return;
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Card
				style={{ width: 350, backgroundColor: 'rgb(255 225 161)', cursor: 'pointer' }}
				onClick={handleClickOpen}
			>
				<GrepoBox>
					<Card.Body>
						<Card.Title>
							<BoldTitle>{title}</BoldTitle>
							<Version>Version {version}</Version>
						</Card.Title>
						<Description>{description}</Description>

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
			<GrepoModal open={open} onClose={handleClose}>
				<div dangerouslySetInnerHTML={{ __html: markdown }} />
			</GrepoModal>
		</>
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
	min-height: 72px;
`;

const ButtonBox = styled.div`
	display: flex;
	flex-direction: row-reverse;
`;

export { Tool, ToolGrid };
