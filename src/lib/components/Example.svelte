<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export interface TriggerProps extends HTMLButtonAttributes {
		children?: Snippet;
	}
</script>

<script lang="ts">
	let { children, class: className, ...attributes }: TriggerProps = $props();
</script>

<button {...attributes} class={className}>
	{@render children?.()}
</button>
