import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function Particle() {
	const particlesInit = async (engine) => {
		await loadFull(engine);
	};

	return (
		<Particles
			style={{ position: 'absolute' }}
			id='tsparticles'
			init={particlesInit}
			options={{
				background: {
					color: {
						value: '#000',
					},
				},
				fpsLimit: 120,
				particles: {
					color: {
						value: '#A020F0',
					},
					links: {
						color: '#A020F0',
						distance: 150,
						enable: true,
						opacity: 0.5,
						width: 1,
					},
					collisions: {
						enable: true,
					},
					move: {
						directions: 'none',
						enable: true,
						outModes: {
							default: 'bounce',
						},
						random: false,
						speed: 1,
						straight: false,
					},
					number: {
						density: {
							enable: true,
							area: 800,
						},
						value: 80,
					},
					opacity: {
						value: 0.5,
					},
					shape: {
						type: 'circle',
					},
					size: {
						value: { min: 1, max: 5 },
					},
				},
				detectRetina: true,
			}}
		/>
	);
}
