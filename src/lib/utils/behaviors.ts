export type Behavior = (node: HTMLElement) => (() => void) | void;

export function createAction(...behaviors: Behavior[]) {
	return (node: HTMLElement) => {
		const fns = behaviors.map((fn) => fn(node));

		return {
			destroy() {
				fns.forEach((fn) => fn?.());
			}
		};
	};
}
