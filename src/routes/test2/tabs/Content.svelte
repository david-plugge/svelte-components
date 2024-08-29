<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Tabs } from './tabs.svelte';

	type RootProps = { children: Snippet; id: string };

	let { children, id }: RootProps = $props();

	const tabs = getContext<Tabs>(Tabs);

	const content = tabs.content(id);
</script>

{#if content.active}
	<div {...content.props} use:content.action>
		{@render children()}
	</div>
{/if}
