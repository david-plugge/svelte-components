import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [
		plugin(({ addVariant }) => {
			addVariant('aria-selected', '&[aria-selected="true"]');
		})
	]
};
