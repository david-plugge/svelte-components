<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { Combobox, type ComboboxState } from './combobox.svelte';

	type RootProps = {
		children: Snippet<[Combobox]>;
		open?: ComboboxState['open'];
		selected?: ComboboxState['selected'];
	};

	let { children, open = $bindable(false), selected = $bindable(null) }: RootProps = $props();

	const combobox = new Combobox({
		...Combobox.defaults(),
		get open() {
			return open;
		},
		set open(v) {
			open = v;
		},
		get selected() {
			return selected;
		},
		set selected(v) {
			selected = v;
		}
	});

	setContext(Combobox, combobox);
</script>

{@render children(combobox)}
