import { UiElement } from '$lib/core';
import { useActions } from '$lib/utils/actions';
import { clickOutside, listen } from '$lib/utils/events';
import { useFloating } from '$lib/utils/floating';
import { getContext, setContext } from 'svelte';
import { Set } from 'svelte/reactivity';

export class ListboxState {
	multiple = $state(false);
	autoSelect = $state(!this.multiple);
	open = $state(false);
	selected = new Set<ListboxItem>();
	focused = $state<ListboxItem | null>(null);

	listbox = $state<Listbox>();
	items = new Map<string, ListboxItem>();

	constructor() {
		setContext('listbox-state', this);
	}

	static use() {
		const state = getContext<ListboxState>('listbox-state');
		if (!state) {
			throw new Error('Listbox state not available');
		}
		return state;
	}

	select(item: any) {
		if (this.selected.has(item)) return;

		if (!this.multiple && this.selected.size !== 0) this.selected.clear();
		this.selected.add(item);
	}

	unselect(item: any) {
		this.selected.delete(item);
	}
}

export class Listbox extends UiElement {
	#state = ListboxState.use();

	constructor() {
		super();
		this.register((v) => (this.#state.listbox = v));
	}

	get open() {
		return this.#state.open;
	}

	#getSelectionInfo() {
		const options = Array.from(this.element.querySelectorAll<HTMLElement>('[role="option"]')).map(
			(item) => this.#state.items.get(item.id)!
		);
		const focusIndex = options.findIndex((item) => item.focused);

		return {
			options,
			focusIndex
		};
	}

	#handleCursor(item?: ListboxItem) {
		if (!item) return;

		item.focus();
		this.#state.autoSelect && !this.#state.multiple && item.select();
	}

	next() {
		const { options, focusIndex } = this.#getSelectionInfo();
		const newIndex = (focusIndex + 1) % options.length;
		this.#handleCursor(options[newIndex]);
	}

	prev() {
		const { options, focusIndex } = this.#getSelectionInfo();
		const newIndex = (options.length + focusIndex - 1) % options.length;
		this.#handleCursor(options[newIndex]);
	}

	first() {
		const { options } = this.#getSelectionInfo();
		this.#handleCursor(options[0]);
	}

	last() {
		const { options } = this.#getSelectionInfo();
		this.#handleCursor(options[options.length - 1]);
	}

	protected _action(node: HTMLElement) {
		const handleFocus = () => {
			const { options } = this.#getSelectionInfo();
			options.find((item) => item.selected)?.focus();
		};

		const handleBlur = () => {
			this.#state.focused = null;
		};

		const handleKeydown = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'ArrowDown': {
					this.next();

					break;
				}
				case 'ArrowUp': {
					this.prev();
					break;
				}
				case 'Home': {
					this.first();
					break;
				}
				case 'End': {
					this.last();
					break;
				}

				case 'Enter':
				case ' ':
					this.#state.focused?.toggle();
					break;
			}
		};

		const unsub = [
			listen(node, 'focus', handleFocus),
			listen(node, 'blur', handleBlur),
			listen(node, 'keydown', handleKeydown)
		];

		return {
			destroy: () => {
				unsub.forEach((fn) => fn());
			}
		};
	}

	get props() {
		const that = this;
		return {
			id: this.#state.listbox!.id,
			tabindex: 0,
			role: 'menu',
			get 'aria-expanded'() {
				return that.#state.open;
			}
		} as const;
	}
}

export class ListboxItem extends UiElement {
	#state = ListboxState.use();
	#value = $state<any>();

	constructor(value: any) {
		super();
		this.#value = value;
		this.register((v) => {
			if (v) {
				this.#state.items.set(this.id, v);
			} else {
				this.#state.items.delete(this.id);
			}
		});
	}

	get value() {
		return this.#value;
	}

	get selected() {
		return this.#state.selected.has(this);
	}

	get focused() {
		return this.#state.focused === this;
	}

	select() {
		this.#state.select(this);
	}

	focus() {
		this.#state.focused = this;
	}

	unselect() {
		this.#state.unselect(this);
	}

	toggle() {
		if (this.selected) {
			this.unselect();
		} else {
			this.select();
		}
	}

	protected _action(node: HTMLElement) {
		return {
			destroy: useActions(
				listen(node, 'click', () => {
					this.focus();
					if (this.#state.multiple) this.toggle();
					else this.select();
				}),
				listen(node, 'pointerenter', () => {
					this.focus();
				})
			)
		};
	}

	get props() {
		const that = this;
		return {
			id: this.id,
			role: 'option',
			get 'aria-selected'() {
				return that.selected;
			}
		} as const;
	}
}

export class SelectState extends ListboxState {
	open = $state(false);

	trigger = $state<SelectTrigger>();
	content = $state<SelectContent>();
	label = $state<SelectLabel>();

	constructor() {
		super();
		setContext('select-state', this);
	}

	static use() {
		const state = getContext<SelectState>('select-state');
		if (!state) {
			throw new Error('Listbox state not available');
		}
		return state;
	}
}

export class SelectTrigger extends UiElement {
	#state = SelectState.use();

	constructor() {
		super();
		this.register((v) => (this.#state.trigger = v));
	}

	protected _action(node: HTMLElement) {
		const unsub = [
			listen(node, 'click', () => {
				this.#state.open = !this.#state.open;
			})
		];

		return {
			destroy() {
				unsub.forEach((fn) => fn());
			}
		};
	}

	get props() {
		return {
			id: this.id
		};
	}
}

export class SelectContent extends Listbox {
	#state = SelectState.use();

	constructor() {
		super();
		this.register((v) => (this.#state.content = v));
	}

	protected _action(node: HTMLElement) {
		const unsub = [
			super._action(node).destroy,
			clickOutside(node, (e) => {
				if (e.target instanceof HTMLElement && !this.#state.trigger?.element.contains(e.target)) {
					this.#state.open = false;
				}
			}),
			useFloating({
				floating: this.element,
				reference: this.#state.trigger!.element,
				sameWidth: true,
				placement: 'bottom'
			})
		];

		return {
			destroy() {
				unsub.forEach((fn) => fn());
			}
		};
	}
}

export class SelectItem extends ListboxItem {}

export class SelectGroup extends UiElement {
	constructor() {
		super();
	}

	get props() {
		return {
			id: this.id,
			role: 'group'
		};
	}
}

export class SelectLabel extends UiElement {
	#state = SelectState.use();

	constructor() {
		super();
		this.register((v) => (this.#state.label = v));
	}

	get props() {
		return {
			id: this.id
		};
	}
}
