<script lang="ts" context="module">
	function useClickOutside(fn: (event: MouseEvent & { currentTarget: HTMLElement }) => void) {
		return (node: HTMLElement) => {
			return listen(node, 'click', (event) => {
				if (!event.currentTarget.contains(node)) {
					fn(event);
				}
			});
		};
	}
</script>

<script lang="ts">
	import { createAction } from '$lib/utils/behaviors';
	import { listen } from '$lib/utils/events';
	import { useFloating } from '$lib/utils/floating';
	import { generateId } from '$lib/utils/id';
	import { usePortal } from '$lib/utils/portal';
	import { fly } from 'svelte/transition';

	function createFloating(options: { reference: string }) {
		const id = generateId();

		return {
			action: createAction(
				(node) =>
					useFloating({
						floating: node,
						...options,
						reference: document.getElementById(options.reference)!
					}),
				usePortal
			),
			props: {
				get id() {
					return id;
				}
			} as const
		};
	}

	function createTrigger() {
		const id = generateId();

		return {
			action: createAction((node) => listen(node, 'click', () => {})),
			props: {
				type: 'button',
				get id() {
					return id;
				}
			} as const
		};
	}

	function createPopover() {
		const id = generateId();
		let open = $state(false);

		return {
			get open() {
				return open;
			},
			set open(value) {
				open = value;
			},
			props: {
				get id() {
					return id;
				}
			} as const
		};
	}

	const floating = createFloating({
		reference: 'trigger'
	});

	const popover = createPopover();
	const trigger = createTrigger();
</script>

<button use:trigger.action {...trigger.props}>Toggle</button>

{#if popover.open}
	<div transition:fly={{ y: 10 }} {...floating.props} use:floating.action>TEST</div>
{/if}
