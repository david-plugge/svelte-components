import { createContext } from '$lib/utils/context';
import { generateId } from '$lib/utils/id';
import { Set } from 'svelte/reactivity';

export class AccordionState {
	openIds = new Set();

	constructor(private multiple: boolean) {}

	toggle(id: string, open?: boolean) {
		const present = open ?? !this.openIds.has(id);

		if (!this.multiple) {
			this.openIds.clear();
		}

		if (present) {
			this.openIds.add(id);
		} else {
			this.openIds.delete(id);
		}
	}

	static context = createContext(
		'svelte-components-dropdown',
		'Accordion.Root',
		({ multiple }: { multiple: boolean }) => new AccordionState(multiple)
	);
}

export class AccordionItemState {
	ids = {
		trigger: generateId(),
		content: generateId()
	};

	accordion = AccordionState.context.use();

	isOpen = $derived(this.accordion.openIds.has(this.ids.content));

	toggle() {
		this.accordion.toggle(this.ids.content);
	}

	close() {
		this.accordion.toggle(this.ids.content, false);
	}

	open() {
		this.accordion.toggle(this.ids.content, true);
	}

	static context = createContext(
		'svelte-components-accordion-item',
		'Accordion.Item',
		() => new AccordionItemState()
	);
}
