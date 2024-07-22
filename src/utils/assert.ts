export function assert(condition: unknown, ...message: unknown[]): asserts condition {
	if (condition) return;
	throw Error(`Assertion error: ${message.join(', ')}`);
}
