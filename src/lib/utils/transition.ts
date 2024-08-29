import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function slideStyle(node: HTMLElement, axis: 'y' | 'x' = 'y') {
	const style = getComputedStyle(node);
	const primary_property = axis === 'y' ? 'height' : 'width';
	const primary_property_value = parseFloat(style[primary_property]);
	const secondary_properties = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
	const capitalized_secondary_properties = secondary_properties.map(
		(e) => `${e[0].toUpperCase()}${e.slice(1)}`
	) as ('Left' | 'Right' | 'Top' | 'Bottom')[];
	const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
	const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
	const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
	const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
	const border_width_start_value = parseFloat(
		style[`border${capitalized_secondary_properties[0]}Width`]
	);
	const border_width_end_value = parseFloat(
		style[`border${capitalized_secondary_properties[1]}Width`]
	);
	return (t: number) => ({
		overflow: 'hidden',
		[primary_property]: `${t * primary_property_value}px`,
		[`padding-${secondary_properties[0]}`]: `${t * padding_start_value}px`,
		[`padding-${secondary_properties[1]}`]: `${t * padding_end_value}px`,
		[`margin-${secondary_properties[0]}`]: `${t * margin_start_value}px`,
		[`margin-${secondary_properties[1]}`]: `${t * margin_end_value}px`,
		[`border-${secondary_properties[0]}-width`]: `${t * border_width_start_value}px`,
		[`border-${secondary_properties[1]}-width`]: `${t * border_width_end_value}px`
	});
}

const styleToString = (style: Record<string, number | string | undefined>): string => {
	return Object.keys(style).reduce((str, key) => {
		if (style[key] === undefined) return str;
		return str + `${key}:${style[key]};`;
	}, '');
};
const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
	const [minA, maxA] = scaleA;
	const [minB, maxB] = scaleB;

	const percentage = (valueA - minA) / (maxA - minA);
	const valueB = percentage * (maxB - minB) + minB;

	return valueB;
};

export type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export type SlideAndFadeParams = {
	axis?: 'y' | 'x';
	start?: number;
	duration?: number;
	delay?: number;
};

export const slideAndFade = (
	node: HTMLElement,
	params: SlideAndFadeParams = {}
): TransitionConfig => {
	const slideConfig = slideStyle(node, params.axis);

	return {
		duration: params.duration ?? 250,
		delay: params.delay,
		css: (t) => {
			return styleToString({
				...slideConfig(t),
				opacity: t
			});
		},
		easing: cubicOut
	};
};
