import {
	flip,
	shift,
	offset,
	computePosition,
	autoUpdate,
	type ReferenceElement,
	size,
	type Placement,
	type Strategy
} from '@floating-ui/dom';

export interface FloatingConfig {
	placement?: Placement;
	strategy?: Strategy;
	overflowPadding?: number;
	offset?: number;
	flip?: boolean;
	sameWidth?: boolean;
	fitViewport?: boolean;
}

export interface FloatingOptions extends FloatingConfig {
	reference: ReferenceElement;
	floating: HTMLElement;
}

export function useFloating({
	floating,
	reference,
	strategy = 'absolute',
	placement = 'top',
	flip: enableFlip = true,
	offset: offsetValue = 5,
	overflowPadding = 8,
	sameWidth = false,
	fitViewport = false
}: FloatingOptions) {
	const middleware = [
		enableFlip &&
			flip({
				padding: overflowPadding
			}),
		shift({
			padding: overflowPadding
		}),
		offset({ mainAxis: offsetValue }),
		size({
			padding: overflowPadding,
			apply({ rects, availableHeight, availableWidth }) {
				if (sameWidth) {
					Object.assign(floating.style, {
						width: `${Math.round(rects.reference.width)}px`,
						minWidth: 'unset'
					});
				}

				if (fitViewport) {
					Object.assign(floating.style, {
						maxHeigth: `${availableHeight}px`,
						maxWidth: `${availableWidth}px`
					});
				}
			}
		})
	];

	function compute() {
		computePosition(reference, floating, {
			placement,
			middleware
		}).then((data) => {
			const x = Math.round(data.x);
			const y = Math.round(data.y);

			Object.assign(floating.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
	}

	floating.style.position = strategy;

	return autoUpdate(reference, floating, compute);
}
