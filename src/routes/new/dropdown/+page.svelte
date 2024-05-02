<script lang="ts">
	import { UiElement } from '$lib/core';
	import { useActions } from '$lib/utils/actions';
	import { clickOutside, listen } from '$lib/utils/events';
	import { useFloating } from '$lib/utils/floating';
	import { getContext, setContext } from 'svelte';

	class DropdownState {
		open = $state(false);

		trigger = $state<DropdownTrigger>();
		content = $state<DropdownContent>();

		constructor() {
			setContext('dropdown-state', this);
		}

		static use() {
			const state = getContext<DropdownState>('dropdown-state');
			if (!state) {
				throw new Error('Dropdown state not available');
			}
			return state;
		}
	}

	class DropdownTrigger extends UiElement {
		#state = DropdownState.use();

		constructor() {
			super();
			this.register((v) => (this.#state.trigger = v));
		}

		get open() {
			return this.#state.open;
		}

		_action(node: HTMLElement) {
			const handleClick = () => {
				this.#state.open = !this.#state.open;
			};

			return {
				destroy: listen(node, 'click', handleClick)
			};
		}

		get props() {
			const that = this;
			return {
				id: this.#state.trigger!.id,
				type: 'button',
				get 'aria-expanded'() {
					return that.#state.open;
				}
			} as const;
		}
	}

	class DropdownContent extends UiElement {
		#state = DropdownState.use();

		constructor() {
			super();
			this.register((v) => (this.#state.content = v));
		}

		protected _action(node: HTMLElement) {
			const handleGlobalClick = (e: MouseEvent) => {
				if (e.target instanceof HTMLElement && !this.#state.trigger?.element.contains(e.target)) {
					this.#state.open = false;
				}
			};

			return {
				destroy: useActions(
					clickOutside(node, handleGlobalClick),
					useFloating({
						floating: node,
						reference: this.#state.trigger!.element,
						placement: 'bottom'
					})
				)
			};
		}

		get props() {
			return {
				id: this.id
			} as const;
		}
	}

	const _state = new DropdownState();
	const trigger = new DropdownTrigger();
	const content = new DropdownContent();
</script>

<button {...trigger.props} use:trigger.action>Open</button>

{#if _state.open}
	<div {...content.props} use:content.action>
		<div>Hello world</div>
	</div>
{/if}
