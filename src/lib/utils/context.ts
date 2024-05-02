import { getContext, setContext } from 'svelte';

export function createContext<Params extends unknown[], T>(
	name: string,
	component: string,
	fn: (...params: Params) => T
) {
	const CONTEXT_KEY = Symbol.for(name);
	return {
		provide(...params: Params) {
			return setContext(CONTEXT_KEY, fn(...params));
		},
		use() {
			const state = getContext<T>(CONTEXT_KEY);
			if (!state) {
				throw new Error(`Context not found. Did you forget to add <${component}> ?`);
			}
			return state;
		}
	};
}
