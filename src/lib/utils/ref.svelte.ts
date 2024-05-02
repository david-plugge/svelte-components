export interface Ref<T> {
	value: T;
}

export function ref<T>(value: T): Ref<T> {
	let state = $state(value);

	return {
		get value() {
			return state;
		},
		set value(newValue) {
			state = newValue;
		}
	};
}
