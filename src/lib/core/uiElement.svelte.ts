import { generateId } from '$lib/utils/id';
import type { ActionReturn } from 'svelte/action';

export abstract class UiElement<
	Element extends HTMLElement = HTMLElement,
	Parameter = undefined,
	Attributes extends Record<string, any> = Record<never, any>
> {
	#element = $state<Element>();
	#id = generateId();

	register(fn: (value: this | undefined) => void) {
		fn(this);
		$effect(() => () => fn(undefined));
	}

	get element() {
		if (!this.#element) {
			throw new Error(`Element not not mounted yet`);
		}
		return this.#element;
	}

	get id() {
		return this.#id;
	}

	protected _action(node: Element): ActionReturn<Parameter, Attributes> {
		return {};
	}

	get action() {
		return (node: Element): ActionReturn<Parameter, Attributes> => {
			this.#element = node;

			const a = this._action(node);

			return {
				destroy: () => {
					a.destroy?.();
					this.#element = undefined;
				},
				update(parameter) {
					a.update?.(parameter);
				}
			};
		};
	}

	abstract get props(): Record<string, any>;
}
