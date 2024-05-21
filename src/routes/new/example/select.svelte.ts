import { generateId } from '$lib/utils/id';

class Box<T> {
	value = $state() as T;
	constructor(value: T) {
		this.value = value;
	}

	static #isBox(value: unknown): value is { value: any } {
		return (
			value instanceof Box || (value !== null && typeof value === 'object' && 'value' in value)
		);
	}

	static create<T>(value: T | Box<T>): Box<T> {
		return Box.#isBox(value) ? value : new Box(value);
	}
}
type Prop<T> = Box<T> | T;

interface SelectState {
	multiple: Box<boolean>;
	disabled: Box<boolean>;
	highlighted: Box<any>;
	selected: Box<any>;
}

class SelectCore {
	#multiple = false;
	#disabled = false;
	#highlighted = null;
	#selected = null;

	#trigger: SelectTrigger | null = null;
	#menu: SelectMenu | null = null;

	constructor({
		multiple = false,
		disabled = false
	}: { multiple?: boolean; disabled?: boolean } = {}) {
		this.#multiple = multiple;
		this.#disabled = disabled;
		this.#highlighted = null;
		this.#selected = null;
	}

	get disabled() {
		return this.#disabled;
	}
	set disabled(v) {
		this.#disabled = v;
	}
	get multiple() {
		return this.#multiple;
	}
	set multiple(v) {
		if (this.#multiple === v) return;
		this.#multiple = v;

		if (v) {
			this.#selected = new Set([this.#selected]);
		} else {
			this.#selected = [...this.#selected][0] ?? null;
		}
	}
	get selected() {
		if (this.multiple) {
			return [...this.#selected];
		} else {
			return this.#selected;
		}
	}
	set selected(v) {
		if (this.multiple) {
			this.#selected = new Set(v);
		} else {
			this.#selected = v;
		}
	}

	#select(value: any) {
		if (this.#multiple) {
			this.#selected.add(value);
		} else {
			this.#selected = value;
		}
	}

	#unselect(value: any) {
		if (this.#multiple) {
			this.#selected.delete(value);
		} else if (this.#selected === value) {
			this.#selected = null;
		}
	}

	createOption() {
		return {
			action: () => {
				return {
					destroy: () => {}
				};
			},
			props: {
				get id() {
					return generateId();
				}
			}
		};
	}
}
