<script lang="ts">
	import { onMount } from 'svelte';
	import { getBerryList } from '$lib/api/fetcher';
	import { theme } from '$lib/stores';
	import type { BerryList, Berry } from '$lib/api/schemas';

	let berries: Omit<Berry, 'firmness' | 'flavors' | 'growth_time' | 'size'>[] = $state([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let offset = $state(0);
	let hasMore = $state(true);

	async function loadBerries() {
		if (loading || !hasMore) return;
		loading = true;
		error = null;

		try {
			const list = await getBerryList(30, offset);
			hasMore = list.next !== null;
			berries = [...berries, ...list.results as any[]];
			offset += 30;
		} catch (e) {
			error = 'Failed to load berries';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadBerries();
	});
</script>

<div class="space-y-6">
	<h1 class="text-3xl font-bold">Berries</h1>

	{#if error}
		<div class="rounded bg-red-100 p-4 text-red-800">
			{error}
		</div>
	{/if}

	<!-- Berries grid -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each berries as berry (berry.id)}
			<a
				href="/berries/{berry.name}"
				class={`rounded-lg p-6 transition hover:scale-105 ${
					$theme === 'dark'
						? 'bg-slate-700 hover:bg-slate-600'
						: 'bg-white hover:bg-slate-50 border border-slate-200'
				}`}
			>
				<h3 class="text-lg font-bold capitalize">{berry.name}</h3>
				<p class={`text-sm ${$theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
					Berry #{berry.id}
				</p>
			</a>
		{/each}

		<!-- Skeleton loaders -->
		{#if loading}
			{#each { length: 6 } as _}
				<div
					class={`rounded-lg p-6 ${
						$theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
					} animate-pulse`}
				>
					<div class={`h-6 rounded ${$theme === 'dark' ? 'bg-slate-600' : 'bg-slate-200'}`}></div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Load more button -->
	{#if hasMore && !loading}
		<div class="flex justify-center py-8">
			<button
				onclick={loadBerries}
				class="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
			>
				Load More
			</button>
		</div>
	{/if}
</div>
