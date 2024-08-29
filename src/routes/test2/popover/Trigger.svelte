<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Popover } from './popover.svelte';

	type RootProps = { children: Snippet };

	let { children }: RootProps = $props();

	const popover = getContext<Popover>(Popover);

	const trigger = popover.trigger();
</script>

<button {...trigger.props} use:trigger.action>
	{@render children()}
</button>
