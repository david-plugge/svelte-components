<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { Collapsible, type CollapsibleState } from './collapsible.svelte';

	type RootProps = {
		children: Snippet<[Collapsible]>;
		open?: CollapsibleState['open'];
	};

	let { children, open = $bindable(false) }: RootProps = $props();

	const collapsible = new Collapsible({
		...Collapsible.defaults(),
		get open() {
			return open;
		},
		set open(v) {
			open = v;
		}
	});

	setContext(Collapsible, collapsible);
</script>

{@render children(collapsible)}
