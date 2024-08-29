<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { Popover, type PopoverState } from './popover.svelte';

	type RootProps = {
		children: Snippet<[Popover]>;
		open?: PopoverState['open'];
	};

	let { children, open = $bindable(false) }: RootProps = $props();

	const popover = new Popover({
		...Popover.defaults(),
		get open() {
			return open;
		},
		set open(v) {
			open = v;
		}
	});

	setContext(Popover, popover);
</script>

{@render children(popover)}
