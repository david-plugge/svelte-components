type Prettify<T> = { [K in keyof T]: T[K] } & {};

export namespace ReactiveObject {
	export function pick<T extends Record<string, any>, K extends keyof T>(
		obj: T,
		keys: K[]
	): Prettify<Pick<T, K>> {
		const target = {} as any;

		for (const key of keys) {
			forwardProperty(obj, target, key);
		}

		return target;
	}

	export function omit<T extends Record<string, any>, K extends keyof T>(
		obj: T,
		keys: K[]
	): Prettify<Omit<T, K>> {
		const target = {} as any;
		const descriptors = Object.getOwnPropertyDescriptors(obj);

		for (const key in descriptors) {
			if (keys.includes(key as K)) continue;
			forwardProperty(obj, target, key);
		}

		return target;
	}

	export function merge<A extends Record<string, any>, B extends Record<string, any>>(
		a: A,
		b: B
	): Prettify<Omit<A, keyof B> & B> {
		const target = {} as any;

		for (const key in a) {
			if (key in b) continue;
			forwardProperty(a, target, key);
		}
		for (const key in b) {
			forwardProperty(b, target, key);
		}
		return target;
	}

	function forwardProperty(source: any, target: any, key: PropertyKey) {
		const desc = Object.getOwnPropertyDescriptor(source, key);

		return Object.defineProperty(target, key, {
			enumerable: desc?.enumerable,
			get: () => {
				return source[key];
			},
			set:
				desc?.set || desc?.writable
					? (v) => {
							source[key] = v;
						}
					: undefined,
			configurable: desc?.configurable
		});
	}
}
