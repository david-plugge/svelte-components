<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { Dialog } from './dialog.svelte';

	type RootProps = { children: Snippet };

	let { children }: RootProps = $props();

	const dialog = getContext<Dialog>(Dialog);

	const trigger = dialog.trigger();
</script>

<button {...trigger.props} use:trigger.action>
	{@render children()}
</button>
