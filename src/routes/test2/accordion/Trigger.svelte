<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { type AccordionItem } from './accordion.svelte';

	type RootProps = { children: Snippet };

	let { children }: RootProps = $props();

	const item = getContext<AccordionItem>('accordion-item');

	const trigger = item.trigger();
</script>

<button {...trigger.props} use:trigger.action>
	{@render children()}
</button>
