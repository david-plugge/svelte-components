import { Box, type WritableBox, type WritableProp } from './box.svelte';

export namespace Popover {
	interface StateProps {
		open?: WritableProp<boolean>;
	}

	class State {
		trigger = Box.writable<Trigger | null>(null);
		content = Box.writable<Content | null>(null);

		open: WritableBox<boolean>;

		constructor({ open = false }: StateProps = {}) {
			this.open = Box.writable(open);
		}
	}

	export interface RootProps {
		open?: WritableProp<boolean>;
	}

	export class Root {
		#state: State;

		constructor(props: RootProps) {
			this.#state = new State({
				open: props.open
			});
		}

		get open() {
			return this.#state.open.value;
		}
		set open(v) {
			this.#state.open.value = v;
		}
	}

	export class Trigger {
		constructor() {}
	}

	export class Content {
		constructor() {}
	}
}
