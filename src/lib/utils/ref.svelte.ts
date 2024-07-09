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
}

export function ref<T>(value: T): Ref<T> {
	return new Ref(value);
}
