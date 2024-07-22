const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
};

const withImages = require('next-images');
module.exports = withImages({
	webpack(config, options) {
		return config;
	},
});

module.exports = nextConfig;
