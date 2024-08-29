<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { Select, type SelectState } from './select.svelte';

	type RootProps = {
		children: Snippet<[Select]>;
		open?: SelectState['open'];
		selected?: SelectState['selected'];
	};

	let { children, open = $bindable(false), selected = $bindable(null) }: RootProps = $props();

	const select = new Select({
		...Select.defaults(),
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

	setContext(Select, select);
</script>

{@render children(select)}
