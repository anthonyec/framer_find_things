<script lang="ts">
	import { iterate } from '../utils/array';
	import { matchCase, type Range } from '../utils/text';

	interface Props {
		title: string;
		replacement: string | undefined;
		ranges: Range[];
		preserveCase: boolean;
	}

	let {
		title,
		replacement,
		ranges,
		preserveCase,
	}: Props = $props()

	const texts: { text: string; highlighted: boolean }[] = [];

	// TODO(anthony): Fix this, it's missing the start of text if range not at start.
	for (const { current, next, isEnd } of iterate(ranges)) {
		texts.push({ text: title.slice(...current), highlighted: true });

		if (next) {
			const inbetween: Range = [current[1], next[0]];

			const inbetweenLength = inbetween[1] - inbetween[0];
			if (inbetweenLength === 0) continue;

			texts.push({ text: title.slice(inbetween[0], inbetween[1]), highlighted: false });
		}

		if (isEnd) {
			texts.push({ text: title.slice(current[1], title.length), highlighted: false });
		}
	}

	$inspect("ranges", ranges)
</script>

{#each texts as { text, highlighted }}
	{#if replacement && highlighted}
		<span class="old">{text}</span>
		<span class="new">{preserveCase ? matchCase(replacement, text) : replacement}</span>
	{:else}
		<span class:highlighted>{text}</span>
	{/if}
{/each}

<style>
	.highlighted {
		background: red;
		border-radius: 3px;
	}

	.old {
		border-radius: 3px;
		color: gray;
		text-decoration: line-through;
	}

	.new {
		border-radius: 3px;
		color: cyan;
	}
</style>
