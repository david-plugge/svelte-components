<script lang="ts" context="module">
	import {
		Box,
		type ReadableBox,
		type WritableBox,
		type WritableProp
	} from '$lib/headless/box.svelte';

	export interface RootProps {
		disabled?: WritableProp<boolean>;
		selected?: WritableProp<any>;
		multiple?: WritableProp<boolean>;
	}

	export class Root {
		#disabled: WritableBox<boolean>;
		#selected: WritableBox<any>;
		#multiple: WritableBox<boolean>;

		constructor({ disabled = false, selected = false, multiple = false }: RootProps = {}) {
			this.#disabled = Box.writable(disabled);
			this.#selected = Box.readable(selected);
			this.#multiple = Box.readable(multiple);
		}

		get disabled() {
			return this.#disabled.value;
		}
		set disabled(v) {
			this.#disabled.value = v;
		}

		get selected() {
			return this.#selected.value;
		}
		set selected(v) {
			this.#selected.value = v;
		}

		get multiple() {
			return this.#multiple.value;
		}
		set multiple(v) {
			this.#multiple.value = v;
		}
	}
</script>

<script lang="ts">
	import { setContext, type Snippet } from 'svelte';

	let {
		children,
		selected = $bindable(),
		disabled = $bindable(false),
		multiple = $bindable(false)
	}: {
		children: Snippet;
		selected?: any;
		disabled?: boolean;
		multiple?: boolean;
	} = $props();

	const root = new Root({
		disabled: {
			get: () => disabled,
			set: (v) => (disabled = v)
		},
		selected: {
			get: () => selected,
			set: (v: any) => (selected = v)
		},
		multiple: {
			get: () => multiple,
			set: (v) => (multiple = v)
		}
	});
	setContext('root', root);
</script>

{@render children()}
