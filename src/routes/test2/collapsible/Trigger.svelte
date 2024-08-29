<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Collapsible } from './collapsible.svelte';

	type RootProps = { children: Snippet };

	let { children }: RootProps = $props();

	const collapsible = getContext<Collapsible>(Collapsible);

	const trigger = collapsible.trigger();
</script>

<button {...trigger.props} use:trigger.action>
	{@render children()}
</button>
