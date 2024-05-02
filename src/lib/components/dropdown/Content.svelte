<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { DropdownState } from './state.svelte';
	import { fly } from 'svelte/transition';

	export interface ContentProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { useFloating } from '$lib/utils/floating';
	import { removeScroll } from '$lib/utils/scroll';

	let { children, ...attributes }: ContentProps = $props();

	const state = DropdownState.use();

	function action(node: HTMLElement) {
		const anchor = document.getElementById(state.ids.trigger)!;
		if (!anchor) return;

		const handleClick = (e: MouseEvent) => {
			if (!node.contains(e.target as Element) && !anchor?.contains(e.target as Element)) {
				state.open = false;
			}
		};

		const stopFloating = useFloating({
			floating: node,
			reference: anchor,
			placement: 'bottom'
		});

		window.addEventListener('click', handleClick);

		return {
			destroy() {
				stopFloating();
				window.removeEventListener('click', handleClick);
			}
		};
	}

	$effect(() => (state.open ? removeScroll() : () => {}));
</script>

{#if state.open}
	<div id={state.ids.content} use:action {...attributes} transition:fly={{ y: -10 }}>
		{@render children?.()}
	</div>
{/if}

<style>
	div {
		width: max-content;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
