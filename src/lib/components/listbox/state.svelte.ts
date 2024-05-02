import { createContext } from '$lib/utils/context';
import { generateId } from '$lib/utils/id';
import { Set } from 'svelte/reactivity';

export class ListboxState {
	selected = new Set<string>();

	constructor(private multiple: boolean) {}

	toggle(id: string, selected?: boolean) {
		const present = selected ?? !this.selected.has(id);

		if (!this.multiple) {
			this.selected.clear();
		}

		if (present) {
			this.selected.add(id);
		} else {
			this.selected.delete(id);
		}
	}

	static context = createContext(
		'svelte-components-listbox',
		'Listbox.Root',
		({ multiple = false }: { multiple?: boolean }) => new ListboxState(multiple)
	);
}

export class ListboxItemState {
	private listbox = ListboxState.context.use();

	id = generateId();

	readonly selected = $derived(this.listbox.selected.has(this.id));

	toggle() {
		this.listbox.toggle(this.id);
	}

	select() {
		this.listbox.toggle(this.id, true);
	}

	unselect() {
		this.listbox.toggle(this.id, false);
	}
}
