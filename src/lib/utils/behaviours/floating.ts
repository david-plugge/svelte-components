import type { Behavior } from '../behaviors';
import { useFloating, type FloatingOptions } from '../floating';

export function float(options: Omit<FloatingOptions, 'floating'>): Behavior {
	return (node) => {
		return useFloating({
			floating: node,
			...options
		});
	};
}
