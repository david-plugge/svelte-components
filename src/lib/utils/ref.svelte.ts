export class Ref<T> {
	#value = $state() as T;

	constructor(value: T) {
		this.#value = value;
	}

	get value() {
		return this.#value;
	}
	set value(value) {
		this.#value = value;
	}

	onChange(fn: (value: T) => void) {
		return $effect.root(() => {
			fn(this.value);
		});
	}
}

export function ref<T>(value: T): Ref<T> {
	return new Ref(value);
}
