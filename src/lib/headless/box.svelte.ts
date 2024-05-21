export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;
export type ReadableProp<T> = T | Getter<T> | { get: Getter<T> };
export type WritableProp<T> = T | { get: Getter<T>; set: Setter<T> };

export type ReadableBox<T> = { readonly value: T };
export type WritableBox<T> = { value: T };

export class Box<T> {
	constructor(
		private readonly get: () => T,
		private readonly set?: (value: T) => void
	) {}

	get value() {
		return this.get();
	}

	set value(value: T) {
		if (typeof this.set !== 'function') {
			throw new Error('Cannot set readonly value');
		}
		this.set(value);
	}

	static readable<T>(
		value: ReadableProp<T>,
		{ proxy = false }: { proxy?: boolean } = {}
	): ReadableBox<T> {
		if (typeof value === 'function') {
			return new Box(value as Getter<T>);
		}
		if (value !== null && typeof value === 'object' && 'get' in value) {
			return new Box(value.get.bind(value) as Getter<T>);
		}
		if (proxy) {
			const boxed = $state({ value });
			return boxed;
		}
		return {
			value
		};
	}

	static writable<T>(value: WritableProp<T>): WritableBox<T> {
		if (value !== null && typeof value === 'object' && 'get' in value && 'set' in value) {
			return new Box(value.get.bind(value), value.set.bind(value));
		}
		const boxed = $state({ value });
		return boxed;
	}
}
