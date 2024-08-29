<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { AccordionItem } from './accordion.svelte';
	import { slideAndFade } from '$lib/utils/transition';

	type RootProps = { children: Snippet };

	let { children }: RootProps = $props();

	const item = getContext<AccordionItem>('accordion-item');

	const content = item.content();
</script>

{#if item.active}
	<div transition:slideAndFade={{ axis: 'y' }} class="" {...content.props} use:content.action>
		{@render children()}
	</div>
{/if}
