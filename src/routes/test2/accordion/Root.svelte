<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { Accordion, type AccordionState } from './accordion.svelte';

	type RootProps = {
		children: Snippet<[Accordion]>;
		open?: AccordionState['open'];
	};

	let { children, open = $bindable(false) }: RootProps = $props();

	const accordion = new Accordion({
		...Accordion.defaults(),
		get open() {
			return open;
		},
		set open(v) {
			open = v;
		}
	});

	setContext(Accordion, accordion);
</script>

{@render children(accordion)}
