import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			colors: {
				solace: {
					DEFAULT: '#265b4e',
					50: '#f0f7f6',
					100: '#daeee9',
					200: '#b5ddd4',
					300: '#88c5b8',
					400: '#5ca699',
					500: '#438b7f',
					600: '#347068',
					700: '#2d5a53',
					800: '#265b4e',
					900: '#234a41'
				}
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
			},
			animation: {
				'spin-fast': 'spin 0.6s linear infinite'
			}
		}
	},
	plugins: []
};
export default config;
