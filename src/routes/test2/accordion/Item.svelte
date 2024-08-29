<script lang="ts">
	import { getContext, setContext, type Snippet } from 'svelte';
	import { Accordion } from './accordion.svelte';

	type RootProps = { children: Snippet; id: string };

	let { children, id }: RootProps = $props();

	const accordion = getContext<Accordion>(Accordion);

	const item = accordion.item(id);

	setContext('accordion-item', item);
</script>

<div>
	{@render children()}
</div>
