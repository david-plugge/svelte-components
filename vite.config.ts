import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import MagicString from 'magic-string';

export default defineConfig({
	plugins: [svelteSyncRunes(), sveltekit()]
});

function svelteSyncRunes(): Plugin {
	return {
		name: 'vite-plugin-svelte-sync-runes',
		enforce: 'pre',
		transform(code, id, options) {
			const ms = new MagicString(code, { filename: id });

			ms.replaceAll(/__sync_runes__\((.+)\)/g, (_, params: string) => {
				if (options?.ssr) return '';

				const args = params.split(',').map((p) => p.trim());
				if (args.length !== 2) throw new Error(`__sync_runes__ must have exactly 2 parameters`);
				const [a, b] = args;

				const rand1 = 'sync_' + Math.round(Math.random() * 100000) + 1000;
				const rand2 = 'sync_' + Math.round(Math.random() * 100000) + 1000;
				return `
let ${rand1} = false;
let ${rand2} = false;

$effect(() => {
	${a};
	if (!${rand1}) {
		${b} = ${a};
		${rand2} = true;
	}
	${rand1} = false;
});
$effect(() => {
	${b};
	if (!${rand2}) {
		${a} = ${b};
		${rand1} = true;
	}
	${rand2} = false;
});`;
			});

			return {
				code: ms.toString(),
				map: ms.generateMap()
			};
		}
	};
}
