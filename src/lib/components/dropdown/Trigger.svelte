<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { DropdownState } from './state.svelte';

	export interface TriggerProps extends HTMLButtonAttributes {
		children?: Snippet;
	}
</script>

<script lang="ts">
	let { children, class: className, ...attributes }: TriggerProps = $props();

	const state = DropdownState.use();

	function action(node: HTMLButtonElement) {
		function open() {
			state.open = !state.open;
		}

		node.addEventListener('click', open);

		return {
			destroy() {
				node.removeEventListener('click', open);
			}
		};
	}
</script>

<button id={state.ids.trigger} {...attributes} class={className} use:action>
	{@render children?.()}
</button>
