<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { AccordionItemState } from './state.svelte';

	export interface TriggerProps extends HTMLButtonAttributes {
		children?: Snippet;
	}
</script>

<script lang="ts">
	let { children, class: className, ...attributes }: TriggerProps = $props();

	const state = AccordionItemState.context.use();

	function action(node: HTMLButtonElement) {
		function handleClick() {
			state.toggle();
		}

		node.addEventListener('click', handleClick);

		return {
			destroy() {
				node.removeEventListener('click', handleClick);
			}
		};
	}
</script>

<button {...attributes} class={className} use:action>
	{@render children?.()}
</button>
