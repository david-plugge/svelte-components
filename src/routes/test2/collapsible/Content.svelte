<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Collapsible } from './collapsible.svelte';
	import { slideAndFade } from '$lib/utils/transition';

	type RootProps = { children: Snippet };

	let { children }: RootProps = $props();

	const collapsible = getContext<Collapsible>(Collapsible);

	const content = collapsible.content();
</script>

{#if collapsible.open}
	<div transition:slideAndFade={{ axis: 'y' }} {...content.props} use:content.action>
		{@render children()}
	</div>
{/if}
