import { generateId } from '$lib/utils/id';
import {
	Box,
	type ReadableBox,
	type ReadableProp,
	type WritableBox,
	type WritableProp
} from './box.svelte';

export interface SelectProps<Multiple extends boolean, Item> {
	multiple?: WritableProp<Multiple>;
	selected?: WritableProp<Multiple extends true ? Item[] : Item | null>;
	open?: WritableProp<boolean>;
	ids?: {
		label?: ReadableProp<string>;
		trigger?: ReadableProp<string>;
		menu?: ReadableProp<string>;
	};
}

export class Select<const Multiple extends boolean = false, Item = any> {
	#open: WritableBox<boolean>;
	#multiple: WritableBox<Multiple>;
	#selected: WritableBox<Multiple extends true ? Item[] : Item | null>;

	#ids: {
		labelId: ReadableBox<string>;
		triggerId: ReadableBox<string>;
		menuId: ReadableBox<string>;
	};

	constructor({
		multiple = false as Multiple,
		open = false,
		selected = multiple ? [] : (null as any),
		ids: {
			label: labelId = generateId(),
			trigger: triggerId = generateId(),
			menu: menuId = generateId()
		} = {}
	}: SelectProps<Multiple, Item>) {
		this.#open = Box.writable(open);
		this.#multiple = Box.writable(multiple);
		this.#selected = Box.writable(selected);

		this.#ids = {
			labelId: Box.readable(labelId),
			triggerId: Box.readable(triggerId),
			menuId: Box.readable(menuId)
		};
	}

	get open() {
		return this.#open.value;
	}
	set open(v) {
		this.#open.value = v;
	}

	get multiple() {
		return this.#multiple.value;
	}
	set multiple(v) {
		this.#multiple.value = v;
	}

	get selected() {
		return this.#selected.value;
	}
	set selected(v) {
		this.#selected.value = v;
	}

	label() {
		const that = this;
		return {
			props: {
				get id() {
					return that.#ids.labelId;
				}
			}
		};
	}

	trigger() {
		const that = this;
		return {
			props: {
				get id() {
					return that.#ids.triggerId;
				}
			}
		};
	}

	menu() {
		const that = this;
		return {
			props: {
				get id() {
					return that.#ids.menuId;
				}
			}
		};
	}

	group() {}

	grouplabel() {}

	option() {}
}
