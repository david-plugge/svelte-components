<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SelectTrigger } from './select.svelte';

	interface TriggerProps {
		children: Snippet;
	}

	let { children }: TriggerProps = $props();

	const trigger = new SelectTrigger();
</script>

<button {...trigger.props} use:trigger.action>
	{@render children()}
</button>
