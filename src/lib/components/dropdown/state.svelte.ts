import { generateId } from '$lib/utils/id';
import { getContext, setContext } from 'svelte';

export class DropdownState {
	open = $state(false);

	ids = {
		trigger: generateId(),
		content: generateId()
	};

	static CONTEXT_KEY = Symbol.for('svelte-components-dropdown');

	static provide() {
		return setContext(this.CONTEXT_KEY, new DropdownState());
	}

	static use() {
		const state = getContext<DropdownState>(this.CONTEXT_KEY);
		if (!state) {
			throw new Error('Context not found. Did you forget to add <Dialog.Root> ?');
		}
		return state;
	}
}
