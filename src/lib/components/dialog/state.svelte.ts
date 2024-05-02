import { getContext, setContext } from 'svelte';

export class DialogState {
	open = $state(false);

	static CONTEXT_KEY = Symbol.for('svelte-components-dialog');

	static provide() {
		return setContext(this.CONTEXT_KEY, new DialogState());
	}

	static use() {
		const state = getContext<DialogState>(this.CONTEXT_KEY);
		if (!state) {
			throw new Error('Context not found. Did you forget to add <Dialog.Root> ?');
		}
		return state;
	}
}
