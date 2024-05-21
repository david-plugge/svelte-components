import { Box, type WritableBox, type WritableProp } from './box.svelte';

export namespace Select {
	interface StateProps {
		open?: WritableProp<boolean>;
	}

	class RootState {
		trigger: Trigger | null = null;
		content: Menu | null = null;
		options = new Map<string, Option>();

		open: WritableBox<boolean>;

		constructor({ open = false }: StateProps = {}) {
			this.open = Box.writable(open);
		}
	}

	export interface RootProps<Multiple extends boolean, Item> {
		multiple?: WritableProp<Multiple>;
		selected?: WritableProp<Multiple extends true ? Item[] : Item | null>;
		open?: WritableProp<boolean>;
	}

	export class Root<const Multiple extends boolean = false, Item = any> {
		#state: RootState;
		#selected: WritableBox<Multiple extends true ? Item[] : Item | null>;

		constructor(props: RootProps<Multiple, Item>) {
			this.#state = new RootState({
				open: props.open
			});

			this.#selected = Box.writable<any>(props.selected ?? props.multiple ? [] : null);
		}

		get open() {
			return this.#state.open.value;
		}
		set open(v) {
			this.#state.open.value = v;
		}

		get selected() {
			return this.#selected.value;
		}
		set selected(v) {
			this.#selected.value = v;
		}
	}

	export class Trigger {
		constructor() {}
	}

	export class Menu {
		constructor() {}
	}

	export class Group {
		constructor() {}
	}

	export class GroupLabel {
		constructor() {}
	}

	export class Option {
		constructor() {}
	}
}
