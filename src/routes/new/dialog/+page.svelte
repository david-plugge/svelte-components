<script lang="ts">
	import { UiElement } from '$lib/core';
	import { clickOutside, listen } from '$lib/utils/events';
	import { getContext, setContext } from 'svelte';

	class DialogState {
		trigger = $state<DialogTrigger>();
		content = $state<DialogContent>();

		open = $state(false);

		constructor() {
			setContext('dialog-state', this);
		}

		static use() {
			const state = getContext<DialogState>('dialog-state');
			if (!state) {
				throw new Error('Dialog state not available');
			}
			return state;
		}
	}

	class DialogTrigger extends UiElement {
		#state = DialogState.use();

		constructor() {
			super();
			this.register((v) => (this.#state.trigger = v));
		}

		get open() {
			return this.#state.open;
		}

		protected _action(node: HTMLElement) {
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
				id: this.id,
				type: 'button',
				get 'aria-expanded'() {
					return that.open;
				}
			} as const;
		}
	}

	class DialogContent extends UiElement {
		#state = DialogState.use();

		constructor() {
			super();
			this.register((v) => (this.#state.content = v));
		}

		get action() {
			return (node: HTMLElement) => {
				const handleGlobalClick = (e: MouseEvent) => {
					if (
						e.target instanceof HTMLElement &&
						!this.#state.trigger?.element?.contains(e.target)
					) {
						this.#state.open = false;
					}
				};

				return {
					destroy: clickOutside(node, handleGlobalClick)
				};
			};
		}

		get props() {
			return {
				id: this.id
			} as const;
		}
	}

	const _state = new DialogState();
	const trigger = new DialogTrigger();
	const content = new DialogContent();
</script>

<button {...trigger.props} use:trigger.action>Open</button>

{#if _state.open}
	<div {...content.props} use:content.action>
		<div>Hello world</div>
	</div>
{/if}
