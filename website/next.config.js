/** @type {import('next').NextConfig} */

const env = process.env.NODE_ENV;

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	basePath: env == 'development' ? null : '/Grepolis',
	images: {
		unoptimized: true,
	},
};

module.exports = nextConfig;
