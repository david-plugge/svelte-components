<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Tabs } from './tabs.svelte';

	type RootProps = { children: Snippet; id: string };

	let { children, id }: RootProps = $props();

	const popover = getContext<Tabs>(Tabs);

	const trigger = popover.trigger(id);
</script>

<button {...trigger.props} use:trigger.action>
	{@render children()}
</button>
