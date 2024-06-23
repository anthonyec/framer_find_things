export function prepend<T>(array: T[], value: T): T[] {
	return [value, ...array];
}

export function append<T>(array: T[], value: T): T[] {
	return [...array, value];
}

export function insert<T>(array: T[], index: number, value: T): T[] {
	return [...array.slice(0, index), value, ...array.slice(index, array.length)];
}

export function replace<T>(array: T[], index: number, value: T): T[] {
	return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

export function remove<T>(array: T[], index: number): T[] {
	return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function first<T>(array: T[]): NonNullable<T> | undefined {
	const item = array[0];
	if (item === undefined || item === null) return;

	return item;
}

export function last<T>(array: T[]): NonNullable<T> | undefined {
	const item = array[array.length - 1];
	if (item === undefined || item === null) return;

	return item;
}

export function reverse<T>(array: T[]): T[] {
	return [...array].reverse();
}

export function sort<T>(array: T[], compare?: (a: T, b: T) => number): T[] {
	return [...array].sort(compare);
}

export function previous<T>(array: T[], index: number): NonNullable<T> | undefined {
	if (index === 0) return;

	const item = array[index - 1];
	if (item === undefined || item === null) return;

	return item;
}

export function next<T>(array: T[], index: number): NonNullable<T> | undefined {
	if (index >= array.length - 1) return;

	const item = array[index + 1];
	if (item === undefined || item === null) return;

	return item;
}

export function forwards(iterations: number, length: number): number {
	return iterations + 1;
}

export function backwards(iterations: number, length: number): number {
	return length - 1 - iterations;
}

export function skip(every: number): IterationBehaviour {
	return (iterations: number): number => {
		return iterations * every;
	};
}

type IterationBehaviour = (iterations: number, length: number) => number;

export function iterate<T>(array: T[], behaviour: IterationBehaviour = forwards) {
	return {
		[Symbol.iterator]() {
			let index = behaviour(-1, array.length);
			let iterations = 0;

			return {
				next() {
					if (iterations > array.length * 3) {
						throw Error('Infinite loop protection');
					}

					const value = {
						index,
						current: array[index],
						previous: previous(array, index),
						next: next(array, index),
						isStart: index === 0,
						isEnd: index === array.length - 1
					};

					if (index >= 0 && index < array.length) {
						index = behaviour(iterations, array.length);
						iterations += 1;
						return { value, done: false };
					}

					return { value: value, done: true };
				}
			};
		}
	};
}
