<script lang="ts" context="module">
	import { portal } from '$lib/utils/portal';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { DialogState } from './state.svelte';
	import { fade, fly } from 'svelte/transition';

	export interface ContentProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
	}
</script>

<script lang="ts">
	import { modifiers } from '$lib/utils/events';
	import { removeScroll } from '$lib/utils/scroll';

	let { children, class: className, ...attributes }: ContentProps = $props();

	const state = DialogState.use();

	function action(node: HTMLElement) {
		const handleClick = modifiers({ self: true }, (e: MouseEvent) => {
			state.open = false;
		});

		node.addEventListener('click', handleClick);

		return {
			destroy() {
				node.removeEventListener('click', handleClick);
			}
		};
	}

	$effect(() => (state.open ? removeScroll() : () => {}));
</script>

{#if state.open}
	<div
		class="fixed inset-0 grid place-items-center bg-black/20"
		use:portal
		transition:fade
		use:action
	>
		<div {...attributes} transition:fly={{ y: 50 }} class="rounded-lg bg-white p-4 {className}">
			{@render children?.()}
		</div>
	</div>
{/if}
