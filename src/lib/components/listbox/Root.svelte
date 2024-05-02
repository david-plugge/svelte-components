<script lang="ts" context="module">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { ListboxState } from './state.svelte';

	export interface RootProps extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		multiple?: boolean;
	}
</script>

<script lang="ts">
	let { children, multiple, ...attributes }: RootProps = $props();

	const state = ListboxState.context.provide({ multiple });

	function handleKeyDown(e: KeyboardEvent) {
		const target = e.target as HTMLElement;

		const items = Array.from(target.querySelectorAll<HTMLElement>('[role="option"]'));
		if (items.length === 0) return;

		const active = target.querySelector<HTMLElement>('[aria-selected="true"]');
		const index = active ? items.indexOf(active) : -1;

		if (e.key === 'ArrowUp') {
			if (index === -1) state.toggle(items[items.length - 1].id, true);
			else state.toggle(items[(items.length + index - 1) % items.length].id, true);
		}
		if (e.key === 'ArrowDown') {
			if (index === -1) state.toggle(items[0].id, true);
			else state.toggle(items[(index + 1) % items.length].id, true);
		}
		if (e.key === 'Home') {
			state.toggle(items[0].id, true);
		}
		if (e.key === 'End') {
			state.toggle(items[items.length - 1].id, true);
		}
	}
</script>

<div tabindex="0" role="menu" {...attributes} onkeydown={handleKeyDown}>
	{@render children?.()}
</div>
